-- =====================================================================
-- Instituto Costa da Mina · cursos, inscrições e lista de chamada
--
-- Princípios:
-- * O público (papel `anon`) não lê nem grava tabelas. Só pode chamar
--   turmas_publicas() e chamada_disponivel(), que não devolvem dados
--   pessoais.
-- * Inscrição e confirmação de presença públicas passam pelas Edge
--   Functions (captcha + limite de tentativas) e chamam funções que só o
--   papel `service_role` pode executar.
-- * A equipe usa o papel `authenticated` e enxerga apenas o que a sua
--   função permite (RLS). A professora não vê WhatsApp nem e-mail.
-- * Toda alteração fica no histórico (autor, data, motivo).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------

create type public.funcao_equipe as enum ('admin', 'coordenacao', 'professora');

create type public.status_turma as enum (
  'rascunho',
  'inscricoes_programadas',
  'inscricoes_abertas',
  'inscricoes_encerradas',
  'em_andamento',
  'concluida',
  'cancelada'
);

create type public.status_inscricao as enum ('confirmada', 'lista_espera', 'cancelada');

create type public.status_presenca as enum ('presente', 'ausente', 'justificada', 'nao_registrado');

create type public.metodo_presenca as enum ('qr_codigo', 'qr_whatsapp', 'manual');

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

-- Usuários administrativos. A conta de login fica em auth.users (Supabase
-- Auth); esta tabela diz quem é da equipe e com qual função.
create table public.equipe (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nome text not null check (char_length(btrim(nome)) between 2 and 120),
  funcao public.funcao_equipe not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.cursos (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 3 and 120),
  descricao text check (char_length(descricao) <= 4000),
  publico_alvo text check (char_length(publico_alvo) <= 500),
  carga_horaria text check (char_length(carga_horaria) <= 120),
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.turmas (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references public.cursos (id) on delete restrict,
  nome text not null check (char_length(btrim(nome)) between 2 and 120),
  local text check (char_length(local) <= 200),
  endereco text check (char_length(endereco) <= 300),
  dias_horarios text check (char_length(dias_horarios) <= 300),
  data_inicio date,
  data_fim date,
  vagas integer not null check (vagas between 1 and 500),
  inscricoes_inicio timestamptz,
  inscricoes_fim timestamptz,
  idade_minima integer check (idade_minima between 0 and 120),
  observacoes_publicas text check (char_length(observacoes_publicas) <= 1000),
  status public.status_turma not null default 'rascunho',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint turmas_periodo_inscricao check (
    inscricoes_inicio is null or inscricoes_fim is null or inscricoes_fim > inscricoes_inicio
  ),
  constraint turmas_periodo_aulas check (data_inicio is null or data_fim is null or data_fim >= data_inicio),
  constraint turmas_programada_tem_inicio check (
    status <> 'inscricoes_programadas' or inscricoes_inicio is not null
  )
);
create index turmas_curso_idx on public.turmas (curso_id);

create table public.aulas (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete cascade,
  numero integer check (numero between 1 and 500),
  titulo text check (char_length(titulo) <= 200),
  data date not null,
  hora_inicio time,
  hora_fim time,
  chamada_aberta_em timestamptz,
  chamada_fecha_em timestamptz,
  chamada_aberta_por uuid references auth.users (id) on delete set null,
  chamada_encerrada_em timestamptz,
  chamada_encerrada_por uuid references auth.users (id) on delete set null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint aulas_horario check (hora_inicio is null or hora_fim is null or hora_fim > hora_inicio),
  constraint aulas_janela_chamada check (
    chamada_aberta_em is null or chamada_fecha_em is null or chamada_fecha_em > chamada_aberta_em
  )
);
create index aulas_turma_idx on public.aulas (turma_id);
create index aulas_chamada_idx on public.aulas (chamada_fecha_em) where chamada_encerrada_em is null;

-- Dados pessoais mínimos. Sem CPF/RG.
create table public.participantes (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 3 and 120),
  data_nascimento date not null,
  -- só dígitos, DDD + número (10 ou 11 dígitos); 'anon-…' após anonimização
  whatsapp text not null unique check (whatsapp ~ '^[0-9]{10,11}$' or whatsapp like 'anon-%'),
  email text check (email is null or (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  bairro text not null check (char_length(btrim(bairro)) between 2 and 120),
  consentimento_em timestamptz not null,
  consentimento_versao text not null check (char_length(consentimento_versao) <= 40),
  anonimizado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.inscricoes (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete restrict,
  participante_id uuid not null references public.participantes (id) on delete restrict,
  codigo text not null unique check (codigo ~ '^CDM-[A-Z0-9]{4}-[A-Z0-9]{4}$'),
  status public.status_inscricao not null,
  posicao_espera integer check (posicao_espera > 0),
  disponibilidade text not null check (char_length(btrim(disponibilidade)) between 1 and 500),
  origem text not null default 'site' check (origem in ('site', 'equipe')),
  cancelada_em timestamptz,
  motivo_cancelamento text check (char_length(motivo_cancelamento) <= 500),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint inscricoes_espera_tem_posicao check ((status = 'lista_espera') = (posicao_espera is not null))
);
-- Uma inscrição ativa por pessoa por turma (prevenção de duplicidade).
create unique index inscricoes_unica_ativa on public.inscricoes (turma_id, participante_id) where status <> 'cancelada';
create index inscricoes_turma_status_idx on public.inscricoes (turma_id, status);

create table public.presencas (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aulas (id) on delete cascade,
  inscricao_id uuid not null references public.inscricoes (id) on delete cascade,
  status public.status_presenca not null,
  metodo public.metodo_presenca not null,
  registrado_em timestamptz not null default now(),
  -- null = registrado pela própria participante, pelo QR Code
  registrado_por uuid references auth.users (id) on delete set null,
  corrigido_em timestamptz,
  corrigido_por uuid references auth.users (id) on delete set null,
  motivo_correcao text check (char_length(motivo_correcao) <= 500),
  constraint presencas_unica unique (aula_id, inscricao_id),
  constraint presencas_correcao_completa check (
    (corrigido_em is null) = (corrigido_por is null) and (corrigido_em is null) = (motivo_correcao is null)
  )
);
create index presencas_inscricao_idx on public.presencas (inscricao_id);

-- Histórico de alterações (auditoria). Só leitura para admin/coordenação.
create table public.historico (
  id bigint generated always as identity primary key,
  tabela text not null,
  registro_id uuid,
  acao text not null check (acao in ('insert', 'update', 'delete')),
  autor uuid,
  autor_tipo text not null check (autor_tipo in ('equipe', 'publico', 'sistema')),
  motivo text,
  dados_antes jsonb,
  dados_depois jsonb,
  criado_em timestamptz not null default now()
);
create index historico_registro_idx on public.historico (tabela, registro_id);

-- Limite de tentativas das Edge Functions. Guarda só um hash, nunca o IP.
create table public.tentativas (
  id bigint generated always as identity primary key,
  acao text not null,
  chave text not null,
  criado_em timestamptz not null default now()
);
create index tentativas_busca_idx on public.tentativas (acao, chave, criado_em);

-- ---------------------------------------------------------------------
-- Funções auxiliares de permissão
-- ---------------------------------------------------------------------

create function public.minha_funcao() returns public.funcao_equipe
language sql stable security definer set search_path = public, pg_temp as $$
  select funcao from public.equipe where user_id = auth.uid() and ativo
$$;

create function public.eh_equipe() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select public.minha_funcao() is not null
$$;

create function public.pode_gerir() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(public.minha_funcao() in ('admin', 'coordenacao'), false)
$$;

create function public.eh_admin() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(public.minha_funcao() = 'admin', false)
$$;

-- Erros de negócio: SQLSTATE próprio + código legível na mensagem.
create function public.falhar(codigo text, detalhe text default null) returns void
language plpgsql as $$
begin
  raise exception using errcode = 'P0001', message = codigo, detail = coalesce(detalhe, '');
end
$$;

-- ---------------------------------------------------------------------
-- Auditoria
-- ---------------------------------------------------------------------

create function public.registrar_historico() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_autor uuid := auth.uid();
  v_tipo text := coalesce(nullif(current_setting('app.origem', true), ''),
                          case when auth.uid() is null then 'sistema' else 'equipe' end);
  v_motivo text := nullif(current_setting('app.motivo', true), '');
  v_id uuid;
begin
  if tg_op = 'DELETE' then
    v_id := (to_jsonb(old) ->> case when tg_table_name = 'equipe' then 'user_id' else 'id' end)::uuid;
  else
    v_id := (to_jsonb(new) ->> case when tg_table_name = 'equipe' then 'user_id' else 'id' end)::uuid;
  end if;

  insert into public.historico (tabela, registro_id, acao, autor, autor_tipo, motivo, dados_antes, dados_depois)
  values (
    tg_table_name,
    v_id,
    lower(tg_op),
    v_autor,
    v_tipo,
    v_motivo,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end
$$;

create function public.tocar_atualizado_em() returns trigger
language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end
$$;

do $$
declare
  t text;
begin
  foreach t in array array['equipe', 'cursos', 'turmas', 'aulas', 'participantes', 'inscricoes', 'presencas'] loop
    execute format(
      'create trigger %I after insert or update or delete on public.%I for each row execute function public.registrar_historico()',
      t || '_historico', t);
  end loop;
  foreach t in array array['equipe', 'cursos', 'turmas', 'aulas', 'participantes', 'inscricoes'] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.tocar_atualizado_em()',
      t || '_atualizado_em', t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------
-- Regras de negócio
-- ---------------------------------------------------------------------

-- Situação real da turma, considerando o período de inscrições.
create function public.status_efetivo(t public.turmas) returns public.status_turma
language sql stable as $$
  select case
    when t.status = 'inscricoes_programadas'
         and now() >= t.inscricoes_inicio
         and (t.inscricoes_fim is null or now() < t.inscricoes_fim) then 'inscricoes_abertas'::public.status_turma
    when t.status in ('inscricoes_programadas', 'inscricoes_abertas')
         and t.inscricoes_fim is not null and now() >= t.inscricoes_fim then 'inscricoes_encerradas'::public.status_turma
    else t.status
  end
$$;

-- WhatsApp só com dígitos, sem o 55 do país. Retorna null se inválido.
create function public.normalizar_whatsapp(p text) returns text
language sql immutable as $$
  select case
    when d ~ '^55[0-9]{10,11}$' then substr(d, 3)
    when d ~ '^[0-9]{10,11}$' then d
    else null
  end
  from (select regexp_replace(coalesce(p, ''), '[^0-9]', '', 'g') as d) s
$$;

-- Código da inscrição: só letras/números sem ambiguidade (sem 0/O, 1/I/L…)
-- e com aleatoriedade forte (gen_random_uuid usa o gerador seguro do Postgres).
create function public.normalizar_codigo(p text) returns text
language sql immutable as $$
  select case
    when s ~ '^(CDM)?[A-Z0-9]{8}$' then 'CDM-' || substr(right(s, 8), 1, 4) || '-' || substr(right(s, 8), 5, 4)
    else null
  end
  from (select upper(regexp_replace(coalesce(p, ''), '[^A-Za-z0-9]', '', 'g')) as s) x
$$;

create function public.gerar_codigo() returns text
language plpgsql volatile as $$
declare
  alfabeto constant text := 'ACDEFGHJKMNPQRTUVWXY346789';
  bytes bytea;
  saida text := '';
  i integer;
begin
  loop
    bytes := uuid_send(gen_random_uuid()) || uuid_send(gen_random_uuid());
    saida := '';
    for i in 0..7 loop
      saida := saida || substr(alfabeto, (get_byte(bytes, i) % length(alfabeto)) + 1, 1);
    end loop;
    saida := 'CDM-' || substr(saida, 1, 4) || '-' || substr(saida, 5, 4);
    exit when not exists (select 1 from public.inscricoes where codigo = saida);
  end loop;
  return saida;
end
$$;

-- Núcleo da inscrição, usado pelo site (via Edge Function) e pela equipe.
create function public._inscrever(
  p_turma uuid,
  p_nome text,
  p_nascimento date,
  p_whatsapp text,
  p_email text,
  p_bairro text,
  p_disponibilidade text,
  p_consentimento boolean,
  p_versao_politica text,
  p_origem text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_turma public.turmas;
  v_whats text := public.normalizar_whatsapp(p_whatsapp);
  v_nome text := regexp_replace(btrim(coalesce(p_nome, '')), '\s+', ' ', 'g');
  v_email text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  v_bairro text := btrim(coalesce(p_bairro, ''));
  v_disp text := btrim(coalesce(p_disponibilidade, ''));
  v_participante uuid;
  v_confirmadas integer;
  v_status public.status_inscricao;
  v_posicao integer;
  v_codigo text;
  v_idade integer;
begin
  -- validação (repetida no servidor, independente do navegador)
  if char_length(v_nome) < 3 or char_length(v_nome) > 120 or v_nome !~ '[[:alpha:]]' then
    perform public.falhar('NOME_INVALIDO');
  end if;
  if p_nascimento is null or p_nascimento > current_date or p_nascimento < date '1900-01-01' then
    perform public.falhar('NASCIMENTO_INVALIDO');
  end if;
  if v_whats is null then
    perform public.falhar('WHATSAPP_INVALIDO');
  end if;
  if v_email is not null and (char_length(v_email) > 200 or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    perform public.falhar('EMAIL_INVALIDO');
  end if;
  if char_length(v_bairro) < 2 or char_length(v_bairro) > 120 then
    perform public.falhar('BAIRRO_INVALIDO');
  end if;
  if char_length(v_disp) < 1 or char_length(v_disp) > 500 then
    perform public.falhar('DISPONIBILIDADE_INVALIDA');
  end if;
  if p_consentimento is distinct from true or coalesce(btrim(p_versao_politica), '') = '' then
    perform public.falhar('CONSENTIMENTO_OBRIGATORIO');
  end if;

  -- trava a turma: inscrições simultâneas não ultrapassam as vagas
  select * into v_turma from public.turmas where id = p_turma for update;
  if not found then
    perform public.falhar('TURMA_INEXISTENTE');
  end if;
  if p_origem = 'site' and public.status_efetivo(v_turma) <> 'inscricoes_abertas' then
    perform public.falhar('INSCRICOES_FECHADAS');
  end if;
  if p_origem = 'equipe' and v_turma.status in ('cancelada', 'concluida') then
    perform public.falhar('TURMA_FINALIZADA');
  end if;

  v_idade := date_part('year', age(current_date, p_nascimento));
  if v_turma.idade_minima is not null and v_idade < v_turma.idade_minima then
    perform public.falhar('IDADE_MINIMA', v_turma.idade_minima::text);
  end if;

  -- participante: identificada pelo WhatsApp. Dados existentes não são
  -- sobrescritos por um formulário público (só a equipe corrige).
  select id into v_participante from public.participantes where whatsapp = v_whats;
  if v_participante is null then
    insert into public.participantes (nome, data_nascimento, whatsapp, email, bairro, consentimento_em, consentimento_versao)
    values (v_nome, p_nascimento, v_whats, v_email, v_bairro, now(), btrim(p_versao_politica))
    returning id into v_participante;
  else
    update public.participantes
       set consentimento_em = now(), consentimento_versao = btrim(p_versao_politica)
     where id = v_participante;
  end if;

  if exists (
    select 1 from public.inscricoes
     where turma_id = p_turma and participante_id = v_participante and status <> 'cancelada'
  ) then
    perform public.falhar('JA_INSCRITA');
  end if;

  select count(*) into v_confirmadas from public.inscricoes where turma_id = p_turma and status = 'confirmada';
  if v_confirmadas < v_turma.vagas then
    v_status := 'confirmada';
  else
    v_status := 'lista_espera';
    select coalesce(max(posicao_espera), 0) + 1 into v_posicao
      from public.inscricoes where turma_id = p_turma and status = 'lista_espera';
  end if;

  v_codigo := public.gerar_codigo();
  insert into public.inscricoes (turma_id, participante_id, codigo, status, posicao_espera, disponibilidade, origem)
  values (p_turma, v_participante, v_codigo, v_status, v_posicao, v_disp, p_origem);

  return jsonb_build_object('status', v_status, 'codigo', v_codigo, 'posicao_espera', v_posicao);
end
$$;

-- Público (somente via Edge Function, que roda como service_role).
create function public.inscrever_publico(
  p_turma uuid,
  p_nome text,
  p_nascimento date,
  p_whatsapp text,
  p_email text,
  p_bairro text,
  p_disponibilidade text,
  p_consentimento boolean,
  p_versao_politica text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform set_config('app.origem', 'publico', true);
  return public._inscrever(p_turma, p_nome, p_nascimento, p_whatsapp, p_email, p_bairro,
                           p_disponibilidade, p_consentimento, p_versao_politica, 'site');
end
$$;

-- Equipe: inscreve alguém (por exemplo, quem pediu pelo WhatsApp).
create function public.inscrever_pela_equipe(
  p_turma uuid,
  p_nome text,
  p_nascimento date,
  p_whatsapp text,
  p_email text,
  p_bairro text,
  p_disponibilidade text,
  p_versao_politica text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.pode_gerir() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  perform set_config('app.motivo', 'Inscrição feita pela equipe', true);
  return public._inscrever(p_turma, p_nome, p_nascimento, p_whatsapp, p_email, p_bairro,
                           p_disponibilidade, true, p_versao_politica, 'equipe');
end
$$;

-- Renumera a lista de espera de uma turma (1, 2, 3…) mantendo a ordem.
create function public._renumerar_espera(p_turma uuid) returns void
language sql security definer set search_path = public, pg_temp as $$
  update public.inscricoes i
     set posicao_espera = o.nova
    from (
      select id, row_number() over (order by posicao_espera, criado_em) as nova
        from public.inscricoes where turma_id = p_turma and status = 'lista_espera'
    ) o
   where i.id = o.id and i.posicao_espera is distinct from o.nova
$$;

create function public.cancelar_inscricao(p_inscricao uuid, p_motivo text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v public.inscricoes;
begin
  if not public.pode_gerir() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  if coalesce(btrim(p_motivo), '') = '' then
    perform public.falhar('MOTIVO_OBRIGATORIO');
  end if;
  select * into v from public.inscricoes where id = p_inscricao for update;
  if not found then
    perform public.falhar('INSCRICAO_INEXISTENTE');
  end if;
  if v.status = 'cancelada' then
    return;
  end if;
  perform set_config('app.motivo', btrim(p_motivo), true);
  update public.inscricoes
     set status = 'cancelada', posicao_espera = null, cancelada_em = now(), motivo_cancelamento = btrim(p_motivo)
   where id = p_inscricao;
  perform public._renumerar_espera(v.turma_id);
end
$$;

-- Passa alguém da lista de espera para confirmada, se houver vaga.
create function public.promover_da_espera(p_inscricao uuid) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v public.inscricoes;
  v_vagas integer;
  v_confirmadas integer;
begin
  if not public.pode_gerir() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  select * into v from public.inscricoes where id = p_inscricao;
  if not found or v.status <> 'lista_espera' then
    perform public.falhar('NAO_ESTA_NA_ESPERA');
  end if;
  select vagas into v_vagas from public.turmas where id = v.turma_id for update;
  select count(*) into v_confirmadas from public.inscricoes where turma_id = v.turma_id and status = 'confirmada';
  if v_confirmadas >= v_vagas then
    perform public.falhar('SEM_VAGA');
  end if;
  perform set_config('app.motivo', 'Promovida da lista de espera', true);
  update public.inscricoes set status = 'confirmada', posicao_espera = null where id = p_inscricao;
  perform public._renumerar_espera(v.turma_id);
end
$$;

-- Corrige dados de uma participante ou da inscrição.
create function public.alterar_inscricao(
  p_inscricao uuid,
  p_nome text,
  p_nascimento date,
  p_whatsapp text,
  p_email text,
  p_bairro text,
  p_disponibilidade text,
  p_motivo text
) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v public.inscricoes;
  v_whats text := public.normalizar_whatsapp(p_whatsapp);
begin
  if not public.pode_gerir() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  if coalesce(btrim(p_motivo), '') = '' then
    perform public.falhar('MOTIVO_OBRIGATORIO');
  end if;
  if v_whats is null then
    perform public.falhar('WHATSAPP_INVALIDO');
  end if;
  select * into v from public.inscricoes where id = p_inscricao;
  if not found then
    perform public.falhar('INSCRICAO_INEXISTENTE');
  end if;
  if exists (select 1 from public.participantes where whatsapp = v_whats and id <> v.participante_id) then
    perform public.falhar('WHATSAPP_EM_USO');
  end if;
  perform set_config('app.motivo', btrim(p_motivo), true);
  update public.participantes
     set nome = regexp_replace(btrim(p_nome), '\s+', ' ', 'g'),
         data_nascimento = p_nascimento,
         whatsapp = v_whats,
         email = nullif(lower(btrim(coalesce(p_email, ''))), ''),
         bairro = btrim(p_bairro)
   where id = v.participante_id;
  update public.inscricoes set disponibilidade = btrim(p_disponibilidade) where id = p_inscricao;
end
$$;

-- LGPD: apaga os dados pessoais e mantém só números agregados.
create function public.anonimizar_participante(p_participante uuid, p_motivo text) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.eh_admin() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  if coalesce(btrim(p_motivo), '') = '' then
    perform public.falhar('MOTIVO_OBRIGATORIO');
  end if;
  perform set_config('app.motivo', btrim(p_motivo), true);
  update public.participantes
     set nome = 'Participante anonimizada',
         data_nascimento = date '1900-01-01',
         whatsapp = 'anon-' || replace(id::text, '-', ''),
         email = null,
         bairro = 'Não informado',
         anonimizado_em = now()
   where id = p_participante;
  if not found then
    perform public.falhar('PARTICIPANTE_INEXISTENTE');
  end if;
  -- o histórico também guardava os dados pessoais: limpa
  update public.historico
     set dados_antes = case when dados_antes is null then null else jsonb_build_object('anonimizado', true) end,
         dados_depois = case when dados_depois is null then null else jsonb_build_object('anonimizado', true) end
   where tabela = 'participantes' and registro_id = p_participante;
end
$$;

-- ---------------------------------------------------------------------
-- Chamada
-- ---------------------------------------------------------------------

create function public.chamada_esta_aberta(a public.aulas) returns boolean
language sql stable as $$
  select a.chamada_aberta_em is not null
     and a.chamada_encerrada_em is null
     and now() >= a.chamada_aberta_em
     and now() < a.chamada_fecha_em
$$;

create function public.abrir_chamada(p_aula uuid, p_minutos integer) returns timestamptz
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_status public.status_turma;
  v_fecha timestamptz;
begin
  if not public.eh_equipe() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  if p_minutos is null or p_minutos < 5 or p_minutos > 180 then
    perform public.falhar('DURACAO_INVALIDA');
  end if;
  select t.status into v_status from public.aulas a join public.turmas t on t.id = a.turma_id where a.id = p_aula;
  if not found then
    perform public.falhar('AULA_INEXISTENTE');
  end if;
  if v_status in ('rascunho', 'cancelada', 'concluida') then
    perform public.falhar('TURMA_SEM_AULAS');
  end if;
  v_fecha := now() + make_interval(mins => p_minutos);
  update public.aulas
     set chamada_aberta_em = now(), chamada_fecha_em = v_fecha, chamada_aberta_por = auth.uid(),
         chamada_encerrada_em = null, chamada_encerrada_por = null
   where id = p_aula;
  return v_fecha;
end
$$;

create function public.encerrar_chamada(p_aula uuid) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.eh_equipe() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  update public.aulas
     set chamada_encerrada_em = now(), chamada_encerrada_por = auth.uid()
   where id = p_aula and chamada_aberta_em is not null and chamada_encerrada_em is null;
end
$$;

-- Público: existe alguma chamada aberta agora? (não revela qual)
create function public.chamada_disponivel() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.aulas a where public.chamada_esta_aberta(a))
$$;

-- Público, via Edge Function: a participante confirma a própria presença.
create function public.confirmar_presenca_publica(p_identificador text) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_codigo text := public.normalizar_codigo(p_identificador);
  v_whats text := public.normalizar_whatsapp(p_identificador);
  v_metodo public.metodo_presenca;
  v_alvo record;
  v_existente public.presencas;
  v_confirmadas jsonb := '[]'::jsonb;
  v_achou boolean := false;
begin
  perform set_config('app.origem', 'publico', true);

  if not exists (select 1 from public.aulas a where public.chamada_esta_aberta(a)) then
    perform public.falhar('SEM_CHAMADA');
  end if;
  if v_codigo is null and v_whats is null then
    perform public.falhar('IDENTIFICADOR_INVALIDO');
  end if;
  v_metodo := case when v_codigo is not null then 'qr_codigo' else 'qr_whatsapp' end;

  for v_alvo in
    select a.id as aula_id, a.titulo, a.numero, a.data, i.id as inscricao_id, t.nome as turma
      from public.aulas a
      join public.turmas t on t.id = a.turma_id
      join public.inscricoes i on i.turma_id = a.turma_id and i.status = 'confirmada'
      join public.participantes p on p.id = i.participante_id
     where public.chamada_esta_aberta(a)
       and (case when v_codigo is not null then i.codigo = v_codigo else p.whatsapp = v_whats end)
     for update of a
  loop
    v_achou := true;
    select * into v_existente from public.presencas
     where aula_id = v_alvo.aula_id and inscricao_id = v_alvo.inscricao_id for update;
    if found and v_existente.status <> 'nao_registrado' then
      continue;
    end if;
    if found then
      update public.presencas
         set status = 'presente', metodo = v_metodo, registrado_em = now(), registrado_por = null
       where id = v_existente.id;
    else
      insert into public.presencas (aula_id, inscricao_id, status, metodo)
      values (v_alvo.aula_id, v_alvo.inscricao_id, 'presente', v_metodo);
    end if;
    v_confirmadas := v_confirmadas || jsonb_build_object(
      'turma', v_alvo.turma,
      'aula', coalesce(v_alvo.titulo, 'Aula ' || coalesce(v_alvo.numero::text, to_char(v_alvo.data, 'DD/MM'))),
      'registrado_em', now()
    );
  end loop;

  if not v_achou then
    perform public.falhar('NAO_INSCRITA');
  end if;
  if jsonb_array_length(v_confirmadas) = 0 then
    perform public.falhar('JA_REGISTRADA');
  end if;
  return jsonb_build_object('confirmadas', v_confirmadas);
end
$$;

-- Equipe: marca ou corrige uma presença. Correção exige motivo.
create function public.marcar_presenca(
  p_aula uuid,
  p_inscricao uuid,
  p_status public.status_presenca,
  p_motivo text default null
) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_existente public.presencas;
  v_motivo text := nullif(btrim(coalesce(p_motivo, '')), '');
begin
  if not public.eh_equipe() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  if p_status is null then
    perform public.falhar('STATUS_INVALIDO');
  end if;
  if not exists (
    select 1 from public.aulas a join public.inscricoes i on i.turma_id = a.turma_id
     where a.id = p_aula and i.id = p_inscricao and i.status = 'confirmada'
  ) then
    perform public.falhar('INSCRICAO_FORA_DA_TURMA');
  end if;

  select * into v_existente from public.presencas
   where aula_id = p_aula and inscricao_id = p_inscricao for update;

  if not found then
    perform set_config('app.motivo', coalesce(v_motivo, 'Chamada manual'), true);
    insert into public.presencas (aula_id, inscricao_id, status, metodo, registrado_por)
    values (p_aula, p_inscricao, p_status, 'manual', auth.uid());
    return;
  end if;

  if v_existente.status = p_status then
    return;
  end if;

  -- Já havia registro: é uma correção. Guarda quem, quando e por quê.
  if v_motivo is null then
    perform public.falhar('MOTIVO_OBRIGATORIO');
  end if;
  perform set_config('app.motivo', v_motivo, true);
  update public.presencas
     set status = p_status, corrigido_em = now(), corrigido_por = auth.uid(), motivo_correcao = v_motivo
   where id = v_existente.id;
end
$$;

-- Lista de chamada de uma aula: só o necessário (sem WhatsApp/e-mail).
create function public.lista_chamada(p_aula uuid)
returns table (
  inscricao_id uuid,
  nome text,
  codigo text,
  status public.status_presenca,
  metodo public.metodo_presenca,
  registrado_em timestamptz,
  corrigido_em timestamptz,
  motivo_correcao text
)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.eh_equipe() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  return query
    select i.id, p.nome, i.codigo, pr.status, pr.metodo, pr.registrado_em, pr.corrigido_em, pr.motivo_correcao
      from public.aulas a
      join public.inscricoes i on i.turma_id = a.turma_id and i.status = 'confirmada'
      join public.participantes p on p.id = i.participante_id
      left join public.presencas pr on pr.aula_id = a.id and pr.inscricao_id = i.id
     where a.id = p_aula
     order by p.nome;
end
$$;

-- ---------------------------------------------------------------------
-- Leitura pública (sem dados pessoais)
-- ---------------------------------------------------------------------

create function public.turmas_publicas()
returns table (
  id uuid,
  curso text,
  curso_descricao text,
  publico_alvo text,
  carga_horaria text,
  turma text,
  local text,
  endereco text,
  dias_horarios text,
  data_inicio date,
  data_fim date,
  inscricoes_fim timestamptz,
  idade_minima integer,
  observacoes text,
  vagas_restantes integer
)
language sql stable security definer set search_path = public, pg_temp as $$
  select t.id, c.nome, c.descricao, c.publico_alvo, c.carga_horaria, t.nome, t.local, t.endereco, t.dias_horarios,
         t.data_inicio, t.data_fim, t.inscricoes_fim, t.idade_minima, t.observacoes_publicas,
         greatest(t.vagas - (select count(*) from public.inscricoes i where i.turma_id = t.id and i.status = 'confirmada'), 0)::integer
    from public.turmas t
    join public.cursos c on c.id = t.curso_id
   where c.ativo and public.status_efetivo(t) = 'inscricoes_abertas'
   order by t.data_inicio nulls last, t.nome
$$;

-- ---------------------------------------------------------------------
-- Limite de tentativas (Edge Functions)
-- ---------------------------------------------------------------------

create function public.registrar_tentativa(p_acao text, p_chave text, p_limite integer, p_janela_segundos integer)
returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_total integer;
begin
  delete from public.tentativas where criado_em < now() - interval '1 day';
  select count(*) into v_total from public.tentativas
   where acao = p_acao and chave = p_chave and criado_em > now() - make_interval(secs => p_janela_segundos);
  if v_total >= p_limite then
    return false;
  end if;
  insert into public.tentativas (acao, chave) values (p_acao, p_chave);
  return true;
end
$$;

-- ---------------------------------------------------------------------
-- Visões para o painel (respeitam o RLS de quem consulta)
-- ---------------------------------------------------------------------

create view public.v_inscricoes with (security_invoker = true) as
  select i.id, i.codigo, i.status, i.posicao_espera, i.disponibilidade, i.origem, i.criado_em,
         i.cancelada_em, i.motivo_cancelamento, i.turma_id, t.nome as turma, c.nome as curso,
         p.id as participante_id, p.nome, p.data_nascimento, p.whatsapp, p.email, p.bairro,
         p.consentimento_em, p.consentimento_versao, p.anonimizado_em
    from public.inscricoes i
    join public.participantes p on p.id = i.participante_id
    join public.turmas t on t.id = i.turma_id
    join public.cursos c on c.id = t.curso_id;

create view public.lista_espera with (security_invoker = true) as
  select * from public.v_inscricoes where status = 'lista_espera';

create view public.v_presencas with (security_invoker = true) as
  select pr.id, pr.status, pr.metodo, pr.registrado_em, pr.registrado_por, pr.corrigido_em, pr.corrigido_por,
         pr.motivo_correcao, a.id as aula_id, a.numero as aula_numero, a.titulo as aula_titulo, a.data as aula_data,
         t.id as turma_id, t.nome as turma, i.codigo, p.nome
    from public.presencas pr
    join public.aulas a on a.id = pr.aula_id
    join public.turmas t on t.id = a.turma_id
    join public.inscricoes i on i.id = pr.inscricao_id
    join public.participantes p on p.id = i.participante_id;

-- Turmas com o status efetivo (respeita o RLS de quem consulta).
create view public.v_turmas with (security_invoker = true) as
  select t.*, c.nome as curso, public.status_efetivo(t) as status_atual
    from public.turmas t
    join public.cursos c on c.id = t.curso_id;

-- Números por turma, sem dados pessoais (a professora também vê).
create function public.contagem_turmas()
returns table (turma_id uuid, confirmadas integer, lista_espera integer, canceladas integer)
language plpgsql stable security definer set search_path = public, pg_temp as $$
begin
  if not public.eh_equipe() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  return query
    select t.id,
           count(i.id) filter (where i.status = 'confirmada')::integer,
           count(i.id) filter (where i.status = 'lista_espera')::integer,
           count(i.id) filter (where i.status = 'cancelada')::integer
      from public.turmas t
      left join public.inscricoes i on i.turma_id = t.id
     group by t.id;
end
$$;

-- Admin vincula à equipe uma conta já criada no Supabase Auth.
create function public.adicionar_membro(p_email text, p_nome text, p_funcao public.funcao_equipe) returns uuid
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_id uuid;
begin
  if not public.eh_admin() then
    perform public.falhar('SEM_PERMISSAO');
  end if;
  select id into v_id from auth.users where lower(email) = lower(btrim(p_email));
  if v_id is null then
    perform public.falhar('CONTA_INEXISTENTE');
  end if;
  insert into public.equipe (user_id, nome, funcao) values (v_id, btrim(p_nome), p_funcao)
  on conflict (user_id) do update set nome = excluded.nome, funcao = excluded.funcao, ativo = true;
  return v_id;
end
$$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table public.equipe enable row level security;
alter table public.cursos enable row level security;
alter table public.turmas enable row level security;
alter table public.aulas enable row level security;
alter table public.participantes enable row level security;
alter table public.inscricoes enable row level security;
alter table public.presencas enable row level security;
alter table public.historico enable row level security;
alter table public.tentativas enable row level security;

create policy equipe_ler on public.equipe for select to authenticated using (public.eh_equipe());
create policy equipe_admin_inserir on public.equipe for insert to authenticated with check (public.eh_admin());
create policy equipe_admin_alterar on public.equipe for update to authenticated using (public.eh_admin()) with check (public.eh_admin());
create policy equipe_admin_excluir on public.equipe for delete to authenticated using (public.eh_admin() and user_id <> auth.uid());

create policy cursos_ler on public.cursos for select to authenticated using (public.eh_equipe());
create policy cursos_inserir on public.cursos for insert to authenticated with check (public.pode_gerir());
create policy cursos_alterar on public.cursos for update to authenticated using (public.pode_gerir()) with check (public.pode_gerir());

create policy turmas_ler on public.turmas for select to authenticated using (public.eh_equipe());
create policy turmas_inserir on public.turmas for insert to authenticated with check (public.pode_gerir());
create policy turmas_alterar on public.turmas for update to authenticated using (public.pode_gerir()) with check (public.pode_gerir());
create policy turmas_excluir_rascunho on public.turmas for delete to authenticated
  using (public.pode_gerir() and status = 'rascunho' and not exists (select 1 from public.inscricoes i where i.turma_id = turmas.id));

create policy aulas_ler on public.aulas for select to authenticated using (public.eh_equipe());
create policy aulas_inserir on public.aulas for insert to authenticated with check (public.pode_gerir());
create policy aulas_alterar on public.aulas for update to authenticated using (public.pode_gerir()) with check (public.pode_gerir());
create policy aulas_excluir on public.aulas for delete to authenticated
  using (public.pode_gerir() and not exists (select 1 from public.presencas p where p.aula_id = aulas.id));

-- Dados pessoais: só admin e coordenação. A professora usa lista_chamada().
create policy participantes_ler on public.participantes for select to authenticated using (public.pode_gerir());
create policy inscricoes_ler on public.inscricoes for select to authenticated using (public.pode_gerir());

create policy presencas_ler on public.presencas for select to authenticated using (public.eh_equipe());

create policy historico_ler on public.historico for select to authenticated using (public.pode_gerir());

-- tentativas: nenhuma política (só funções internas).

-- ---------------------------------------------------------------------
-- Privilégios: tira tudo do público e devolve só o necessário
-- ---------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

-- equipe autenticada: tabelas sob RLS
grant select on public.equipe, public.cursos, public.turmas, public.aulas, public.participantes,
                public.inscricoes, public.presencas, public.historico to authenticated;
grant insert, update, delete on public.equipe to authenticated;
grant insert, update on public.cursos to authenticated;
grant insert, update, delete on public.turmas, public.aulas to authenticated;
grant select on public.v_inscricoes, public.lista_espera, public.v_presencas, public.v_turmas to authenticated;

-- funções que o RLS e as visões precisam avaliar
grant execute on function public.minha_funcao(), public.eh_equipe(), public.pode_gerir(), public.eh_admin(),
                         public.status_efetivo(public.turmas), public.chamada_esta_aberta(public.aulas)
  to authenticated;

-- ações da equipe (cada uma confere a função de quem chama)
grant execute on function
  public.inscrever_pela_equipe(uuid, text, date, text, text, text, text, text),
  public.cancelar_inscricao(uuid, text),
  public.promover_da_espera(uuid),
  public.alterar_inscricao(uuid, text, date, text, text, text, text, text),
  public.anonimizar_participante(uuid, text),
  public.abrir_chamada(uuid, integer),
  public.encerrar_chamada(uuid),
  public.marcar_presenca(uuid, uuid, public.status_presenca, text),
  public.lista_chamada(uuid),
  public.contagem_turmas(),
  public.adicionar_membro(text, text, public.funcao_equipe)
  to authenticated;

-- público: só leitura sem dados pessoais
grant execute on function public.turmas_publicas(), public.chamada_disponivel() to anon, authenticated;

-- Edge Functions (service_role): inscrição e presença públicas + limite de tentativas
grant execute on function
  public.inscrever_publico(uuid, text, date, text, text, text, text, boolean, text),
  public.confirmar_presenca_publica(text),
  public.registrar_tentativa(text, text, integer, integer)
  to service_role;

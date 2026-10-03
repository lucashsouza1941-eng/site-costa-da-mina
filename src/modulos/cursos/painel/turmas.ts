// Turmas: lista, formulário e detalhe (inscrições, espera, aulas, exportação).
import { el, formatarData, formatarDataHora } from '../lib/dom';
import { VERSAO_POLITICA, validarInscricao } from '../../../../supabase/functions/_compartilhado/regras';
import {
  NOMES_PRESENCA,
  NOMES_METODO,
  NOMES_STATUS_INSCRICAO,
  NOMES_STATUS_TURMA,
  areaTexto,
  avisar,
  baixarCsv,
  botao,
  campo,
  deCampoDataHora,
  entrada,
  link,
  paraCampoDataHora,
  pedirTexto,
  podeGerir,
  sb,
  selecao,
  selo,
  textoDoErro,
} from './comum';

type Turma = Record<string, any>;

const contagens = async () => {
  const { data, error } = await sb.rpc('contagem_turmas');
  if (error) throw error;
  return new Map<string, { confirmadas: number; lista_espera: number }>((data ?? []).map((c: any) => [c.turma_id, c]));
};

// ------------------------------------------------------------------ lista
export async function telaTurmas(tela: HTMLElement) {
  const [{ data: turmas, error }, numeros] = await Promise.all([
    sb.from('v_turmas').select('*').order('criado_em', { ascending: false }),
    contagens(),
  ]);
  if (error) throw error;

  const itens = (turmas ?? []).map((t: Turma) => {
    const n = numeros.get(t.id) ?? { confirmadas: 0, lista_espera: 0 };
    return el('li', { class: 'cartao-painel' }, [
      el('h3', {}, [link(`#turma/${t.id}`, `${t.curso} · ${t.nome}`)]),
      selo(t.status_atual, NOMES_STATUS_TURMA),
      el('p', {}, `${n.confirmadas} de ${t.vagas} vagas preenchidas · ${n.lista_espera} na lista de espera`),
      t.dias_horarios ? el('p', {}, t.dias_horarios) : null,
    ]);
  });

  tela.replaceChildren(
    el('h2', {}, 'Turmas'),
    podeGerir() ? el('div', { class: 'barra' }, [link('#turma-form/nova', 'Nova turma', 'botao botao--roxo')]) :'',
    itens.length
      ? el('ul', { class: 'cartoes', role: 'list' }, itens)
      : el('p', {}, podeGerir() ? 'Nenhuma turma ainda. Cadastre um curso e depois crie a primeira turma.' : 'Nenhuma turma cadastrada.'),
  );
}

// ------------------------------------------------------------- formulário
export async function telaFormTurma(tela: HTMLElement, id: string) {
  const nova = id === 'nova';
  const [{ data: cursos }, existente] = await Promise.all([
    sb.from('cursos').select('id, nome').eq('ativo', true).order('nome'),
    nova ? Promise.resolve({ data: null }) : sb.from('turmas').select('*').eq('id', id).single(),
  ]);
  const t: Turma = existente.data ?? { vagas: 20, status: 'rascunho' };

  if (!cursos?.length) {
    tela.replaceChildren(el('h2', {}, 'Nova turma'), el('p', {}, 'Cadastre um curso antes de criar turmas.'), link('#cursos', 'Ir para Cursos', 'botao'));
    return;
  }

  const c = {
    curso_id: selecao(cursos.map((x: any) => [x.id, x.nome]), t.curso_id ?? cursos[0].id),
    nome: entrada('text', t.nome, { required: '', maxlength: '120' }),
    status: selecao(Object.entries(NOMES_STATUS_TURMA), t.status),
    vagas: entrada('number', t.vagas, { min: '1', max: '500', required: '' }),
    inscricoes_inicio: entrada('datetime-local', paraCampoDataHora(t.inscricoes_inicio)),
    inscricoes_fim: entrada('datetime-local', paraCampoDataHora(t.inscricoes_fim)),
    data_inicio: entrada('date', t.data_inicio),
    data_fim: entrada('date', t.data_fim),
    dias_horarios: entrada('text', t.dias_horarios, { maxlength: '300' }),
    local: entrada('text', t.local, { maxlength: '200' }),
    endereco: entrada('text', t.endereco, { maxlength: '300' }),
    idade_minima: entrada('number', t.idade_minima, { min: '0', max: '120' }),
    observacoes_publicas: areaTexto(t.observacoes_publicas, { maxlength: '1000' }),
  };

  const form = el('form', { class: 'form', novalidate: '' }, [
    el('div', { class: 'grade-form' }, [
      campo('curso_id', 'Curso', c.curso_id),
      campo('nome', 'Nome da turma', c.nome, { dica: 'Ex.: "Turma de domingo – 2º semestre".' }),
      campo('status', 'Situação', c.status, {
        dica: '"Inscrições programadas" abre sozinha no início do período. Só "inscrições abertas" aparece no site.',
      }),
      campo('vagas', 'Vagas', c.vagas),
      campo('inscricoes_inicio', 'Inscrições: início', c.inscricoes_inicio),
      campo('inscricoes_fim', 'Inscrições: fim', c.inscricoes_fim, { dica: 'Passado o fim, o site deixa de aceitar inscrições.' }),
      campo('data_inicio', 'Primeira aula', c.data_inicio),
      campo('data_fim', 'Última aula', c.data_fim),
      campo('dias_horarios', 'Dias e horários', c.dias_horarios, { dica: 'Ex.: "Domingos, das 10h às 12h".', largo: true }),
      campo('local', 'Local', c.local),
      campo('endereco', 'Endereço', c.endereco),
      campo('idade_minima', 'Idade mínima (opcional)', c.idade_minima),
      campo('observacoes_publicas', 'Observações para o público (opcional)', c.observacoes_publicas, { largo: true }),
    ]),
    el('div', { class: 'grupo-botoes' }, [
      el('button', { type: 'submit', class: 'botao botao--roxo' }, nova ? 'Criar turma' : 'Salvar alterações'),
      link(nova ? '#turmas' : `#turma/${id}`, 'Voltar', 'botao botao--contorno'),
    ]),
  ]);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valores = {
      curso_id: c.curso_id.value,
      nome: c.nome.value.trim(),
      status: c.status.value,
      vagas: Number(c.vagas.value),
      inscricoes_inicio: deCampoDataHora(c.inscricoes_inicio.value),
      inscricoes_fim: deCampoDataHora(c.inscricoes_fim.value),
      data_inicio: c.data_inicio.value || null,
      data_fim: c.data_fim.value || null,
      dias_horarios: c.dias_horarios.value.trim() || null,
      local: c.local.value.trim() || null,
      endereco: c.endereco.value.trim() || null,
      idade_minima: c.idade_minima.value === '' ? null : Number(c.idade_minima.value),
      observacoes_publicas: c.observacoes_publicas.value.trim() || null,
    };
    if (valores.nome.length < 2) return avisar('Dê um nome à turma.', 'erro');
    if (!(valores.vagas >= 1)) return avisar('Informe o número de vagas.', 'erro');
    if (valores.status === 'inscricoes_programadas' && !valores.inscricoes_inicio)
      return avisar('Para programar as inscrições, informe a data de início.', 'erro');

    const resposta = nova
      ? await sb.from('turmas').insert(valores).select('id').single()
      : await sb.from('turmas').update(valores).eq('id', id).select('id').single();
    if (resposta.error) return avisar(textoDoErro(resposta.error), 'erro');
    avisar(nova ? 'Turma criada.' : 'Turma atualizada.', 'sucesso');
    location.hash = `#turma/${resposta.data.id}`;
  });

  tela.replaceChildren(el('h2', {}, nova ? 'Nova turma' : `Editar turma`), form);
}

// ---------------------------------------------------------------- detalhe
export async function telaTurma(tela: HTMLElement, id: string) {
  const { data: t, error } = await sb.from('v_turmas').select('*').eq('id', id).single();
  if (error) throw error;
  const numeros = (await contagens()).get(id) ?? { confirmadas: 0, lista_espera: 0 };

  const detalhes: [string, string | null][] = [
    ['Situação', NOMES_STATUS_TURMA[t.status_atual]],
    ['Vagas', `${numeros.confirmadas} de ${t.vagas} preenchidas · ${numeros.lista_espera} na espera`],
    ['Inscrições', t.inscricoes_inicio || t.inscricoes_fim
      ? `${t.inscricoes_inicio ? formatarDataHora(t.inscricoes_inicio) : '—'} até ${t.inscricoes_fim ? formatarDataHora(t.inscricoes_fim) : 'sem data de fim'}`
      : null],
    ['Aulas', t.data_inicio ? `${formatarData(t.data_inicio)}${t.data_fim ? ` a ${formatarData(t.data_fim)}` : ''}` : null],
    ['Quando', t.dias_horarios],
    ['Local', [t.local, t.endereco].filter(Boolean).join(' · ') || null],
  ];

  const acoes = podeGerir()
    ? el('div', { class: 'barra' }, [
        link(`#turma-form/${id}`, 'Editar turma', 'botao'),
        t.status_atual !== 'inscricoes_abertas'
          ? botao('Abrir inscrições agora', () => mudarStatus(id, 'inscricoes_abertas', t))
          : botao('Encerrar inscrições', () => mudarStatus(id, 'inscricoes_encerradas', t)),
        t.status !== 'em_andamento' ? botao('Marcar "em andamento"', () => mudarStatus(id, 'em_andamento', t), 'botao botao--contorno') : null,
      ])
    : null;

  const abas = el('div', { class: 'painel__abas', role: 'tablist', 'aria-label': 'Partes da turma' });
  const painelAba = el('div', { class: 'painel__tela', role: 'tabpanel', tabindex: '0' });
  const definicoes: [string, string, (alvo: HTMLElement) => Promise<void>][] = [
    ...(podeGerir()
      ? ([
          ['inscricoes', 'Inscrições', (alvo) => abaInscricoes(alvo, id)],
          ['espera', 'Lista de espera', (alvo) => abaEspera(alvo, id)],
          ['nova', 'Nova inscrição', (alvo) => abaNovaInscricao(alvo, id)],
        ] as [string, string, (alvo: HTMLElement) => Promise<void>][])
      : []),
    ['aulas', 'Aulas e chamada', (alvo) => abaAulas(alvo, id)],
    ...(podeGerir() ? ([['exportar', 'Exportar CSV', (alvo) => abaExportar(alvo, t)]] as [string, string, (alvo: HTMLElement) => Promise<void>][]) : []),
  ];

  const botoes = definicoes.map(([chave, rotulo, abrir]) => {
    const b = el('button', { type: 'button', role: 'tab', id: `aba-${chave}`, 'aria-selected': 'false', class: 'aba' }, rotulo);
    b.addEventListener('click', async () => {
      botoes.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      painelAba.setAttribute('aria-labelledby', b.id);
      painelAba.replaceChildren(el('p', { class: 'carregando' }, 'Carregando…'));
      try {
        await abrir(painelAba);
      } catch (erro) {
        painelAba.replaceChildren(el('div', { class: 'aviso aviso--erro', role: 'alert' }, textoDoErro(erro as Error)));
      }
    });
    return b;
  });
  abas.replaceChildren(...botoes);

  tela.replaceChildren(
    el('p', {}, [link('#turmas', '← Todas as turmas')]),
    el('h2', {}, `${t.curso} · ${t.nome}`),
    el('dl', { class: 'ficha-turma' }, detalhes.filter(([, v]) => v).flatMap(([r, v]) => [el('dt', {}, r), el('dd', {}, v!)])),
    acoes ?? '',
    abas,
    painelAba,
  );
  botoes[0]?.click();
}

async function mudarStatus(id: string, status: string, t: Turma) {
  if (status === 'inscricoes_abertas' && t.inscricoes_fim && new Date(t.inscricoes_fim) <= new Date()) {
    return avisar('O fim das inscrições já passou. Edite a turma e ajuste a data de fim antes de abrir.', 'erro');
  }
  const { error } = await sb.from('turmas').update({ status }).eq('id', id);
  if (error) return avisar(textoDoErro(error), 'erro');
  avisar(`Situação alterada para "${NOMES_STATUS_TURMA[status]}".`, 'sucesso');
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

// ------------------------------------------------------------- inscrições
async function abaInscricoes(alvo: HTMLElement, turma: string) {
  const { data, error } = await sb
    .from('v_inscricoes')
    .select('*')
    .eq('turma_id', turma)
    .neq('status', 'lista_espera')
    .order('status')
    .order('nome');
  if (error) throw error;

  const linhas = (data ?? []).map((i: any) =>
    el('tr', {}, [
      el('td', {}, i.codigo),
      el('th', { scope: 'row' }, i.nome),
      el('td', {}, i.whatsapp),
      el('td', {}, i.bairro),
      el('td', {}, i.disponibilidade),
      el('td', {}, [selo(i.status, NOMES_STATUS_INSCRICAO)]),
      el('td', {}, i.status === 'cancelada' ? i.motivo_cancelamento ?? '' : [
        botao('Editar', () => editarInscricao(alvo, i, turma), 'botao botao--contorno'),
        ' ',
        botao('Cancelar', () => cancelar(i, () => abaInscricoes(alvo, turma)), 'botao botao--contorno'),
      ]),
    ]),
  );

  alvo.replaceChildren(
    linhas.length
      ? el('div', { class: 'tabela-rolagem' }, [
          el('table', { class: 'tabela' }, [
            el('caption', {}, `Inscrições (${linhas.length})`),
            el('thead', {}, [el('tr', {}, ['Código', 'Nome', 'WhatsApp', 'Bairro', 'Disponibilidade', 'Situação', 'Ações'].map((c) => el('th', { scope: 'col' }, c)))]),
            el('tbody', {}, linhas),
          ]),
        ])
      : el('p', {}, 'Nenhuma inscrição ainda.'),
  );
}

async function cancelar(i: any, depois: () => void) {
  const motivo = await pedirTexto(`Cancelar a inscrição de ${i.nome}`, 'Motivo do cancelamento');
  if (!motivo) return;
  const { error } = await sb.rpc('cancelar_inscricao', { p_inscricao: i.id, p_motivo: motivo });
  if (error) return avisar(textoDoErro(error), 'erro');
  avisar('Inscrição cancelada.', 'sucesso');
  depois();
}

function editarInscricao(alvo: HTMLElement, i: any, turma: string) {
  const c = {
    nome: entrada('text', i.nome, { maxlength: '120' }),
    nascimento: entrada('date', i.data_nascimento),
    whatsapp: entrada('tel', i.whatsapp, { maxlength: '20' }),
    email: entrada('email', i.email, { maxlength: '200' }),
    bairro: entrada('text', i.bairro, { maxlength: '120' }),
    disponibilidade: areaTexto(i.disponibilidade, { maxlength: '500' }),
    motivo: entrada('text', '', { maxlength: '500', required: '' }),
  };
  const form = el('form', { class: 'form', novalidate: '' }, [
    el('h3', { tabindex: '-1' }, `Editar inscrição ${i.codigo}`),
    el('div', { class: 'grade-form' }, [
      campo('ed-nome', 'Nome completo', c.nome),
      campo('ed-nascimento', 'Data de nascimento', c.nascimento),
      campo('ed-whatsapp', 'WhatsApp', c.whatsapp),
      campo('ed-email', 'E-mail (opcional)', c.email),
      campo('ed-bairro', 'Bairro', c.bairro),
      campo('ed-disponibilidade', 'Disponibilidade', c.disponibilidade),
      campo('ed-motivo', 'Motivo da alteração', c.motivo, { largo: true, dica: 'Fica registrado no histórico.' }),
    ]),
    el('div', { class: 'grupo-botoes' }, [
      el('button', { type: 'submit', class: 'botao botao--roxo' }, 'Salvar'),
      botao('Voltar', () => abaInscricoes(alvo, turma), 'botao botao--contorno'),
    ]),
  ]);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error } = await sb.rpc('alterar_inscricao', {
      p_inscricao: i.id,
      p_nome: c.nome.value,
      p_nascimento: c.nascimento.value,
      p_whatsapp: c.whatsapp.value,
      p_email: c.email.value || null,
      p_bairro: c.bairro.value,
      p_disponibilidade: c.disponibilidade.value,
      p_motivo: c.motivo.value,
    });
    if (error) return avisar(textoDoErro(error), 'erro');
    avisar('Inscrição alterada.', 'sucesso');
    abaInscricoes(alvo, turma);
  });
  alvo.replaceChildren(form);
  form.querySelector<HTMLElement>('h3')?.focus();
}

// ---------------------------------------------------------- lista de espera
async function abaEspera(alvo: HTMLElement, turma: string) {
  const { data, error } = await sb.from('lista_espera').select('*').eq('turma_id', turma).order('posicao_espera');
  if (error) throw error;
  const linhas = (data ?? []).map((i: any) =>
    el('tr', {}, [
      el('td', {}, String(i.posicao_espera)),
      el('th', { scope: 'row' }, i.nome),
      el('td', {}, i.whatsapp),
      el('td', {}, formatarDataHora(i.criado_em)),
      el('td', {}, [
        botao('Confirmar vaga', async () => {
          const { error: erro } = await sb.rpc('promover_da_espera', { p_inscricao: i.id });
          if (erro) return avisar(textoDoErro(erro), 'erro');
          avisar(`${i.nome} passou para confirmada. Avise a participante pelo WhatsApp.`, 'sucesso');
          abaEspera(alvo, turma);
        }),
        ' ',
        botao('Cancelar', () => cancelar(i, () => abaEspera(alvo, turma)), 'botao botao--contorno'),
      ]),
    ]),
  );
  alvo.replaceChildren(
    linhas.length
      ? el('div', { class: 'tabela-rolagem' }, [
          el('table', { class: 'tabela' }, [
            el('caption', {}, `Lista de espera (${linhas.length}), por ordem de chegada`),
            el('thead', {}, [el('tr', {}, ['Posição', 'Nome', 'WhatsApp', 'Inscrita em', 'Ações'].map((c) => el('th', { scope: 'col' }, c)))]),
            el('tbody', {}, linhas),
          ]),
        ])
      : el('p', {}, 'Ninguém na lista de espera.'),
  );
}

// --------------------------------------------------------- nova inscrição
async function abaNovaInscricao(alvo: HTMLElement, turma: string) {
  const c = {
    nome: entrada('text', '', { maxlength: '120', autocomplete: 'off' }),
    nascimento: entrada('date', ''),
    whatsapp: entrada('tel', '', { maxlength: '20' }),
    email: entrada('email', '', { maxlength: '200' }),
    bairro: entrada('text', '', { maxlength: '120' }),
    disponibilidade: areaTexto('', { maxlength: '500' }),
  };
  const form = el('form', { class: 'form', novalidate: '' }, [
    el('p', {}, 'Use para inscrever quem pediu a vaga por WhatsApp ou pessoalmente. Confirme antes que a pessoa concorda com a Política de Privacidade.'),
    el('div', { class: 'grade-form' }, [
      campo('ni-nome', 'Nome completo', c.nome),
      campo('ni-nascimento', 'Data de nascimento', c.nascimento),
      campo('ni-whatsapp', 'WhatsApp', c.whatsapp),
      campo('ni-email', 'E-mail (opcional)', c.email),
      campo('ni-bairro', 'Bairro', c.bairro),
      campo('ni-disponibilidade', 'Disponibilidade', c.disponibilidade),
    ]),
    el('button', { type: 'submit', class: 'botao botao--roxo' }, 'Inscrever'),
  ]);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = validarInscricao({
      turma,
      nome: c.nome.value,
      nascimento: c.nascimento.value,
      whatsapp: c.whatsapp.value,
      email: c.email.value,
      bairro: c.bairro.value,
      disponibilidade: c.disponibilidade.value,
      consentimento: true,
    });
    if (!v.ok) return avisar(Object.values(v.erros).join(' '), 'erro');
    const { data, error } = await sb.rpc('inscrever_pela_equipe', {
      p_turma: turma,
      p_nome: v.dados.nome,
      p_nascimento: v.dados.nascimento,
      p_whatsapp: v.dados.whatsapp,
      p_email: v.dados.email,
      p_bairro: v.dados.bairro,
      p_disponibilidade: v.dados.disponibilidade,
      p_versao_politica: VERSAO_POLITICA,
    });
    if (error) return avisar(textoDoErro(error), 'erro');
    avisar(
      data.status === 'confirmada'
        ? `Inscrição confirmada. Código: ${data.codigo}. Envie o código à participante.`
        : `Turma cheia: entrou na lista de espera (posição ${data.posicao_espera}). Código: ${data.codigo}.`,
      'sucesso',
    );
    form.reset();
  });
  alvo.replaceChildren(form);
}

// ------------------------------------------------------------------ aulas
async function abaAulas(alvo: HTMLElement, turma: string) {
  const { data, error } = await sb.from('aulas').select('*').eq('turma_id', turma).order('data').order('numero');
  if (error) throw error;

  const agora = Date.now();
  const itens = (data ?? []).map((a: any) => {
    const aberta = a.chamada_aberta_em && !a.chamada_encerrada_em && new Date(a.chamada_fecha_em).getTime() > agora;
    return el('li', { class: 'cartao-painel' }, [
      el('h3', {}, [link(`#aula/${a.id}`, a.titulo || `Aula ${a.numero ?? ''}`.trim())]),
      el('p', {}, `${formatarData(a.data)}${a.hora_inicio ? ` · ${a.hora_inicio.slice(0, 5)}` : ''}${a.hora_fim ? `–${a.hora_fim.slice(0, 5)}` : ''}`),
      aberta ? el('span', { class: 'selo selo--presente' }, 'Chamada aberta') : null,
    ]);
  });

  const blocos: (HTMLElement | null)[] = [
    itens.length ? el('ul', { class: 'cartoes', role: 'list' }, itens) : el('p', {}, 'Nenhuma aula cadastrada.'),
  ];

  if (podeGerir()) {
    const proximo = (data?.length ?? 0) + 1;
    const c = {
      numero: entrada('number', proximo, { min: '1', max: '500' }),
      titulo: entrada('text', '', { maxlength: '200' }),
      data: entrada('date', '', { required: '' }),
      hora_inicio: entrada('time', ''),
      hora_fim: entrada('time', ''),
    };
    const form = el('form', { class: 'form', novalidate: '' }, [
      el('h3', {}, 'Nova aula'),
      el('div', { class: 'grade-form' }, [
        campo('au-numero', 'Número', c.numero),
        campo('au-titulo', 'Tema (opcional)', c.titulo),
        campo('au-data', 'Data', c.data),
        campo('au-inicio', 'Início', c.hora_inicio),
        campo('au-fim', 'Fim', c.hora_fim),
      ]),
      el('button', { type: 'submit', class: 'botao botao--roxo' }, 'Criar aula'),
    ]);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!c.data.value) return avisar('Informe a data da aula.', 'erro');
      const { error: erro } = await sb.from('aulas').insert({
        turma_id: turma,
        numero: c.numero.value ? Number(c.numero.value) : null,
        titulo: c.titulo.value.trim() || null,
        data: c.data.value,
        hora_inicio: c.hora_inicio.value || null,
        hora_fim: c.hora_fim.value || null,
      });
      if (erro) return avisar(textoDoErro(erro), 'erro');
      avisar('Aula criada.', 'sucesso');
      abaAulas(alvo, turma);
    });
    blocos.push(form);
  }
  alvo.replaceChildren(...blocos.filter(Boolean) as HTMLElement[]);
}

// --------------------------------------------------------------- exportar
async function abaExportar(alvo: HTMLElement, t: Turma) {
  const nomeBase = `${t.curso}-${t.nome}`.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const exportarInscricoes = async () => {
    const { data, error } = await sb.from('v_inscricoes').select('*').eq('turma_id', t.id).order('status').order('posicao_espera').order('nome');
    if (error) return avisar(textoDoErro(error), 'erro');
    baixarCsv(
      `inscricoes-${nomeBase}.csv`,
      [
        { chave: 'codigo', titulo: 'Código' },
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'data_nascimento', titulo: 'Nascimento' },
        { chave: 'whatsapp', titulo: 'WhatsApp' },
        { chave: 'email', titulo: 'E-mail' },
        { chave: 'bairro', titulo: 'Bairro' },
        { chave: 'disponibilidade', titulo: 'Disponibilidade' },
        { chave: 'status_nome', titulo: 'Situação' },
        { chave: 'posicao_espera', titulo: 'Posição na espera' },
        { chave: 'criado_em_br', titulo: 'Inscrita em' },
        { chave: 'motivo_cancelamento', titulo: 'Motivo do cancelamento' },
      ],
      (data ?? []).map((i: any) => ({ ...i, status_nome: NOMES_STATUS_INSCRICAO[i.status], criado_em_br: formatarDataHora(i.criado_em) })),
    );
  };

  const exportarPresencas = async () => {
    const { data, error } = await sb.from('v_presencas').select('*').eq('turma_id', t.id).order('aula_data').order('nome');
    if (error) return avisar(textoDoErro(error), 'erro');
    baixarCsv(
      `presencas-${nomeBase}.csv`,
      [
        { chave: 'aula_data_br', titulo: 'Data da aula' },
        { chave: 'aula_nome', titulo: 'Aula' },
        { chave: 'codigo', titulo: 'Código' },
        { chave: 'nome', titulo: 'Nome' },
        { chave: 'status_nome', titulo: 'Presença' },
        { chave: 'metodo_nome', titulo: 'Como foi registrada' },
        { chave: 'registrado_em_br', titulo: 'Registrada em' },
        { chave: 'corrigido_em_br', titulo: 'Corrigida em' },
        { chave: 'motivo_correcao', titulo: 'Motivo da correção' },
      ],
      (data ?? []).map((p: any) => ({
        ...p,
        aula_data_br: formatarData(p.aula_data),
        aula_nome: p.aula_titulo || `Aula ${p.aula_numero ?? ''}`.trim(),
        status_nome: NOMES_PRESENCA[p.status],
        metodo_nome: NOMES_METODO[p.metodo],
        registrado_em_br: formatarDataHora(p.registrado_em),
        corrigido_em_br: p.corrigido_em ? formatarDataHora(p.corrigido_em) : '',
      })),
    );
  };

  alvo.replaceChildren(
    el('p', {}, 'Os arquivos contêm dados pessoais. Guarde em local seguro, não compartilhe em grupos e apague quando não precisar mais.'),
    el('div', { class: 'barra' }, [botao('Baixar inscrições (CSV)', exportarInscricoes), botao('Baixar presenças (CSV)', exportarPresencas)]),
  );
}

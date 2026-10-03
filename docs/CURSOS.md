# Módulo de cursos: inscrições e lista de chamada

Módulo para inscrições nos cursos de tranças e controle de presença. O código está pronto e testado, mas **só funciona depois de criar e configurar as contas descritas abaixo**. Sem essa configuração, o site continua como está: as páginas do módulo mostram "nenhuma inscrição aberta" e o link "Cursos" não aparece.

## Arquitetura

```
 Navegador (GitHub Pages, site estático)
 │
 ├─ /cursos/   ──► Edge Function "inscricao" ─┐
 ├─ /presenca/ ──► Edge Function "presenca" ──┤  captcha, limite de tentativas,
 │                                            │  validação → funções SQL
 │                                            ▼
 ├─ link "Cursos" ──► RPC turmas_publicas()   Supabase (Postgres)
 │   (só leitura, sem dados pessoais)         ├─ tabelas com RLS
 │                                            ├─ funções de regra de negócio
 └─ /painel/ ──► Supabase Auth (login) ─────► └─ histórico (auditoria)
                 + tabelas/funções sob RLS
```

- **Site (GitHub Pages):** arquivos estáticos. Recebe só a URL do Supabase e a **chave pública** (anon/publishable), que foi feita para ficar no navegador. Ela não dá acesso a dado nenhum: o banco nega tudo ao papel `anon`, exceto duas funções de leitura sem dados pessoais.
- **Banco (Supabase Postgres):** as regras ficam no banco, em funções transacionais.
  - **Vagas:** a turma é travada durante a inscrição, então envios simultâneos não estouram o limite.
  - **Lista de espera e duplicidade:** pessoa identificada pelo WhatsApp normalizado, uma inscrição ativa por turma.
  - **Código individual:** `CDM-XXXX-XXXX`, gerado com aleatoriedade forte.
  - **Chamada:** janela de 5 a 180 minutos aberta pela equipe.
  - **Presença única** por aula, com correções que exigem motivo.
- **Edge Functions (`inscricao`, `presenca`):** são a única porta pública de gravação. Elas:
  - conferem a origem do pedido;
  - bloqueiam robôs (campo-armadilha, tempo mínimo de preenchimento e Cloudflare Turnstile na inscrição);
  - limitam tentativas por IP (guardando só um hash com sal) e, na presença, por identificador;
  - validam os dados e chamam funções que só a chave de serviço pode executar. Essa chave existe apenas nos segredos do Supabase.
- **Painel (`/painel/`):** login com e-mail e senha do Supabase Auth. A página é pública, mas vazia: os dados chegam depois do login, filtrados pelo RLS conforme a função.

### Funções da equipe

| Ação | Professora | Coordenação | Administração |
| --- | :-: | :-: | :-: |
| Ver turmas, aulas e números de vagas | ✓ | ✓ | ✓ |
| Abrir e encerrar chamada, marcar e corrigir presença | ✓ | ✓ | ✓ |
| Ver nome e situação na lista de chamada | ✓ | ✓ | ✓ |
| Ver WhatsApp, e-mail, bairro e nascimento | | ✓ | ✓ |
| Criar e editar cursos, turmas e aulas; abrir e encerrar inscrições | | ✓ | ✓ |
| Inscrever, alterar, cancelar e promover da lista de espera | | ✓ | ✓ |
| Exportar CSV, ver histórico | | ✓ | ✓ |
| Gerenciar equipe; anonimizar participante (LGPD) | | | ✓ |

### Estados da turma

`rascunho` → `inscrições programadas` → `inscrições abertas` → `inscrições encerradas` → `em andamento` → `concluída` (ou `cancelada`).

- **Programadas** viram **abertas** sozinhas na data de início das inscrições.
- **Abertas** viram **encerradas** sozinhas na data de fim.
- Só turmas efetivamente **abertas** aparecem no site.
- A equipe pode abrir ou encerrar manualmente pelo painel.

### Lista de chamada pelo QR Code

1. A professora entra no painel, escolhe a turma e a aula, e abre a chamada (15, 30, 45 ou 60 minutos).
2. Ela mostra o **QR Code fixo** (painel → QR Code, pode imprimir). Ele leva a `/presenca/`.
3. A aluna digita o **código da inscrição** ou o **WhatsApp cadastrado**.
4. A presença só é aceita se a chamada daquela turma estiver aberta, a inscrição estiver confirmada (lista de espera não conta) e ainda não houver presença na aula.
5. A professora encerra a chamada (ou ela fecha sozinha no fim do prazo).

O QR é sempre o mesmo e pode ser fotografado: a segurança está na chamada aberta e na identificação, não no endereço.

Cada presença guarda participante, turma, aula, data e horário, e o método:

- **QR + código**;
- **QR + WhatsApp**;
- **manual**.

Presenças registradas pelo QR ficam com `registrado_por` vazio.

Na chamada manual, a equipe marca **presente**, **ausente**, **presença justificada** ou **não registrado**. Alterar uma presença já existente, inclusive vinda do QR, exige motivo e guarda data, responsável e motivo.

> **Atenção ao QR impresso:** ele aponta para o endereço em que o site foi publicado no momento do build (hoje, o endereço temporário). Quando o domínio oficial for conectado, imprima o QR de novo.

## Estrutura de dados

Migração: [`supabase/migrations/20261003120000_cursos_e_presenca.sql`](../supabase/migrations/20261003120000_cursos_e_presenca.sql)

| Tabela ou visão | Conteúdo |
| --- | --- |
| `equipe` | Usuários administrativos (ligados ao Supabase Auth) e sua função |
| `cursos` | Nome, descrição, público, carga horária, ativo |
| `turmas` | Curso, local, dias e horários, datas, vagas, período de inscrição, idade mínima, situação |
| `aulas` | Data e horário de cada aula e a janela da chamada (quem abriu e quem encerrou) |
| `participantes` | Nome, nascimento, WhatsApp, e-mail opcional, bairro, data e versão do consentimento |
| `inscricoes` | Turma, participante, código, situação, posição na espera, disponibilidade, cancelamento |
| `lista_espera` (visão) | Inscrições em espera, por ordem |
| `presencas` | Aula, inscrição, situação, método, quem registrou, correção (quando, quem, motivo) |
| `historico` | Toda inserção, alteração e exclusão: tabela, autor, data, motivo, antes e depois |
| `tentativas` | Hash por IP/identificador para limitar tentativas (apagado após 1 dia) |

## Serviços, custos e limites

| Serviço | Para quê | Custo | Limites relevantes |
| --- | --- | --- | --- |
| **Supabase** | Banco, login da equipe, Edge Functions | Plano gratuito: US$ 0 | 500 MB de banco, 500 mil chamadas de Edge Function/mês, 50 mil usuários ativos. **Projetos gratuitos são pausados após 7 dias sem uso** e precisam ser reativados no painel do Supabase. O plano Pro (US$ 25/mês) evita a pausa e inclui backups diários. |
| **Cloudflare Turnstile** | Verificação anti-robô na inscrição | Gratuito | Sem limite prático para este uso |
| **GitHub Pages** | Hospedagem do site | Gratuito | Repositório público |

Os dados não ficam no GitHub: o repositório só tem o código e a estrutura do banco.

## Configuração (passo a passo)

Sem credenciais reais neste documento. **Nunca** coloque a chave secreta (service_role/secret) no repositório, no GitHub Actions ou no site.

### 1. Supabase

1. Crie uma conta em supabase.com e um projeto. Região recomendada: **South America (São Paulo)**. Guarde a senha do banco num gerenciador de senhas.
2. **Authentication → Providers → Email:** mantenha e-mail e senha.
3. **Authentication → Sign In / Providers:** **desative "Allow new users to sign up"**. Só a administração cria contas.
4. **Authentication → URL Configuration:**
   - *Site URL* = endereço do site (temporário por enquanto);
   - *Redirect URLs* = endereço de `/painel/`, para o link de recuperação de senha.
5. Aplique a migração por um dos caminhos:
   - **SQL Editor:** cole o conteúdo do arquivo da migração e execute; ou
   - **Supabase CLI:** `supabase link --project-ref <ref>` e depois `supabase db push`.
6. Publique as Edge Functions (precisa do [Supabase CLI](https://supabase.com/docs/guides/cli)):
   ```bash
   supabase functions deploy inscricao
   ```
   ```bash
   supabase functions deploy presenca
   ```
7. Defina os segredos das funções (**Edge Functions → Secrets**, ou `supabase secrets set`):

   | Segredo | Valor |
   | --- | --- |
   | `ORIGENS_PERMITIDAS` | Endereços do site separados por vírgula, sem barra final. Ex.: `https://lucashsouza1941-eng.github.io` |
   | `TURNSTILE_SECRET_KEY` | Chave **secreta** do Turnstile (passo 2) |
   | `SAL_TENTATIVAS` | Um texto aleatório longo (gere com um gerenciador de senhas) |

   `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já existem automaticamente dentro das Edge Functions. Não copie a chave de serviço para lugar nenhum.

### 2. Cloudflare Turnstile

1. Em dash.cloudflare.com → **Turnstile → Add widget**. Domínios: `lucashsouza1941-eng.github.io` (e, depois, o domínio oficial). Modo: *Managed*.
2. Copie a **Site Key** (pública, vai para o site) e a **Secret Key** (vai só para os segredos do Supabase, passo 1.7).

### 3. GitHub (build do site)

Em **Settings → Secrets and variables → Actions → Variables** do repositório `site-costa-da-mina`, crie:

| Variável | Valor |
| --- | --- |
| `PUBLIC_SUPABASE_URL` | URL do projeto (Project Settings → API) |
| `PUBLIC_SUPABASE_ANON_KEY` | Chave **pública** (anon ou publishable) |
| `PUBLIC_TURNSTILE_SITE_KEY` | Site Key do Turnstile |

São valores públicos por natureza; por isso ficam em *Variables*, não em *Secrets*. Depois, rode o workflow **Publicar** (ou faça um push). Os testes do build falham se aparecer uma chave de serviço no site.

### 4. Primeiro administrador

1. Supabase → **Authentication → Users → Invite user** (ou *Add user*) com o e-mail da pessoa.
2. No **SQL Editor**, troque o e-mail e o nome:
   ```sql
   insert into public.equipe (user_id, nome, funcao)
   select id, 'Nome da pessoa', 'admin' from auth.users where email = 'email@exemplo.org';
   ```
3. Daí em diante, a administração adiciona professoras e coordenação pelo próprio painel (aba **Equipe**), depois de convidar a conta no Supabase.

### 5. Primeira turma

No painel:

1. **Cursos:** crie o curso.
2. **Turmas → Nova turma:** escolha a situação "inscrições programadas" (abre sozinha na data) ou "inscrições abertas".
3. O link **Cursos** aparece no site em até 5 minutos para quem já estava navegando.

## Desenvolvimento local

```bash
npm test
```

Roda os testes do banco (SQL real da migração em PGlite, com os papéis do Supabase simulados), das regras compartilhadas e do site gerado. Rode `npm run build` antes para os testes do site.

Para ver `/cursos/` e `/presenca/` funcionando sem conta no Supabase, há um Supabase falso (só endpoints públicos, sem login):

```bash
node tests/apoio/supabase-falso.mjs
```

Em outro terminal (o `--force` substitui um servidor de desenvolvimento já aberto):

```bash
PUBLIC_SUPABASE_URL=http://localhost:54321 PUBLIC_SUPABASE_ANON_KEY=dev npx astro dev --force
```

Atalhos do Supabase falso: `http://localhost:54321/dev/abrir-chamada`, `/dev/fechar-chamada` e `/dev/lotar` (deixa 1 vaga, para testar a lista de espera).

## LGPD: como o módulo atende

- **Dados mínimos:** sem CPF ou RG; e-mail opcional. A data de nascimento serve para a idade mínima.
- **Finalidade:** explicada no próprio formulário e na Política de Privacidade (seção 12).
- **Consentimento:** obrigatório, com data e versão da política guardadas.
- **Acesso restrito:**
  - RLS por função;
  - a professora não vê contatos;
  - nada pessoal em páginas públicas;
  - a confirmação de presença não revela nome de ninguém.
- **Correção:** coordenação e administração editam a inscrição, com motivo registrado.
- **Exclusão:** a administração anonimiza a participante. Os dados pessoais somem, inclusive do histórico, e as presenças viram só números.
- **Auditoria:** a tabela `historico` registra quem fez o quê, quando e por quê.
- **CSV exportado:** protegido contra injeção de fórmulas. O painel avisa que o arquivo contém dados pessoais.

Pendências de decisão do Instituto (prazo de guarda, idade mínima e autorização de responsáveis) estão em [PENDENCIAS.md](PENDENCIAS.md).

/**
 * Informações ainda NÃO confirmadas pelo Instituto.
 *
 * Regras:
 * - Nada daqui é exibido ao público. O componente <Pendente> só aparece em
 *   `npm run dev`; no build de produção ele não gera nenhum HTML.
 * - Quando uma pendência for resolvida, mova a informação para
 *   src/data/instituto.ts (ou para o projeto) e apague o item daqui.
 * - `npm run pendencias` lista tudo e atualiza docs/PENDENCIAS.md.
 */

export type Pendencia = {
  id: string;
  assunto: string;
  /** O que se sabe hoje e o que falta confirmar. */
  situacao: string;
  /** Onde a informação entraria no site. */
  onde: string;
};

export const pendencias = [
  {
    id: 'nome-juridico',
    assunto: 'Nome jurídico da organização',
    situacao:
      'O site anterior usa "Instituto Costa da Mina" e, nas páginas dos projetos, "Associação Costa da Mina". Confirmar a razão social do CNPJ 62.212.632/0001-76.',
    onde: 'Rodapé, Contribua, Política de Privacidade',
  },
  {
    id: 'ano-fundacao',
    assunto: 'Data ou ano de fundação',
    situacao: 'Não informado. O rodapé antigo mostra "© 2025", o que não comprova a data de fundação.',
    onde: 'Sobre o Instituto (linha do tempo)',
  },
  {
    id: 'cep',
    assunto: 'CEP do endereço',
    situacao: 'O site anterior traz só "R. Osório de Castro, 109 – Vila Inglesa – Cidade Ademar".',
    onde: 'Contato e rodapé',
  },
  {
    id: 'horario',
    assunto: 'Horário de atendimento',
    situacao: 'Não informado no site anterior.',
    onde: 'Contato',
  },
  {
    id: 'whatsapp',
    assunto: 'Número de WhatsApp',
    situacao:
      'O site anterior exibe (11) 95858-1395, mas um dos botões apontava para 55119585813950 (um dígito a mais). O novo site usa 5511958581395; confirmar.',
    onde: 'Todo o site',
  },
  {
    id: 'trancando-nome',
    assunto: 'Nome do projeto "Trançando o Futuro"',
    situacao:
      'O menu e a página usam "Trançando o Futuro"; a home e a Política de Privacidade antigas usam "Trançando Futuros". O novo site adota "Trançando o Futuro".',
    onde: 'Projetos',
  },
  {
    id: 'trancando-agenda',
    assunto: 'Agenda atual das oficinas do Trançando o Futuro',
    situacao:
      'Um cartaz antigo cita domingos, 10h às 12h, +14 anos, na Casa de Cultura (Av. Durval Pinto Ferreira, 820 – Jd. Itacolomi). Não se sabe se a turma segue aberta; por isso o site não publica datas.',
    onde: 'Projeto Trançando o Futuro',
  },
  {
    id: 'tranca-amiga-como-participar',
    assunto: 'Como pedir um atendimento do Trança Amiga',
    situacao:
      'O site anterior descreve o projeto, mas não explica como a pessoa se inscreve (e o link /tranca-amiga estava quebrado). O novo site direciona para o WhatsApp.',
    onde: 'Projeto Trança Amiga',
  },
  {
    id: 'sarau-descricao',
    assunto: 'Descrição do Sarau Trançado',
    situacao: 'O site anterior só cita o nome, o perfil @sarau.trancado e um cartaz. Falta um texto oficial.',
    onde: 'Projeto Sarau Trançado',
  },
  {
    id: 'federacao',
    assunto: 'Federação internacional citada na trajetória da Helaine',
    situacao: 'O texto fala em "conexão com uma federação internacional da área", sem o nome. Mantido sem detalhes.',
    onde: 'Sobre o Instituto',
  },
  {
    id: 'imprensa',
    assunto: 'Matérias na imprensa',
    situacao:
      'O site anterior mostra um print do g1 ("Transformação pela comunidade": Rua da Vila Inglesa vira galeria de arte urbana), sem link. Falta o link oficial e a data para citar a matéria.',
    onde: 'Projeto Beco da Mina',
  },
  {
    id: 'autorizacao-imagens',
    assunto: 'Autorização de uso de imagem',
    situacao:
      'As fotos vieram do site anterior. Confirmar autorização das pessoas retratadas e a origem das fotos históricas em preto e branco (não usadas por enquanto).',
    onde: 'Todo o site',
  },
  {
    id: 'fotos-alta-resolucao',
    assunto: 'Fotos em alta resolução',
    situacao:
      'Várias fotos do Beco da Mina só existiam no site anterior como uma colagem de 1920×300 px; os recortes ficam pequenos (cerca de 260 px de largura). Pedir os arquivos originais ao Instituto.',
    onde: 'Beco da Mina e página inicial',
  },
  {
    id: 'qr-code',
    assunto: 'QR Code da página "Sobre"',
    situacao: 'O site anterior exibe um QR Code sem dizer para onde ele leva. Não foi reaproveitado.',
    onde: 'Contribua',
  },
  {
    id: 'privacidade-data',
    assunto: 'Data de atualização da Política de Privacidade',
    situacao: 'A política anterior promete exibir a data de atualização, mas não exibe. Definir a data na aprovação.',
    onde: 'Política de Privacidade',
  },
  {
    id: 'pix-validacao',
    assunto: 'Chave PIX para doações',
    situacao:
      'O site anterior publica o CNPJ 62.212.632/0001-76 como chave PIX. Na versão em Next.js a chave só aparece depois que o Instituto confirmar que ela está ativa e em nome da organização.',
    onde: 'Seção Apoie e página /apoie',
  },
  {
    id: 'logo-branco',
    assunto: 'Versão branca do logotipo',
    situacao:
      'O design aprovado usa um logo diferente do oficial. Será usada uma versão branca derivada do logotipo oficial (header escuro e rodapé). Confirmar com o Instituto se existe arquivo oficial dessa versão.',
    onde: 'Header e rodapé',
  },
  {
    id: 'textos-design',
    assunto: 'Textos curtos vindos do design aprovado',
    situacao:
      'Pilares, descrições curtas dos projetos (ex.: Sarau Trançado "Música, poesia e cultura da nossa comunidade") e frases da home vêm da imagem aprovada, não do site anterior. Confirmar que descrevem as atividades reais.',
    onde: 'Home e cards de projetos',
  },
  {
    id: 'contas-cursos',
    assunto: 'Contas do módulo de cursos (Supabase e Cloudflare Turnstile)',
    situacao:
      'O módulo de inscrições e presença está pronto, mas só funciona depois de criar o projeto no Supabase, aplicar a migração, publicar as Edge Functions, criar o site no Turnstile e o primeiro usuário administrador (passo a passo em docs/CURSOS.md). Até lá, as páginas mostram "nenhuma inscrição aberta".',
    onde: '/cursos/, /presenca/ e /painel/',
  },
  {
    id: 'retencao-cursos',
    assunto: 'Prazo de guarda dos dados das inscrições',
    situacao:
      'A política diz apenas "pelo período necessário". Definir com o Instituto um prazo (por exemplo, até X meses após o fim da turma) e quem faz a exclusão.',
    onde: 'Política de Privacidade, seção 12',
  },
  {
    id: 'regiao-dados',
    assunto: 'Região do banco de dados',
    situacao:
      'Recomendado criar o projeto Supabase na região São Paulo (sa-east-1). Confirmar a região escolhida e citar na política, se o Instituto quiser.',
    onde: 'Política de Privacidade, seção 12',
  },
  {
    id: 'menores-cursos',
    assunto: 'Inscrição de menores de idade',
    situacao:
      'Um cartaz antigo cita "+14 anos". O sistema permite definir idade mínima por turma, mas o Instituto precisa decidir a idade e, para menores de 18, se exigirá autorização de responsável (a LGPD pede consentimento de responsável para crianças de até 12 anos).',
    onde: 'Formulário de inscrição',
  },
  {
    id: 'outras-redes',
    assunto: 'Outras redes sociais',
    situacao: 'Só o Instagram (@instituto.costadamina e @sarau.trancado) aparece no site anterior. Confirmar se há Facebook, YouTube ou TikTok oficiais.',
    onde: 'Rodapé e Contato',
  },
] as const satisfies readonly Pendencia[];

export type IdPendencia = (typeof pendencias)[number]['id'];

export const buscarPendencia = (id: IdPendencia) => pendencias.find((p) => p.id === id)!;

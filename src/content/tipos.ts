// Tipos do conteúdo do site. Hoje os dados vêm de arquivos em src/content;
// quando houver CMS ou painel (/admin), a mesma forma será preenchida pelo
// backend, sem mudar as páginas (ver src/lib/conteudo.ts).

/** Marca conteúdo de demonstração: só aparece em desenvolvimento. */
export type Demonstracao = { exemplo?: boolean };

export type Imagem = {
  /** Caminho em /public, ex.: "/images/projetos/beco-da-mina/mural.webp" */
  src: string;
  alt: string;
  largura: number;
  altura: number;
  /** Ponto focal para recortes (object-position), ex.: "50% 30%" */
  foco?: string;
  /** De onde veio o arquivo (inventário em docs/IMAGENS.md) */
  origem?: string;
};

export type IconePilar = 'cultura' | 'educacao' | 'arte' | 'comunidade' | 'renda';

export type Pilar = { titulo: string; texto: string; icone: IconePilar };

export type SlugProjeto = 'beco-da-mina' | 'trancando-o-futuro' | 'tranca-amiga' | 'sarau-trancado';

export type Projeto = {
  slug: SlugProjeto;
  nome: string;
  /** Texto curto do card (design aprovado) */
  resumoCard: string;
  /** Subtítulo da página do projeto */
  chamada: string;
  paragrafos: string[];
  fichas: { rotulo: string; valor: string }[];
  citacao?: { texto: string; autoria: string; papel: string };
  capa?: Imagem;
  marca?: Imagem;
  fotos: Imagem[];
  links?: { rotulo: string; url: string }[];
};

export type CategoriaEvento = 'oficina' | 'sarau' | 'acao' | 'formacao' | 'encontro';

export type Evento = Demonstracao & {
  id: string;
  nome: string;
  descricao: string;
  /** AAAA-MM-DD */
  data: string;
  /** "10h às 12h" */
  horario?: string;
  local: string;
  categoria: CategoriaEvento;
  imagem?: Imagem;
  projeto?: SlugProjeto;
  inscricao?: { tipo: 'site' | 'externa' | 'whatsapp'; url?: string; rotulo?: string };
};

export type CategoriaNoticia = 'cultura' | 'projetos' | 'eventos' | 'formacao' | 'institucional';

export type Noticia = Demonstracao & {
  slug: string;
  titulo: string;
  resumo: string;
  /** AAAA-MM-DD */
  data: string;
  categoria: CategoriaNoticia;
  imagem?: Imagem;
  corpo: string[];
  projeto?: SlugProjeto;
};

export type CategoriaGaleria = 'beco-da-mina' | 'oficinas' | 'territorio' | 'institucional' | 'eventos';

export type ItemGaleria = Demonstracao & {
  id: string;
  imagem: Imagem;
  categoria: CategoriaGaleria;
  projeto?: SlugProjeto;
};

export type Parceiro = Demonstracao & { nome: string; logo?: Imagem; url?: string };

/** Indicador de impacto: só entra com fonte e data de referência. */
export type Indicador = { rotulo: string; valor: string; fonte: string; referencia: string };

export type ItemMenu = { rotulo: string; href: string };

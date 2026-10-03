// Textos da página inicial. Origem: design aprovado pela equipe e site
// anterior. Nada de números ou estatísticas sem fonte (ver indicadores.ts).
import type { ItemMenu, Pilar } from './tipos.ts';

export const menuPrincipal: ItemMenu[] = [
  { rotulo: 'Início', href: '/' },
  { rotulo: 'Instituto', href: '/instituto/' },
  { rotulo: 'Projetos', href: '/projetos/' },
  { rotulo: 'Impacto', href: '/#impacto' },
  { rotulo: 'Agenda', href: '/agenda/' },
  { rotulo: 'Notícias', href: '/noticias/' },
  { rotulo: 'Galeria', href: '/galeria/' },
  { rotulo: 'Apoie', href: '/apoie/' },
  { rotulo: 'Contato', href: '/contato/' },
];

export const hero = {
  frase: ['Raízes que educam,', 'cultura que transforma.'],
  titulo: ['Cultura, educação', 'e oportunidades para', 'um futuro mais justo.'],
  texto:
    'O Instituto Costa da Mina atua na Cidade Ademar – SP, promovendo cultura, educação, arte e oportunidades para fortalecer pessoas e transformar territórios.',
  nota: 'Da nossa comunidade para o mundo.',
};

export const pilares: Pilar[] = [
  { titulo: 'Cultura e Identidade', texto: 'Valorização da nossa história e ancestralidade.', icone: 'cultura' },
  { titulo: 'Educação e Formação', texto: 'Conhecimento como ferramenta de transformação.', icone: 'educacao' },
  { titulo: 'Arte e Território', texto: 'A arte que revitaliza e dá vida para a comunidade.', icone: 'arte' },
  { titulo: 'Comunidade e Pertencimento', texto: 'Pessoas que constroem juntas, mais fortes.', icone: 'comunidade' },
  { titulo: 'Geração de Renda', texto: 'Novos caminhos e oportunidades reais.', icone: 'renda' },
];

export const impactoQualitativo = [
  { titulo: 'Educação', texto: 'Formação e aprendizado para novas gerações.', icone: 'educacao' },
  { titulo: 'Comunidade', texto: 'Fortalecimento de vínculos e pertencimento.', icone: 'comunidade' },
  { titulo: 'Cultura', texto: 'Arte que transforma territórios.', icone: 'arte' },
  { titulo: 'Oportunidades', texto: 'Desenvolvimento e geração de renda.', icone: 'renda' },
] as const satisfies readonly Pilar[];

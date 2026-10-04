// Coleções que dependem de dados reais do Instituto. Itens com
// `exemplo: true` existem só para desenvolver o layout: nunca são
// publicados (src/lib/conteudo.ts filtra em produção).
import type { Evento, Indicador, ItemGaleria, Noticia, Parceiro } from './tipos.ts';

export const agenda: Evento[] = [
  {
    exemplo: true,
    id: 'exemplo-oficina',
    nome: '[Exemplo] Oficina de tranças',
    descricao: 'Evento fictício para desenvolvimento do layout.',
    data: '2099-01-12',
    horario: '10h às 12h',
    local: 'Cidade Ademar – SP',
    categoria: 'oficina',
    projeto: 'trancando-o-futuro',
  },
  {
    exemplo: true,
    id: 'exemplo-sarau',
    nome: '[Exemplo] Sarau Trançado',
    descricao: 'Evento fictício para desenvolvimento do layout.',
    data: '2099-01-18',
    local: 'Cidade Ademar – SP',
    categoria: 'sarau',
    projeto: 'sarau-trancado',
  },
  {
    exemplo: true,
    id: 'exemplo-beco',
    nome: '[Exemplo] Beco da Mina – ação',
    descricao: 'Evento fictício para desenvolvimento do layout.',
    data: '2099-01-25',
    local: 'Cidade Ademar – SP',
    categoria: 'acao',
    projeto: 'beco-da-mina',
  },
];

export const noticias: Noticia[] = [
  {
    exemplo: true,
    slug: 'exemplo-beco-da-mina',
    titulo: '[Exemplo] Notícia do Beco da Mina',
    resumo: 'Texto fictício: espaço para notícias reais do projeto.',
    data: '2099-01-01',
    categoria: 'cultura',
    projeto: 'beco-da-mina',
    corpo: ['Conteúdo de demonstração. Não publicar.'],
  },
  {
    exemplo: true,
    slug: 'exemplo-formacao',
    titulo: '[Exemplo] Notícia de formação',
    resumo: 'Texto fictício: espaço para oficinas e novas turmas.',
    data: '2099-01-01',
    categoria: 'formacao',
    projeto: 'trancando-o-futuro',
    corpo: ['Conteúdo de demonstração. Não publicar.'],
  },
  {
    exemplo: true,
    slug: 'exemplo-sarau',
    titulo: '[Exemplo] Notícia do Sarau Trançado',
    resumo: 'Texto fictício: espaço para novidades culturais.',
    data: '2099-01-01',
    categoria: 'eventos',
    projeto: 'sarau-trancado',
    corpo: ['Conteúdo de demonstração. Não publicar.'],
  },
];

/** Itens extras da galeria. As fotos do acervo oficial entram automaticamente
 *  (scripts/imagens/fontes.mjs, campo `galeria`). */
export const galeria: ItemGaleria[] = [];

export const parceiros: Parceiro[] = Array.from({ length: 6 }, (_, i) => ({
  exemplo: true,
  nome: `[Exemplo] Parceiro ${i + 1}`,
}));

/** Vazio de propósito: nenhum número publicado sem fonte confirmada. */
export const indicadores: Indicador[] = [];

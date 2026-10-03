// Acesso tipado ao acervo oficial de imagens (gerado por
// scripts/imagens/baixar.mjs a partir de scripts/imagens/fontes.mjs).
import dados from './acervo.gerado.json' with { type: 'json' };
import type { CategoriaGaleria, Imagem } from './tipos.ts';

type Bruto = Imagem & {
  categoria: string;
  tipo: 'foto' | 'grafico' | 'marca';
  galeria: boolean;
  origem: string;
  nota?: string;
};

/** O que as páginas recebem: sem a URL de origem (essa fica só no inventário). */
export type Registro = Imagem & { categoria: string; tipo: Bruto['tipo']; galeria: boolean };

const brutos = dados.imagens as Record<string, Bruto>;
const imagens: Record<string, Registro> = Object.fromEntries(
  Object.entries(brutos).map(([id, { src, alt, largura, altura, categoria, tipo, galeria }]) => [
    id,
    { src, alt, largura, altura, categoria, tipo, galeria },
  ]),
);

export type IdImagem = keyof typeof dados.imagens;

/** Imagem oficial pelo id. Falha no build se o id não existir. */
export function imagem(id: IdImagem): Registro {
  const registro = imagens[id];
  if (!registro) throw new Error(`Imagem "${String(id)}" não está no acervo.`);
  return registro;
}

export const todasAsImagens = (): (Registro & { id: string })[] =>
  Object.entries(imagens).map(([id, r]) => ({ id, ...r }));

const categoriasGaleria: Record<string, CategoriaGaleria> = {
  'beco-da-mina': 'beco-da-mina',
  'trancando-o-futuro': 'oficinas',
  comunidade: 'territorio',
  instituto: 'institucional',
};

/** Fotos marcadas para a galeria, com a categoria do filtro. */
export const fotosDaGaleria = () =>
  todasAsImagens()
    .filter((i) => i.galeria)
    .map((i) => ({ id: i.id, imagem: i as Imagem, categoria: categoriasGaleria[i.categoria] ?? 'institucional' }));

export const video = (id: keyof typeof dados.videos) => {
  const { src, capa, descricao } = dados.videos[id];
  return { src, capa, descricao };
};

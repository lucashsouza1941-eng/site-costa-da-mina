'use client';

// Loader do next/image para exportação estática (GitHub Pages).
// Matrizes em /images/…/nome.webp viram /_img/…/nome-<largura>.webp,
// variantes geradas no build por scripts/imagens/variantes.mjs.
import { caminhoDaVariante, LARGURAS } from './larguras';

type Parametros = { src: string; width: number; quality?: number };

export default function carregarImagem({ src, width }: Parametros): string {
  if (/^https?:\/\//.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  if (src.startsWith('/images/') && src.endsWith('.webp')) {
    // largura disponível mais próxima (o next/image só pede larguras da lista)
    const largura = LARGURAS.find((l) => l >= width) ?? LARGURAS[LARGURAS.length - 1];
    return `${base}${caminhoDaVariante(src, largura)}`;
  }
  return `${base}${src}`;
}

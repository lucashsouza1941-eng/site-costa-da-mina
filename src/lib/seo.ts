// Metadados por página (Metadata API). Endereço temporário: noindex no
// layout raiz; aqui só título, descrição, canonical e OpenGraph.
import type { Metadata } from 'next';
import { urlAbsoluta } from './site';

export function metadados({ titulo, descricao, caminho, imagem }: { titulo: string; descricao: string; caminho: string; imagem?: string }): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: urlAbsoluta(caminho) },
    openGraph: {
      title: titulo,
      description: descricao,
      url: urlAbsoluta(caminho),
      type: 'website',
      locale: 'pt_BR',
      ...(imagem ? { images: [{ url: urlAbsoluta(imagem) }] } : {}),
    },
  };
}

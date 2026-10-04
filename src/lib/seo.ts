// Metadados por página (Metadata API). Endereço temporário: noindex no
// layout raiz; aqui só título, descrição, canonical e OpenGraph.
import type { Metadata } from 'next';
import { urlAbsoluta } from './site';

export function metadados({ titulo, descricao, caminho }: { titulo: string; descricao: string; caminho: string }): Metadata {
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
      // imagem de compartilhamento do site (JPEG: WhatsApp e Facebook não
      // exibem WebP com confiabilidade)
      images: [{ url: urlAbsoluta('/opengraph-image.jpg'), width: 1200, height: 630, alt: 'Instituto Costa da Mina' }],
    },
  };
}

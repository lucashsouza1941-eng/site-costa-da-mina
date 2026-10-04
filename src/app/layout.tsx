import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { classesDasFontes } from '@/lib/fontes';
import { indexavel, urlDoSite } from '@/lib/site';
import { instituto } from '@/content/instituto';
import { Cabecalho } from '@/components/layout/Cabecalho';
import { Rodape } from '@/components/layout/Rodape';
import { jsonLd, organizacao } from '@/lib/dados-estruturados';

export const metadata: Metadata = {
  // só a origem: o Next já acrescenta o basePath às URLs de arquivos de
  // metadados (ícones, imagem de compartilhamento); canonical e og:url de cada
  // página são absolutos (lib/seo.ts)
  metadataBase: new URL(urlDoSite),
  title: {
    default: `${instituto.nome} · ${instituto.lema.join(' ')}`,
    template: `%s · ${instituto.nome}`,
  },
  description: `Organização cultural e comunitária da ${instituto.territorio}. ${instituto.lema.join(' ')}`,
  applicationName: instituto.nome,
  // Endereço temporário: fora dos buscadores até a aprovação final.
  robots: indexavel ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: instituto.nome },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#2e113c',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={classesDasFontes}>
      <body className="min-h-dvh antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizacao())} />
        <a
          href="#conteudo"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-pill bg-accent px-4 py-2 font-heading font-bold text-primary-deep focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Cabecalho />
        {children}
        <Rodape />
      </body>
    </html>
  );
}

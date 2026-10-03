import type { NextConfig } from 'next';

// Exportação estática para o GitHub Pages (endereço temporário).
// BASE_PATH vem do workflow de publicação (ex.: "/site-costa-da-mina").
const basePath = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

const desenvolvimento = process.env.NODE_ENV !== 'production';

const config: NextConfig = {
  output: 'export',
  // Arquivos *.dev.tsx (ex.: vitrine do design system) só viram rota em
  // desenvolvimento; no build de produção nem são gerados.
  pageExtensions: desenvolvimento ? ['dev.tsx', 'tsx', 'ts'] : ['tsx', 'ts'],
  trailingSlash: true,
  basePath: basePath || undefined,
  images: {
    // O Pages não roda o otimizador do Next: as variantes AVIF/WebP são
    // geradas no build pelo script de imagens (Fase 2) e servidas por um
    // loader próprio.
    loader: 'custom',
    loaderFile: './src/lib/imagens/loader.ts',
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;

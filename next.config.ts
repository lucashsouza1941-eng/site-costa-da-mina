import type { NextConfig } from 'next';
import { LARGURAS_IMAGEM, LARGURAS_TELA } from './src/lib/imagens/larguras';

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
    // O Pages não roda o otimizador do Next: as variantes WebP por largura
    // são geradas no build (scripts/imagens/variantes.mjs) e o loader
    // próprio aponta para elas.
    loader: 'custom',
    loaderFile: './src/lib/imagens/loader.ts',
    deviceSizes: [...LARGURAS_TELA],
    imageSizes: [...LARGURAS_IMAGEM],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;

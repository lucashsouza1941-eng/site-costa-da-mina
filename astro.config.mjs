// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Endereço temporário de publicação. Enquanto o domínio oficial não for
// conectado, SITE_URL e BASE_PATH vêm do ambiente de deploy.
const site = process.env.SITE_URL ?? 'https://institutocostadamina.com.br';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});

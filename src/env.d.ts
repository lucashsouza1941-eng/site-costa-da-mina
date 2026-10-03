/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** URL do projeto Supabase (pública). */
  readonly PUBLIC_SUPABASE_URL?: string;
  /** Chave pública do Supabase (anon/publishable). Nunca a service_role/secret. */
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  /** Chave de site do Cloudflare Turnstile (pública). */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  /** "sim" só quando o domínio oficial estiver aprovado. */
  readonly PUBLIC_INDEXAVEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

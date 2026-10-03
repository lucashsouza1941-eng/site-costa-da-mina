// Configuração pública do módulo de cursos. Só valores feitos para o
// navegador: URL do projeto e chave pública (anon). A chave de serviço
// nunca entra no build (há teste que verifica).
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
export const supabaseChave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const turnstileChave = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export const cursosConfigurado = Boolean(supabaseUrl && supabaseChave);

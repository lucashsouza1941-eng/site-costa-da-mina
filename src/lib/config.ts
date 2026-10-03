// Configuração pública do módulo de cursos. Só valores feitos para o
// navegador: URL do projeto e chave pública (anon). A chave de serviço
// nunca entra no build (há teste que verifica).
export const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
export const supabaseChave = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
export const turnstileChave = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

export const cursosConfigurado = Boolean(supabaseUrl && supabaseChave);

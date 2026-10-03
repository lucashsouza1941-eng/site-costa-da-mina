// Configuração de publicação. Enquanto estiver no endereço temporário,
// o site não é indexado (NEXT_PUBLIC_INDEXAVEL só vira "sim" após a
// aprovação final e a conexão do domínio oficial).
export const urlDoSite = (process.env.SITE_URL ?? 'https://lucashsouza1941-eng.github.io').replace(/\/$/, '');
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const indexavel = process.env.NEXT_PUBLIC_INDEXAVEL === 'sim';
export const emDesenvolvimento = process.env.NODE_ENV !== 'production';

/** Caminho para arquivos em /public, respeitando o basePath do deploy. */
export const arquivo = (caminho: string) => `${basePath}/${caminho.replace(/^\//, '')}`;

/** URL absoluta (canonical, OpenGraph). */
export const urlAbsoluta = (caminho = '/') => `${urlDoSite}${basePath}${caminho.startsWith('/') ? caminho : `/${caminho}`}`;

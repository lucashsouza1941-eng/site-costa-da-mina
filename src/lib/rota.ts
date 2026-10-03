/** Monta um caminho interno respeitando o `base` do deploy (endereço temporário). */
export function rota(caminho = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const limpo = caminho.replace(/^\//, '');
  return `${base}/${limpo}`;
}

/** Caminho para arquivos em /public. */
export const arquivo = (nome: string) => rota(nome);

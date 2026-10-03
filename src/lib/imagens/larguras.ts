// Larguras das variantes de imagem. Usadas pelo next.config (deviceSizes e
// imageSizes), pelo loader e pelo script que gera as variantes no build.
export const LARGURAS_TELA = [640, 828, 1080, 1280, 1920] as const;
export const LARGURAS_IMAGEM = [96, 192, 384] as const;
export const LARGURAS = [...LARGURAS_IMAGEM, ...LARGURAS_TELA] as const;

/** Caminho da variante gerada para uma matriz em /images/…/nome.webp */
export function caminhoDaVariante(src: string, largura: number): string {
  return `/_img${src.replace(/^\/images/, '').replace(/\.webp$/, '')}-${largura}.webp`;
}

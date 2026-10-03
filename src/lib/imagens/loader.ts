// Loader do next/image para exportação estática.
// Fase 1: devolve o arquivo original (com o basePath). Na Fase 2 o script
// de imagens gera variantes AVIF/WebP por largura e este loader passa a
// apontar para elas.
type Parametros = { src: string; width: number; quality?: number };

export default function carregarImagem({ src, width }: Parametros): string {
  if (/^https?:\/\//.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  // o parâmetro de largura não altera o arquivo estático, mas mantém o
  // contrato do next/image (uma URL por largura)
  return `${base}${src}?w=${width}`;
}

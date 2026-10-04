// Criação de elementos sem innerHTML: todo texto vira textContent,
// então dados vindos do banco nunca são interpretados como HTML.
type Filho = Node | string | null | undefined | false;
type Atributos = Record<string, string | number | null | undefined>;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  atributos: Atributos = {},
  filhos: Filho | Filho[] = [],
): HTMLElementTagNameMap[K] {
  const elemento = document.createElement(tag);
  for (const [nome, valor] of Object.entries(atributos)) {
    if (valor === null || valor === undefined) continue;
    elemento.setAttribute(nome, String(valor));
  }
  for (const filho of Array.isArray(filhos) ? filhos : [filhos]) {
    if (filho === null || filho === undefined || filho === false) continue;
    elemento.append(typeof filho === 'string' ? document.createTextNode(filho) : filho);
  }
  return elemento;
}

const fuso = 'America/Sao_Paulo';

export const formatarData = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso).toLocaleDateString('pt-BR', { timeZone: fuso });

export const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { timeZone: fuso, dateStyle: 'short', timeStyle: 'short' });

export const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { timeZone: fuso, hour: '2-digit', minute: '2-digit' });

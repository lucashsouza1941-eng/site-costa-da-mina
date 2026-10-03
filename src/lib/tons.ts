import type { Projeto } from '../data/projetos';

/** Cor de destaque e cor de texto legível sobre ela, por projeto. */
export const tons: Record<Projeto['tom'], { cor: string; sobre: string }> = {
  laranja: { cor: 'var(--laranja)', sobre: 'var(--roxo-950)' },
  roxo: { cor: 'var(--roxo-700)', sobre: 'var(--papel)' },
  pessego: { cor: 'var(--pessego)', sobre: 'var(--roxo-950)' },
  magenta: { cor: 'var(--magenta)', sobre: 'var(--papel)' },
};

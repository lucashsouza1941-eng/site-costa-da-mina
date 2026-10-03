// Ornamentos da identidade visual, em SVG próprio (não são recortes da
// imagem de referência). Todos decorativos: aria-hidden.
import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';

type Base = { className?: string; style?: CSSProperties };

/**
 * Pinceladas de tinta (bordas do hero, do "Sobre" e da galeria).
 * Três traços irregulares sobrepostos, na cor atual (currentColor).
 */
export function Pincelada({ className, style }: Base) {
  return (
    <svg viewBox="0 0 120 400" className={cx('pointer-events-none', className)} style={style} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M58 4c9 2 14 18 13 40-2 41-15 88-20 131-6 52 6 97 2 146-2 31-9 59-18 75-4 1-7-3-6-9 6-36 9-73 6-112-4-55-12-104-5-158 5-41 10-80 18-108 3-4 6-6 10-5z" />
        <path
          d="M86 30c6 0 8 12 6 26-5 46-19 93-23 141-4 49 8 96 4 139-2 20-7 37-13 47-3 0-5-4-4-9 5-35 4-74 0-115-5-51-3-101 9-151 6-30 13-61 21-78z"
          opacity="0.75"
        />
        <path d="M29 60c4 1 5 9 4 19-4 52-1 104 3 155 3 42 1 82-7 111-2 2-5 0-5-4 1-46-6-93-8-140-2-47 2-96 9-131 1-6 2-10 4-10z" opacity="0.55" />
        <circle cx="96" cy="22" r="3" />
        <circle cx="20" cy="372" r="2.5" />
        <circle cx="74" cy="392" r="2" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Padrão geométrico do painel do Beco da Mina: losangos encadeados em linha. */
export function PadraoGeometrico({ className, style }: Base) {
  const id = 'padrao-losangos';
  return (
    <svg className={cx('pointer-events-none', className)} style={style} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
            <path d="M24 2 46 24 24 46 2 24z" />
            <path d="M24 11 37 24 24 37 11 24z" />
            <path d="M24 19 29 24 24 29 19 24z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Faixa em zigue-zague do rodapé (amarelo e roxo). */
export function Zigzag({ className, style }: Base) {
  return (
    <svg viewBox="0 0 240 36" preserveAspectRatio="none" className={cx('pointer-events-none', className)} style={style} aria-hidden="true" focusable="false">
      <g fill="none" strokeWidth="5" strokeLinejoin="miter">
        <path d="M0 10 12 22 24 10 36 22 48 10 60 22 72 10 84 22 96 10 108 22 120 10 132 22 144 10 156 22 168 10 180 22 192 10 204 22 216 10 228 22 240 10" stroke="var(--color-accent)" />
        <path d="M0 22 12 34 24 22 36 34 48 22 60 34 72 22 84 34 96 22 108 34 120 22 132 34 144 22 156 34 168 22 180 34 192 22 204 34 216 22 228 34 240 22" stroke="var(--color-primary)" />
      </g>
    </svg>
  );
}

/** Coroa em traço (detalhe dourado do design). */
export function Coroa({ className, style }: Base) {
  return (
    <svg viewBox="0 0 48 40" className={cx('pointer-events-none', className)} style={style} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 31 3 10l12 10L24 4l9 16 12-10-3 21z" />
        <path d="M7 36h34" />
        <circle cx="3" cy="9" r="2" />
        <circle cx="24" cy="3" r="2" />
        <circle cx="45" cy="9" r="2" />
      </g>
    </svg>
  );
}

/** Borda inferior ondulada (transição do hero para a faixa creme). */
export function BordaOndulada({ className, style }: Base) {
  return (
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className={cx('pointer-events-none block w-full', className)} style={style} aria-hidden="true" focusable="false">
      <path
        d="M0 22c90-10 170 8 260 2s150-16 250-8 170 14 270 6 170-16 270-8 160 12 230 6 100-10 160-4v24H0z"
        fill="currentColor"
      />
    </svg>
  );
}

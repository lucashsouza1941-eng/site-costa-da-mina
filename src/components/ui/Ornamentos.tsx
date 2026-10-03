// Ornamentos da identidade visual, em SVG próprio (não são recortes da
// imagem de referência). Todos decorativos: aria-hidden.
import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';

type Base = { className?: string; style?: CSSProperties };

/** Gerador pseudoaleatório com semente: o traço sai igual em todo build. */
function aleatorio(semente: number) {
  let s = semente >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Monta as cerdas de uma pincelada seca: faixas finas lado a lado, de comprimentos irregulares. */
function cerdas(semente: number) {
  const r = aleatorio(semente);
  const caminhos: { d: string; opacidade: number }[] = [];
  const total = 16;
  for (let i = 0; i < total; i++) {
    const posicao = (i + 0.5) / total; // 0 → 1 através da largura
    const inicio = 6 + r() * 60 * Math.abs(posicao - 0.5) * 2 + r() * 18;
    const fim = 394 - r() * 70 * Math.abs(posicao - 0.5) * 2 - r() * 22;
    const largura = 3 + r() * 4.5;
    const pontos: [number, number][] = [];
    for (let y = inicio; y <= fim; y += 22) {
      // leve curva do pincel e tremor das cerdas
      const centro = 34 + posicao * 52 + Math.sin(y / 70) * 6 + (r() - 0.5) * 2.2;
      pontos.push([centro, y]);
    }
    pontos.push([34 + posicao * 52 + Math.sin(fim / 70) * 6, fim]);
    const ida = pontos.map(([x, y]) => `${(x - largura / 2).toFixed(1)},${y.toFixed(1)}`);
    const volta = pontos
      .slice()
      .reverse()
      .map(([x, y]) => `${(x + largura / 2 + (r() - 0.5) * 1.5).toFixed(1)},${y.toFixed(1)}`);
    caminhos.push({ d: `M${ida.join(' L')} L${volta.join(' L')}Z`, opacidade: 0.72 + r() * 0.28 });
  }
  return caminhos;
}

/**
 * Pincelada seca de tinta (bordas do hero, do "Sobre" e da galeria):
 * faixa larga formada por cerdas de comprimentos irregulares, na cor atual.
 */
export function Pincelada({ className, style, semente = 7 }: Base & { semente?: number }) {
  return (
    <svg viewBox="0 0 120 400" preserveAspectRatio="none" className={cx('pointer-events-none', className)} style={style} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        {cerdas(semente).map((c, i) => (
          <path key={i} d={c.d} opacity={c.opacidade} />
        ))}
        <circle cx="96" cy="18" r="3" />
        <circle cx="22" cy="380" r="2.5" />
        <circle cx="88" cy="396" r="2" opacity="0.7" />
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

import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

export type TomRotulo = 'vinho' | 'laranja' | 'amarelo' | 'claro';

const tons: Record<TomRotulo, string> = {
  vinho: 'text-label-vinho',
  laranja: 'text-label-laranja',
  amarelo: 'text-accent',
  claro: 'text-white/80',
};

/** Rótulo em caixa-alta acima dos títulos ("NOSSOS PROJETOS"). */
export function Rotulo({ tom = 'vinho', children, className }: { tom?: TomRotulo; children: ReactNode; className?: string }) {
  return <p className={cx('font-heading text-eyebrow uppercase', tons[tom], className)}>{children}</p>;
}

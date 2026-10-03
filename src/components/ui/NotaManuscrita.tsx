import type { ReactNode } from 'react';
import { Coroa } from './Ornamentos';
import { cx } from '@/lib/cx';

type Props = {
  children: ReactNode;
  /** Sublinhado amarelo em pincel (hero) */
  sublinhado?: boolean;
  coroa?: boolean;
  className?: string;
};

/** Frase em letra cursiva, levemente inclinada ("Da nossa comunidade para o mundo."). */
export function NotaManuscrita({ children, sublinhado, coroa, className }: Props) {
  return (
    <p className={cx('relative inline-block -rotate-6 font-script text-2xl leading-tight font-semibold text-white', className)}>
      {children}
      {sublinhado && (
        <svg viewBox="0 0 200 14" className="absolute -bottom-2 left-0 h-3 w-[80%] text-accent" aria-hidden="true" focusable="false">
          <path d="M3 9c40-6 90-8 140-5 18 1 36 3 54 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
      {coroa && <Coroa className="absolute -right-10 -bottom-6 h-8 w-10 rotate-6 text-accent" />}
    </p>
  );
}

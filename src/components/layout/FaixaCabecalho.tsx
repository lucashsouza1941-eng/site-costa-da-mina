'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '@/lib/cx';

/** Faixa fixa do cabeçalho: ganha sombra e fundo opaco ao rolar a página. */
export function FaixaCabecalho({ children }: { children: ReactNode }) {
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    const atualizar = () => setRolado(window.scrollY > 8);
    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });
    return () => window.removeEventListener('scroll', atualizar);
  }, []);

  return (
    <header
      className={cx(
        'sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-200',
        rolado ? 'border-border bg-background/95 shadow-card backdrop-blur-md' : 'border-transparent bg-background/90 backdrop-blur-sm',
      )}
    >
      {children}
    </header>
  );
}

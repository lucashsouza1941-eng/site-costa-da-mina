'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ItemMenu } from '@/content/tipos';
import { cx } from '@/lib/cx';

/** A página atual recebe aria-current="page" (e o sublinhado amarelo). */
export function estaAtivo(href: string, caminho: string) {
  if (href.includes('#')) return false;
  if (href === '/') return caminho === '/';
  return caminho.startsWith(href);
}

export function NavPrincipal({ itens, className }: { itens: ItemMenu[]; className?: string }) {
  const caminho = usePathname() ?? '/';
  return (
    <ul className={cx('flex items-center', className)}>
      {itens.map((item) => {
        const ativo = estaAtivo(item.href, caminho);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={ativo ? 'page' : undefined}
              className={cx(
                'relative block py-2 font-heading font-semibold text-text transition-colors hover:text-primary',
                'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:rounded-pill after:bg-accent after:transition-transform after:duration-200',
                ativo ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
              )}
            >
              {item.rotulo}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

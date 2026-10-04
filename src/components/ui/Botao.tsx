// Botão do design system. Com `href` vira link (interno via next/link);
// sem `href`, é um <button>. Variantes seguem a imagem aprovada.
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Icone } from './Icone';
import { cx } from '@/lib/cx';

export type VarianteBotao = 'amarelo' | 'roxo' | 'contorno-claro' | 'contorno-amarelo' | 'link';
export type TamanhoBotao = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 font-heading font-bold leading-none whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60';

const variantes: Record<VarianteBotao, string> = {
  amarelo: 'rounded-pill bg-accent text-primary-deep hover:bg-accent-hover',
  roxo: 'rounded-pill bg-primary text-white hover:bg-primary-dark',
  'contorno-claro': 'rounded-pill border-2 border-white/90 text-white hover:bg-white hover:text-primary-deep',
  'contorno-amarelo': 'rounded-pill border-2 border-accent bg-transparent text-text hover:bg-accent hover:text-primary-deep',
  link: 'text-text underline-offset-4 hover:underline',
};

const tamanhos: Record<TamanhoBotao, string> = {
  md: 'min-h-12 px-6 text-[0.95rem]',
  sm: 'min-h-10 px-4 text-sm',
};

type Comum = {
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  seta?: boolean;
  children: ReactNode;
  className?: string;
};

type ComoLink = Comum & { href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>;
type ComoBotao = Comum & { href?: undefined } & Omit<ComponentProps<'button'>, 'className' | 'children'>;

export function Botao(props: ComoLink | ComoBotao) {
  const { variante = 'amarelo', tamanho = 'md', seta = false, children, className } = props;
  const classes = cx(base, variantes[variante], variante !== 'link' && tamanhos[tamanho], className);
  const conteudo = (
    <>
      {children}
      {seta && <Icone nome="seta" className="size-4 shrink-0" espessura={2.2} />}
    </>
  );

  if (props.href !== undefined) {
    const { href, variante: _v, tamanho: _t, seta: _s, children: _c, className: _cl, ...resto } = props;
    const externo = /^(https?:|mailto:|tel:)/.test(href);
    if (externo) {
      return (
        <a href={href} className={classes} {...resto} rel={resto.rel ?? 'noopener'}>
          {conteudo}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...resto}>
        {conteudo}
      </Link>
    );
  }

  const { variante: _v, tamanho: _t, seta: _s, children: _c, className: _cl, href: _h, ...resto } = props;
  return (
    <button type="button" className={classes} {...resto}>
      {conteudo}
    </button>
  );
}

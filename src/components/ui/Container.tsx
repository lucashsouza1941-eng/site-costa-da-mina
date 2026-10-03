import type { ComponentProps, ElementType } from 'react';
import { cx } from '@/lib/cx';

type Props<T extends ElementType> = { como?: T } & Omit<ComponentProps<T>, 'as'>;

/** Largura do conteúdo do design (1240px) com respiro lateral responsivo. */
export function Container<T extends ElementType = 'div'>({ como, className, ...resto }: Props<T>) {
  const Tag = (como ?? 'div') as ElementType;
  return <Tag className={cx('container-site', className)} {...resto} />;
}

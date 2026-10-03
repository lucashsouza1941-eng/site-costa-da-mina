import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';

/** Superfície clara dos cards (projetos, agenda, notícias, impacto). */
export function Card({ className, ...resto }: ComponentProps<'div'>) {
  return <div className={cx('rounded-card border border-border bg-surface shadow-card', className)} {...resto} />;
}

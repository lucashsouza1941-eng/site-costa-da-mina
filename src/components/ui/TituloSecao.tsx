import type { ReactNode } from 'react';
import { Rotulo, type TomRotulo } from './Rotulo';
import { cx } from '@/lib/cx';

type Props = {
  id?: string;
  rotulo: string;
  tomRotulo?: TomRotulo;
  titulo: ReactNode;
  descricao?: ReactNode;
  /** Link ou botão à direita do título (ex.: "Ver todos os projetos →") */
  acao?: ReactNode;
  claro?: boolean;
  nivel?: 'h1' | 'h2';
  className?: string;
};

/** Cabeçalho de seção: rótulo, título, descrição e ação opcional. */
export function TituloSecao({ id, rotulo, tomRotulo = 'vinho', titulo, descricao, acao, claro, nivel = 'h2', className }: Props) {
  const Titulo = nivel;
  return (
    <div className={cx('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        <Rotulo tom={tomRotulo}>{rotulo}</Rotulo>
        <Titulo id={id} className={cx('mt-1.5 text-section', claro ? 'text-white' : 'text-text')}>
          {titulo}
        </Titulo>
        {descricao && <div className={cx('mt-2 text-[0.95rem]', claro ? 'text-white/80' : 'text-muted')}>{descricao}</div>}
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  );
}

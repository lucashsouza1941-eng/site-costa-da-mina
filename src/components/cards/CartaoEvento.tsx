import type { CategoriaEvento, Evento } from '@/content/tipos';
import { dataCompleta, diaDoMes, mesAbreviado } from '@/lib/datas';
import { cx } from '@/lib/cx';

export const NOMES_CATEGORIA_EVENTO: Record<CategoriaEvento, string> = {
  oficina: 'Oficina',
  sarau: 'Cultura',
  acao: 'Ação',
  formacao: 'Formação',
  encontro: 'Encontro',
};

/** Card de evento da agenda: selo amarelo de data, título, descrição e etiquetas. */
export function CartaoEvento({ evento, className }: { evento: Evento; className?: string }) {
  return (
    <article className={cx('flex gap-4 rounded-card border border-border bg-white p-4 shadow-card', className)}>
      <p className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-[0.4rem] bg-accent font-heading leading-none text-primary-deep">
        <span className="sr-only">{dataCompleta(evento.data)}</span>
        <span aria-hidden="true" className="text-[1.35rem] font-extrabold">
          {diaDoMes(evento.data)}
        </span>
        <span aria-hidden="true" className="mt-0.5 text-[0.65rem] font-bold tracking-wider">
          {mesAbreviado(evento.data)}
        </span>
      </p>
      <div className="min-w-0">
        <h3 className="font-heading text-[0.95rem] leading-tight font-bold text-text">{evento.nome}</h3>
        <p className="mt-1 text-[0.8rem] leading-snug text-muted">{evento.descricao}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-muted">
          <span className="rounded-[0.3rem] bg-primary-soft px-2 py-0.5 font-semibold text-primary">{NOMES_CATEGORIA_EVENTO[evento.categoria]}</span>
          {evento.horario && <span>{evento.horario}</span>}
          <span>{evento.local}</span>
        </p>
      </div>
    </article>
  );
}

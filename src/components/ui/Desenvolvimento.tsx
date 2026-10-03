// Marcadores internos. Só existem em `next dev`: no build de produção não
// geram HTML (há teste que verifica). Servem para mostrar à equipe o que
// ainda falta confirmar, sem apresentar nada disso ao público como fato.
import type { ReactNode } from 'react';
import { buscarPendencia, type IdPendencia } from '@/content/pendencias';
import { cx } from '@/lib/cx';

const emDesenvolvimento = process.env.NODE_ENV !== 'production';

/** Caixa tracejada para conteúdo ainda inexistente (foto, logo, dado). */
export function Placeholder({ rotulo, className, children }: { rotulo: string; className?: string; children?: ReactNode }) {
  if (!emDesenvolvimento) return null;
  return (
    <div
      data-placeholder
      className={cx(
        'flex min-h-24 flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed border-label-vinho/50 bg-[repeating-linear-gradient(-45deg,#fff5f8,#fff5f8_10px,#fbeaf0_10px,#fbeaf0_20px)] p-3 text-center font-sans text-xs font-semibold text-label-vinho',
        className,
      )}
    >
      <span>Placeholder · {rotulo}</span>
      {children}
    </div>
  );
}

/** Aviso de informação não confirmada (lista em src/content/pendencias.ts). */
export function Pendente({ id }: { id: IdPendencia }) {
  if (!emDesenvolvimento) return null;
  const p = buscarPendencia(id);
  return (
    <aside data-pendente={p.id} className="my-3 rounded-card border-2 border-dashed border-red-700 bg-red-50 p-3 font-sans text-xs text-red-900 [overflow-wrap:anywhere]">
      <strong className="block">Pendente · {p.assunto}</strong>
      {p.situacao}
    </aside>
  );
}

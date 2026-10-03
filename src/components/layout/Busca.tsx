'use client';

import Link from 'next/link';
import { useId, useMemo, useRef, useState } from 'react';
import { Icone } from '@/components/ui/Icone';
import { cx } from '@/lib/cx';

export type ItemBusca = { titulo: string; descricao?: string; href: string; tipo: string };

const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Busca no conteúdo do site (índice montado no build; sem servidor). */
export function Busca({ indice, className }: { indice: ItemBusca[]; className?: string }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [termo, setTermo] = useState('');
  const id = useId();

  const resultados = useMemo(() => {
    const t = normalizar(termo.trim());
    if (!t) return [];
    return indice.filter((i) => normalizar(`${i.titulo} ${i.descricao ?? ''}`).includes(t)).slice(0, 8);
  }, [termo, indice]);

  const fechar = () => dialogo.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className={cx('grid size-11 place-items-center rounded-pill text-text transition-colors hover:bg-primary-soft', className)}
        aria-label="Buscar no site"
      >
        <Icone nome="busca" className="size-[1.35rem]" espessura={2} />
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby={`${id}-titulo`}
        onClose={() => setTermo('')}
        className="mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] rounded-panel bg-surface p-0 text-text shadow-raised backdrop:bg-primary-deep/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 border-b border-border p-4">
          <h2 id={`${id}-titulo`} className="sr-only">
            Buscar no site
          </h2>
          <Icone nome="busca" className="size-5 shrink-0 text-muted" />
          <label htmlFor={`${id}-campo`} className="sr-only">
            O que você procura?
          </label>
          <input
            id={`${id}-campo`}
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Projetos, agenda, apoio…"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent font-sans text-lg outline-none placeholder:text-muted"
          />
          <button type="button" onClick={fechar} className="grid size-10 place-items-center rounded-pill hover:bg-primary-soft" aria-label="Fechar busca">
            <Icone nome="fechar" className="size-5" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2" aria-live="polite">
          {termo.trim() && resultados.length === 0 && <p className="p-4 text-muted">Nada encontrado para “{termo}”.</p>}
          {resultados.length > 0 && (
            <ul>
              {resultados.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} onClick={fechar} className="block rounded-card p-3 hover:bg-primary-soft focus-visible:bg-primary-soft">
                    <span className="block font-heading text-xs font-bold tracking-wider text-label-vinho uppercase">{r.tipo}</span>
                    <span className="block font-heading font-bold">{r.titulo}</span>
                    {r.descricao && <span className="block text-sm text-muted">{r.descricao}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!termo.trim() && <p className="p-4 text-sm text-muted">Digite para buscar páginas e projetos do Instituto.</p>}
        </div>
      </dialog>
    </>
  );
}

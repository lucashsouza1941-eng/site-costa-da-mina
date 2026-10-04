'use client';

// Galeria com filtros, grade responsiva, carregamento preguiçoso (next/image)
// e lightbox em <dialog> nativo: setas do teclado navegam, Esc fecha e o
// foco volta para a foto que abriu.
import Image from 'next/image';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CategoriaGaleria, Imagem } from '@/content/tipos';
import { Icone } from '@/components/ui/Icone';
import { cx } from '@/lib/cx';

export type ItemDaGaleria = { id: string; imagem: Imagem; categoria: CategoriaGaleria };

export const NOMES_CATEGORIA_GALERIA: Record<CategoriaGaleria, string> = {
  'beco-da-mina': 'Beco da Mina',
  oficinas: 'Oficinas',
  territorio: 'Território',
  institucional: 'Institucional',
  eventos: 'Eventos',
};

type Props = { itens: ItemDaGaleria[]; filtros?: boolean; titulo?: string };

export function Galeria({ itens, filtros = true, titulo = 'Galeria' }: Props) {
  const [categoria, setCategoria] = useState<CategoriaGaleria | 'todas'>('todas');
  const [aberta, setAberta] = useState<number | null>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const origem = useRef<HTMLButtonElement | null>(null);
  const id = useId();

  const categorias = useMemo(() => [...new Set(itens.map((i) => i.categoria))], [itens]);
  const visiveis = useMemo(() => (categoria === 'todas' ? itens : itens.filter((i) => i.categoria === categoria)), [itens, categoria]);

  const abrir = (indice: number, botao: HTMLButtonElement) => {
    origem.current = botao;
    setAberta(indice);
    dialogo.current?.showModal();
  };
  const fechar = () => dialogo.current?.close();
  const mover = useCallback(
    (passo: number) => setAberta((atual) => (atual === null ? null : (atual + passo + visiveis.length) % visiveis.length)),
    [visiveis.length],
  );

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const teclas = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    const aoFechar = () => {
      setAberta(null);
      origem.current?.focus();
    };
    d.addEventListener('keydown', teclas);
    d.addEventListener('close', aoFechar);
    return () => {
      d.removeEventListener('keydown', teclas);
      d.removeEventListener('close', aoFechar);
    };
  }, [mover]);

  const atual = aberta !== null ? visiveis[aberta] : null;

  return (
    <div>
      {filtros && categorias.length > 1 && (
        <div role="group" aria-label="Filtrar fotos" className="mb-6 flex flex-wrap gap-2">
          {(['todas', ...categorias] as const).map((c) => {
            const ativo = categoria === c;
            const total = c === 'todas' ? itens.length : itens.filter((i) => i.categoria === c).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={ativo}
                onClick={() => setCategoria(c)}
                className={cx(
                  'min-h-10 rounded-pill border-2 px-4 font-heading text-sm font-bold transition-colors',
                  ativo ? 'border-primary bg-primary text-white' : 'border-border bg-white text-text hover:border-primary',
                )}
              >
                {c === 'todas' ? 'Todas' : NOMES_CATEGORIA_GALERIA[c]} <span className="font-normal opacity-75">({total})</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {visiveis.length} fotos{categoria !== 'todas' ? ` em ${NOMES_CATEGORIA_GALERIA[categoria]}` : ''}.
      </p>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4" role="list" aria-label={titulo}>
        {visiveis.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={(e) => abrir(i, e.currentTarget)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card bg-primary-dark"
              aria-label={`Ampliar foto: ${item.imagem.alt}`}
            >
              <Image
                src={item.imagem.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogo}
        aria-labelledby={`${id}-legenda`}
        className="m-auto h-dvh max-h-none w-full max-w-none bg-primary-deep/95 p-0 text-white backdrop:bg-black/70"
      >
        {atual && (
          <figure className="relative flex h-full flex-col items-center justify-center gap-3 px-4 py-16 sm:px-20">
            <div className="relative h-full max-h-[78vh] w-full max-w-5xl">
              <Image
                key={atual.id}
                src={atual.imagem.src}
                alt={atual.imagem.alt}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption id={`${id}-legenda`} className="max-w-3xl text-center text-sm text-white/85">
              {atual.imagem.alt}
              <span className="ml-2 text-white/60">
                ({(aberta ?? 0) + 1} de {visiveis.length})
              </span>
            </figcaption>
          </figure>
        )}
        <button
          type="button"
          onClick={fechar}
          className="absolute top-4 right-4 grid size-12 place-items-center rounded-pill border-2 border-white/70 hover:bg-white hover:text-primary-deep"
          aria-label="Fechar"
        >
          <Icone nome="fechar" className="size-6" espessura={2} />
        </button>
        {visiveis.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => mover(-1)}
              className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center rounded-pill bg-black/40 hover:bg-accent hover:text-primary-deep sm:left-5"
              aria-label="Foto anterior"
            >
              <Icone nome="anterior" className="size-6" espessura={2.2} />
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center rounded-pill bg-black/40 hover:bg-accent hover:text-primary-deep sm:right-5"
              aria-label="Próxima foto"
            >
              <Icone nome="proximo" className="size-6" espessura={2.2} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}

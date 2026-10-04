'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import type { ItemMenu } from '@/content/tipos';
import { Icone } from '@/components/ui/Icone';
import { Botao } from '@/components/ui/Botao';
import { estaAtivo } from './NavPrincipal';
import { cx } from '@/lib/cx';

type Props = {
  itens: ItemMenu[];
  logo: ReactNode;
  redes: { rotulo: string; href: string; icone: 'instagram' | 'whatsapp' | 'email' }[];
  busca: ReactNode;
  linkCursos?: boolean;
};

/** Menu do celular e tablet: <dialog> nativo (fecha com Esc e prende o foco). */
export function MenuCelular({ itens, logo, redes, busca, linkCursos = false }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);
  const caminho = usePathname() ?? '/';
  const id = useId();

  // fecha ao navegar
  useEffect(() => {
    dialogo.current?.close();
  }, [caminho]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          dialogo.current?.showModal();
          // foco no botão de fechar (o React não repassa autofocus ao <dialog>)
          fechar.current?.focus();
        }}
        className="grid size-11 place-items-center rounded-pill border-2 border-primary text-primary transition-colors hover:bg-primary hover:text-white"
        aria-label="Abrir menu"
        aria-haspopup="dialog"
      >
        <Icone nome="menu" className="size-6" espessura={2} />
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby={`${id}-titulo`}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-primary-deep p-0 text-white backdrop:bg-transparent"
      >
        <div className="flex min-h-full flex-col gap-8 px-[var(--gutter)] pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-4">
            <div className="h-11">{logo}</div>
            <button
              ref={fechar}
              type="button"
              onClick={() => dialogo.current?.close()}
              className="grid size-11 place-items-center rounded-pill border-2 border-white/80 hover:bg-white hover:text-primary-deep"
              aria-label="Fechar menu"
            >
              <Icone nome="fechar" className="size-6" espessura={2} />
            </button>
          </div>

          <h2 id={`${id}-titulo`} className="sr-only">
            Menu principal
          </h2>
          <nav aria-label="Principal (celular)">
            <ul className="grid gap-1">
              {itens.map((item) => {
                const ativo = estaAtivo(item.href, caminho);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => dialogo.current?.close()}
                      aria-current={ativo ? 'page' : undefined}
                      className={cx(
                        'block py-1.5 font-display text-[2.1rem] leading-tight font-extrabold uppercase',
                        ativo ? 'text-accent' : 'text-white hover:text-accent',
                      )}
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                );
              })}
              {linkCursos && (
                <li data-link-cursos hidden>
                  <Link href="/cursos/" onClick={() => dialogo.current?.close()} className="block py-1.5 font-display text-[2.1rem] leading-tight font-extrabold text-white uppercase hover:text-accent">
                    Cursos
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-auto grid gap-5">
            <div className="flex items-center gap-3">
              {busca}
              <span className="text-sm text-white/70">Buscar no site</span>
            </div>
            <Botao href="/apoie/" seta className="justify-self-start">
              Doe agora
            </Botao>
            <ul className="flex gap-3">
              {redes.map((r) => (
                <li key={r.href}>
                  <a href={r.href} className="grid size-11 place-items-center rounded-pill border border-white/30 hover:border-accent hover:text-accent" aria-label={r.rotulo}>
                    <Icone nome={r.icone} className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </dialog>
    </>
  );
}

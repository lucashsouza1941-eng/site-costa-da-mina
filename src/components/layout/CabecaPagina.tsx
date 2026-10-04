// Topo das páginas internas: faixa roxa com trilha (breadcrumb), rótulo,
// título e introdução; foto opcional à direita; borda ondulada embaixo.
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Imagem } from '@/content/tipos';
import { Rotulo } from '@/components/ui/Rotulo';
import { BordaOndulada, Pincelada } from '@/components/ui/Ornamentos';
import { jsonLd, trilhaDeNavegacao } from '@/lib/dados-estruturados';

type Props = {
  rotulo: string;
  titulo: ReactNode;
  children?: ReactNode;
  trilha?: { rotulo: string; href?: string }[];
  imagem?: Imagem;
};

export function CabecaPagina({ rotulo, titulo, children, trilha = [], imagem }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          trilhaDeNavegacao([
            { nome: 'Início', caminho: '/' },
            ...trilha.map((t) => ({ nome: t.rotulo, caminho: t.href })),
          ]),
        )}
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,var(--color-primary-deep)_20%,var(--color-primary-dark)_100%)]" />
      {imagem && (
        <div className="relative h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:h-auto lg:w-[46%]">
          <Image
            src={imagem.src}
            alt={imagem.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_40%)]"
            style={{ objectPosition: imagem.foco ?? '50% 40%' }}
          />
        </div>
      )}
      <Pincelada semente={13} className="pointer-events-none absolute top-[10%] -left-10 hidden h-[70%] w-24 rotate-[22deg] text-accent lg:block" />

      <div className="container-site relative pt-8 pb-16 lg:min-h-[19rem] lg:pt-10 lg:pb-20">
        <nav aria-label="Você está em" className="text-[0.8rem] text-white/75">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-accent hover:underline">
                Início
              </Link>
            </li>
            {trilha.map((t) => (
              <li key={t.rotulo} className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                {t.href ? (
                  <Link href={t.href} className="hover:text-accent hover:underline">
                    {t.rotulo}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {t.rotulo}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-6 max-w-[38rem] lg:pl-11">
          <Rotulo tom="amarelo">{rotulo}</Rotulo>
          <h1 className="mt-2 font-display text-[clamp(2.3rem,1.3rem+2.8vw,3.6rem)] leading-[1.03] font-extrabold uppercase">{titulo}</h1>
          {children && <div className="mt-4 max-w-[34rem] text-[1rem] leading-relaxed text-white/88">{children}</div>}
        </div>
      </div>
      <BordaOndulada className="absolute inset-x-0 -bottom-px h-5 text-background sm:h-7" />
    </section>
  );
}

/** Bloco de texto corrido com tipografia de leitura. */
export function Prosa({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[42rem] space-y-4 text-[1rem] leading-relaxed text-muted [&_strong]:text-text ${className}`}>{children}</div>;
}

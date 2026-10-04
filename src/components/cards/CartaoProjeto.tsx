import Image from 'next/image';
import Link from 'next/link';
import type { Projeto } from '@/content/tipos';
import { Icone } from '@/components/ui/Icone';
import { cx } from '@/lib/cx';

/** Card de projeto (design aprovado): foto no topo, título, resumo e "Saiba mais". */
export function CartaoProjeto({ projeto, nivel: Titulo = 'h3', className }: { projeto: Projeto; nivel?: 'h2' | 'h3'; className?: string }) {
  const capa = projeto.capa;
  return (
    <article
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-accent transition-transform duration-200 hover:-translate-y-1 focus-within:-translate-y-1',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-primary-dark">
        {capa && (
          <Image
            src={capa.src}
            alt=""
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            style={{ objectPosition: capa.foco ?? '50% 35%' }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-5">
        <Titulo className="font-heading text-[1.15rem] leading-tight font-bold text-text">
          {/* o card inteiro é clicável, mas só o título é o link */}
          <Link href={`/projetos/${projeto.slug}/`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {projeto.nome}
          </Link>
        </Titulo>
        <p className="text-sm leading-snug text-muted">{projeto.resumoCard}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-heading text-sm font-bold text-label-laranja" aria-hidden="true">
          Saiba mais <Icone nome="seta" className="size-4 transition-transform group-hover:translate-x-1" espessura={2.2} />
        </span>
      </div>
    </article>
  );
}

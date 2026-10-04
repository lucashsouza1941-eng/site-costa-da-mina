import Image from 'next/image';
import Link from 'next/link';
import type { CategoriaNoticia, Noticia } from '@/content/tipos';
import { dataPorExtenso } from '@/lib/datas';
import { Placeholder } from '@/components/ui/Desenvolvimento';
import { cx } from '@/lib/cx';

export const NOMES_CATEGORIA_NOTICIA: Record<CategoriaNoticia, string> = {
  cultura: 'Cultura',
  projetos: 'Projetos',
  eventos: 'Eventos',
  formacao: 'Formação',
  institucional: 'Institucional',
};

/** Card de notícia: foto com etiqueta roxa, título, resumo e data. */
export function CartaoNoticia({ noticia, nivel: Titulo = 'h3', className }: { noticia: Noticia; nivel?: 'h2' | 'h3'; className?: string }) {
  return (
    <article className={cx('group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-accent', className)}>
      <div className="relative aspect-[16/7] overflow-hidden bg-primary-dark">
        {noticia.imagem ? (
          <Image src={noticia.imagem.src} alt="" fill sizes="(min-width: 1024px) 400px, 92vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        ) : (
          <Placeholder rotulo="foto da notícia" className="h-full rounded-none border-0" />
        )}
        <span className="absolute bottom-2 left-3 rounded-[0.35rem] bg-primary px-2 py-0.5 font-heading text-[0.7rem] font-bold text-white">
          {NOMES_CATEGORIA_NOTICIA[noticia.categoria]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
        <Titulo className="font-heading text-[1.02rem] leading-tight font-bold text-text">
          <Link href={`/noticias/${noticia.slug}/`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {noticia.titulo}
          </Link>
        </Titulo>
        <p className="text-[0.84rem] leading-snug text-muted">{noticia.resumo}</p>
        <p className="mt-auto pt-1 text-[0.72rem] text-muted">
          <time dateTime={noticia.data}>{dataPorExtenso(noticia.data)}</time>
        </p>
      </div>
    </article>
  );
}

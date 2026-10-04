import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CabecaPagina, Prosa } from '@/components/layout/CabecaPagina';
import { NOMES_CATEGORIA_NOTICIA } from '@/components/cards/CartaoNoticia';
import { Botao } from '@/components/ui/Botao';
import { buscarNoticia, listarNoticias } from '@/lib/conteudo';
import { dataCompleta } from '@/lib/datas';
import { metadados } from '@/lib/seo';
import { indexavel, urlAbsoluta } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

// Com `output: export`, uma rota dinâmica precisa gerar ao menos uma página.
// Enquanto não houver notícias publicadas, gera só "em-breve" (sem link no
// site, fora do sitemap), que leva o visitante de volta à lista.
const SEM_NOTICIAS = 'em-breve';

export const dynamicParams = false;
export function generateStaticParams() {
  const slugs = listarNoticias().map((n) => ({ slug: n.slug }));
  return slugs.length > 0 ? slugs : [{ slug: SEM_NOTICIAS }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const n = buscarNoticia(slug);
  // página técnica "em-breve": nunca indexada; segue a regra do site para links
  if (!n) return { title: 'Notícias em breve', robots: { index: false, follow: indexavel } };
  return {
    ...metadados({ titulo: n.titulo, descricao: n.resumo, caminho: `/noticias/${n.slug}/`, imagem: n.imagem?.src }),
    openGraph: { type: 'article', title: n.titulo, description: n.resumo, publishedTime: n.data, url: urlAbsoluta(`/noticias/${n.slug}/`) },
  };
}

export default async function PaginaNoticia({ params }: Params) {
  const { slug } = await params;
  const noticia = buscarNoticia(slug);

  if (!noticia) {
    if (slug !== SEM_NOTICIAS) notFound();
    return (
      <main id="conteudo">
        <CabecaPagina rotulo="Notícias" titulo="Notícias em breve." trilha={[{ rotulo: 'Notícias', href: '/noticias/' }, { rotulo: 'Em breve' }]} />
        <section className="section-y-sm">
          <div className="container-site">
            <Botao href="/noticias/" variante="roxo" seta>
              Ver as notícias
            </Botao>
          </div>
        </section>
      </main>
    );
  }

  const dadosEstruturados = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.resumo,
    datePublished: noticia.data,
    publisher: { '@type': 'Organization', name: 'Instituto Costa da Mina' },
  };

  return (
    <main id="conteudo">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }} />
      <CabecaPagina
        rotulo={NOMES_CATEGORIA_NOTICIA[noticia.categoria]}
        titulo={noticia.titulo}
        trilha={[{ rotulo: 'Notícias', href: '/noticias/' }, { rotulo: noticia.titulo }]}
      >
        <p>
          <time dateTime={noticia.data}>{dataCompleta(noticia.data)}</time>
        </p>
      </CabecaPagina>
      <article className="section-y-sm">
        <div className="container-site">
          {noticia.imagem && (
            <div className="relative mb-8 aspect-[16/8] overflow-hidden rounded-card">
              <Image src={noticia.imagem.src} alt={noticia.imagem.alt} fill sizes="(min-width: 1280px) 1240px, 100vw" className="object-cover" />
            </div>
          )}
          <Prosa>
            <p className="text-[1.1rem] text-text">{noticia.resumo}</p>
            {noticia.corpo.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Prosa>
          <Botao href="/noticias/" variante="link" seta className="mt-8">
            Todas as notícias
          </Botao>
        </div>
      </article>
    </main>
  );
}

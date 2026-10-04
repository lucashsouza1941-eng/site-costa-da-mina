import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CabecaPagina, Prosa } from '@/components/layout/CabecaPagina';
import { CartaoProjeto } from '@/components/cards/CartaoProjeto';
import { CartaoEvento } from '@/components/cards/CartaoEvento';
import { Galeria } from '@/components/galeria/Galeria';
import { Botao } from '@/components/ui/Botao';
import { Rotulo } from '@/components/ui/Rotulo';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { Coroa } from '@/components/ui/Ornamentos';
import type { IdPendencia } from '@/content/pendencias';
import type { SlugProjeto } from '@/content/tipos';
import { linkWhatsApp } from '@/content/instituto';
import { video } from '@/content/acervo';
import { buscarProjeto, listarEventos, listarProjetos } from '@/lib/conteudo';
import { metadados } from '@/lib/seo';
import { arquivo } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => listarProjetos().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = buscarProjeto((await params).slug);
  if (!p) return {};
  return metadados({ titulo: p.nome, descricao: `${p.chamada} ${p.resumoCard}`, caminho: `/projetos/${p.slug}/`, imagem: p.capa?.src });
}

const pendenciasDoProjeto: Record<SlugProjeto, IdPendencia[]> = {
  'beco-da-mina': ['imprensa', 'fotos-alta-resolucao'],
  'trancando-o-futuro': ['trancando-nome', 'trancando-agenda'],
  'tranca-amiga': ['tranca-amiga-como-participar'],
  'sarau-trancado': ['sarau-descricao', 'textos-design'],
};

export default async function PaginaProjeto({ params }: Params) {
  const projeto = buscarProjeto((await params).slug);
  if (!projeto) notFound();

  const eventos = listarEventos({ projeto: projeto.slug });
  const outros = listarProjetos().filter((p) => p.slug !== projeto.slug);
  const fotos = projeto.fotos.map((f, i) => ({ id: `${projeto.slug}-${i}`, imagem: f, categoria: 'institucional' as const }));
  const videoOficina = projeto.slug === 'trancando-o-futuro' ? video('trancando-oficina-video') : null;

  return (
    <main id="conteudo">
      <CabecaPagina
        rotulo="Projeto"
        titulo={projeto.nome}
        trilha={[{ rotulo: 'Projetos', href: '/projetos/' }, { rotulo: projeto.nome }]}
        imagem={projeto.capa}
      >
        <p className="font-heading text-[1.2rem] font-medium">{projeto.chamada}</p>
      </CabecaPagina>

      <section className="section-y-sm" aria-labelledby="titulo-sobre-projeto">
        <div className="container-site grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div>
            <h2 id="titulo-sobre-projeto" className="sr-only">
              Sobre o projeto
            </h2>
            <Prosa>
              {projeto.paragrafos.map((p, i) => (
                <p key={i} className={i === 0 ? 'text-[1.1rem] text-text' : undefined}>
                  {p}
                </p>
              ))}
            </Prosa>
            {pendenciasDoProjeto[projeto.slug].map((id) => (
              <Pendente key={id} id={id} />
            ))}
          </div>

          <aside aria-label="Ficha do projeto" className="h-fit rounded-card border-2 border-accent bg-surface p-6 lg:sticky lg:top-28">
            {projeto.marca && (
              <div className="mb-5 overflow-hidden rounded-card bg-primary-dark">
                <Image
                  src={projeto.marca.src}
                  alt={projeto.marca.alt}
                  width={projeto.marca.largura}
                  height={projeto.marca.altura}
                  sizes="320px"
                  className="mx-auto max-h-56 w-auto object-contain"
                />
              </div>
            )}
            <dl className="grid gap-3">
              {projeto.fichas.map((f) => (
                <div key={f.rotulo}>
                  <dt className="font-heading text-xs font-bold tracking-wider text-label-laranja uppercase">{f.rotulo}</dt>
                  <dd className="font-heading font-semibold text-text">{f.valor}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 grid gap-3">
              <Botao href={linkWhatsApp(`Olá! Quero saber mais sobre o projeto ${projeto.nome}.`)} variante="roxo" seta>
                Falar no WhatsApp
              </Botao>
              {projeto.links?.map((l) => (
                <Botao key={l.url} href={l.url} variante="contorno-amarelo">
                  {l.rotulo}
                </Botao>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {projeto.citacao && (
        <section aria-label="Depoimento" className="relative overflow-hidden bg-primary-dark py-14 text-white">
          <figure className="container-site">
            <blockquote className="max-w-[40ch] font-heading text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] leading-snug font-semibold">
              “{projeto.citacao.texto}”
            </blockquote>
            <figcaption className="mt-5 border-l-4 border-accent pl-4">
              <strong className="block">{projeto.citacao.autoria}</strong>
              <span className="text-sm text-white/75">{projeto.citacao.papel}</span>
            </figcaption>
          </figure>
          <Coroa className="absolute right-[8%] bottom-10 hidden h-16 w-20 text-accent md:block" />
        </section>
      )}

      {(fotos.length > 0 || videoOficina) && (
        <section className="section-y-sm" aria-labelledby="titulo-registros">
          <div className="container-site">
            <Rotulo tom="laranja">Registros</Rotulo>
            <h2 id="titulo-registros" className="mt-1.5 mb-6 text-section">
              Imagens do projeto
            </h2>
            <div className={videoOficina ? 'grid gap-6 lg:grid-cols-[18rem_1fr]' : ''}>
              {videoOficina && (
                <figure>
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster={arquivo(`_img/projetos/trancando-o-futuro/video-capa-640.webp`)}
                    className="aspect-[9/16] w-full rounded-card bg-primary-dark object-cover"
                    aria-label={videoOficina.descricao}
                  >
                    <source src={arquivo(videoOficina.src)} type="video/mp4" />
                  </video>
                  <figcaption className="mt-2 text-sm text-muted">{videoOficina.descricao}</figcaption>
                </figure>
              )}
              {fotos.length > 0 && <Galeria itens={fotos} filtros={false} titulo={`Fotos do ${projeto.nome}`} />}
            </div>
          </div>
        </section>
      )}

      {eventos.length > 0 && (
        <section className="section-y-sm pt-0" aria-labelledby="titulo-eventos-projeto">
          <div className="container-site">
            <h2 id="titulo-eventos-projeto" className="mb-5 text-section">
              Próximos encontros
            </h2>
            <ul className="grid gap-4 md:grid-cols-3" role="list">
              {eventos.map((e) => (
                <li key={e.id} className="grid">
                  <CartaoEvento evento={e} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section-y-sm bg-surface" aria-labelledby="titulo-outros">
        <div className="container-site">
          <Rotulo>Outros projetos</Rotulo>
          <h2 id="titulo-outros" className="mt-1.5 mb-6 text-section">
            Continue conhecendo.
          </h2>
          <ul className="grid gap-5 sm:grid-cols-3" role="list">
            {outros.map((p) => (
              <li key={p.slug} className="grid">
                <CartaoProjeto projeto={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

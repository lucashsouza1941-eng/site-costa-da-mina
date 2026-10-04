import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { CartaoNoticia } from '@/components/cards/CartaoNoticia';
import { Botao } from '@/components/ui/Botao';
import { instituto } from '@/content/instituto';
import { imagem } from '@/content/acervo';
import { listarNoticias } from '@/lib/conteudo';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Notícias',
  descricao: 'Ações, histórias e novidades do Instituto Costa da Mina.',
  caminho: '/noticias/',
});

export default function PaginaNoticias() {
  const noticias = listarNoticias();
  return (
    <main id="conteudo">
      <CabecaPagina rotulo="Últimas notícias" titulo="Acompanhe nossas ações, histórias e novidades." trilha={[{ rotulo: 'Notícias' }]} imagem={imagem('beco-artistas')} />
      <section className="section-y-sm" aria-label="Notícias">
        <div className="container-site">
          {noticias.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" role="list">
              {noticias.map((n) => (
                <li key={n.slug} className="grid">
                  <CartaoNoticia noticia={n} nivel="h2" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-card border border-dashed border-border bg-white/60 p-6 sm:flex-row sm:items-center">
              <p className="text-muted">As primeiras notícias do novo site serão publicadas em breve. Enquanto isso, as novidades estão no Instagram.</p>
              <Botao href={instituto.redes.instagram.url} variante="roxo" tamanho="sm" className="sm:ml-auto">
                @{instituto.redes.instagram.usuario}
              </Botao>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

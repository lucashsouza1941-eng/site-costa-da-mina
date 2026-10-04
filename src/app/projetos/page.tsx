import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { CartaoProjeto } from '@/components/cards/CartaoProjeto';
import { listarProjetos } from '@/lib/conteudo';
import { imagem } from '@/content/acervo';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Projetos',
  descricao: 'Beco da Mina, Trançando o Futuro, Trança Amiga e Sarau Trançado: os projetos do Instituto Costa da Mina.',
  caminho: '/projetos/',
});

export default function PaginaProjetos() {
  return (
    <main id="conteudo">
      <CabecaPagina
        rotulo="Nossos projetos"
        titulo="Iniciativas que transformam pessoas e territórios."
        trilha={[{ rotulo: 'Projetos' }]}
        imagem={imagem('beco-mural-trancistas')}
      >
        <p>Ações construídas da comunidade para a comunidade, baseadas em solidariedade, troca de saberes e valorização das raízes culturais.</p>
      </CabecaPagina>
      <section className="section-y-sm" aria-label="Lista de projetos">
        <div className="container-site">
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" role="list">
            {listarProjetos().map((p) => (
              <li key={p.slug} className="grid">
                <CartaoProjeto projeto={p} nivel="h2" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

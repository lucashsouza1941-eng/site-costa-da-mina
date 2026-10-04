import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { Galeria } from '@/components/galeria/Galeria';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { Botao } from '@/components/ui/Botao';
import { instituto } from '@/content/instituto';
import { listarGaleria } from '@/lib/conteudo';
import { imagem } from '@/content/acervo';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Galeria',
  descricao: 'Fotos dos murais do Beco da Mina, das oficinas de tranças e do território da Cidade Ademar.',
  caminho: '/galeria/',
});

export default function PaginaGaleria() {
  const itens = listarGaleria();
  return (
    <main id="conteudo">
      <CabecaPagina rotulo="Galeria" titulo="Nossa comunidade em ação." trilha={[{ rotulo: 'Galeria' }]} imagem={imagem('beco-mural-rosto')}>
        <p>Momentos que mostram a força, a beleza e a transformação do nosso território.</p>
      </CabecaPagina>
      <section className="section-y-sm" aria-label="Fotos">
        <div className="container-site">
          <Galeria itens={itens} titulo="Fotos do Instituto" />
          <Pendente id="fotos-alta-resolucao" />
          <div className="mt-10 flex flex-col items-start gap-3 rounded-card border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">Mais registros das ações do Instituto estão no Instagram.</p>
            <Botao href={instituto.redes.instagram.url} variante="roxo" tamanho="sm">
              @{instituto.redes.instagram.usuario}
            </Botao>
          </div>
        </div>
      </section>
    </main>
  );
}

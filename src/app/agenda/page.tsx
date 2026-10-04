import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { CartaoEvento } from '@/components/cards/CartaoEvento';
import { Botao } from '@/components/ui/Botao';
import { Icone } from '@/components/ui/Icone';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { instituto } from '@/content/instituto';
import { imagem } from '@/content/acervo';
import { listarEventos } from '@/lib/conteudo';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Agenda',
  descricao: 'Oficinas, encontros, saraus e formações do Instituto Costa da Mina.',
  caminho: '/agenda/',
});

export default function PaginaAgenda() {
  const eventos = listarEventos();
  return (
    <main id="conteudo">
      <CabecaPagina rotulo="Agenda e eventos" titulo="Participe da nossa jornada." trilha={[{ rotulo: 'Agenda' }]} imagem={imagem('trancando-oficina-3')}>
        <p>Oficinas, encontros, saraus, formações e muito mais.</p>
      </CabecaPagina>
      <section className="section-y-sm" aria-labelledby="titulo-proximos">
        <div className="container-site">
          <h2 id="titulo-proximos" className="mb-6 text-section">
            Próximos eventos
          </h2>
          {eventos.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="list">
              {eventos.map((e) => (
                <li key={e.id} className="grid">
                  <CartaoEvento evento={e} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-card border border-dashed border-border bg-white/60 p-6 sm:flex-row sm:items-center">
              <Icone nome="calendario" className="size-10 shrink-0 text-accent" />
              <p className="text-muted">
                Nenhum evento agendado no momento. As próximas oficinas, saraus e ações são divulgados no Instagram do Instituto.
              </p>
              <Botao href={instituto.redes.instagram.url} variante="roxo" tamanho="sm" className="sm:ml-auto">
                @{instituto.redes.instagram.usuario}
              </Botao>
            </div>
          )}
          <Pendente id="trancando-agenda" />
        </div>
      </section>
    </main>
  );
}

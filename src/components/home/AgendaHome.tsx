// "Agenda e eventos": título e botão à esquerda, próximos eventos à direita.
// Sem eventos confirmados, mostra um aviso honesto (nunca eventos fictícios).
import { instituto } from '@/content/instituto';
import { listarEventos } from '@/lib/conteudo';
import { CartaoEvento } from '@/components/cards/CartaoEvento';
import { Botao } from '@/components/ui/Botao';
import { Rotulo } from '@/components/ui/Rotulo';
import { Icone } from '@/components/ui/Icone';

export function AgendaHome() {
  const eventos = listarEventos().slice(0, 3);

  return (
    <section id="agenda" aria-labelledby="titulo-agenda" className="bg-background pb-[var(--section-y-sm)]">
      <div className="container-site grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-center">
        <div>
          <Rotulo tom="laranja">Agenda e eventos</Rotulo>
          <h2 id="titulo-agenda" className="mt-1.5 text-section text-text">
            Participe da nossa jornada.
          </h2>
          <p className="mt-1.5 text-[0.88rem] text-muted">Oficinas, encontros, saraus, formações e muito mais.</p>
          <Botao href="/agenda/" seta tamanho="sm" className="mt-4">
            Ver toda a agenda
          </Botao>
        </div>

        {eventos.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-3" role="list">
            {eventos.map((e) => (
              <li key={e.id} className="grid">
                <CartaoEvento evento={e} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-4 rounded-card border border-dashed border-border bg-white/60 p-5">
            <Icone nome="calendario" className="size-9 shrink-0 text-accent" />
            <p className="text-[0.9rem] text-muted">
              Nenhum evento agendado no momento. As próximas oficinas e saraus são divulgados no Instagram{' '}
              <a href={instituto.redes.instagram.url} className="font-semibold text-primary underline underline-offset-2">
                @{instituto.redes.instagram.usuario}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

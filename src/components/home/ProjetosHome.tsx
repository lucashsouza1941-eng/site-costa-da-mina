import { listarProjetos } from '@/lib/conteudo';
import { CartaoProjeto } from '@/components/cards/CartaoProjeto';
import { TituloSecao } from '@/components/ui/TituloSecao';
import { Botao } from '@/components/ui/Botao';

/** "Nossos projetos": quatro cards em linha (dois no tablet, um no celular). */
export function ProjetosHome() {
  return (
    <section id="projetos" aria-labelledby="titulo-projetos" className="section-y-sm bg-background pt-4">
      <div className="container-site">
        <TituloSecao
          id="titulo-projetos"
          rotulo="Nossos projetos"
          titulo="Iniciativas que transformam pessoas e territórios."
          acao={
            <Botao href="/projetos/" variante="link" seta className="text-sm">
              Ver todos os projetos
            </Botao>
          }
        />
        {/* celular: fileira deslizante com encaixe; tablet: 2 colunas; desktop: 4 */}
        <ul
          className="-mx-[var(--gutter)] mt-6 grid snap-x snap-mandatory auto-cols-[80%] grid-flow-col gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-3 sm:mx-0 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4"
          role="list"
          aria-label="Projetos (deslize para ver todos)"
        >
          {listarProjetos().map((p) => (
            <li key={p.slug} className="grid snap-start">
              <CartaoProjeto projeto={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

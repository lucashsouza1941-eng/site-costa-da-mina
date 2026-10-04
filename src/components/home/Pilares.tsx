import { pilares } from '@/content/home';
import { Icone } from '@/components/ui/Icone';

/** Faixa creme com os cinco pilares, separados por divisórias finas. */
export function Pilares() {
  return (
    <section aria-label="Pilares de atuação" className="bg-background">
      <div className="container-site">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0 lg:py-7">
          {pilares.map((p, i) => (
            <li
              key={p.titulo}
              className={`flex flex-col items-center px-3 text-center lg:border-l lg:border-border lg:first:border-l-0 ${
                i === pilares.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <Icone nome={p.icone} className="size-12 text-primary" espessura={1.5} />
              <h2 className="mt-3 font-heading text-[0.95rem] leading-tight font-bold text-text">{p.titulo}</h2>
              <p className="mt-1.5 max-w-[17rem] text-[0.8rem] leading-snug text-muted">{p.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

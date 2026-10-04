// "Nosso impacto": qualitativo por padrão. Indicadores numéricos só
// aparecem quando houver dados com fonte e data (listarIndicadores()).
import Image from 'next/image';
import { impactoQualitativo } from '@/content/home';
import { imagem } from '@/content/acervo';
import { listarIndicadores } from '@/lib/conteudo';
import { Botao } from '@/components/ui/Botao';
import { Icone } from '@/components/ui/Icone';
import { TituloSecao } from '@/components/ui/TituloSecao';

export function Impacto() {
  const foto = imagem('trancando-oficina-2');
  const indicadores = listarIndicadores();

  return (
    <section id="impacto" aria-labelledby="titulo-impacto" className="relative isolate overflow-hidden bg-background section-y-sm">
      {/* foto sangrando na borda direita (desktop) */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[24%] xl:block">
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          sizes="24vw"
          className="object-cover object-[50%_30%] [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        />
      </div>

      <div className="container-site">
        <div className="xl:pr-[22%]">
          <TituloSecao
            id="titulo-impacto"
            rotulo="Nosso impacto"
            tomRotulo="laranja"
            titulo="Pessoas, cultura e território em movimento."
            descricao="Cada projeto é uma semente para um futuro com mais oportunidades."
            acao={
              <Botao href="/instituto/" variante="contorno-amarelo" tamanho="sm" seta>
                Saiba mais sobre nosso impacto
              </Botao>
            }
          />

          {indicadores.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {indicadores.map((i) => (
                <div key={i.rotulo} className="rounded-card bg-white p-4 text-center shadow-card">
                  <dt className="text-sm text-muted">{i.rotulo}</dt>
                  <dd className="font-display text-4xl font-extrabold text-primary">{i.valor}</dd>
                  <dd className="text-[0.7rem] text-muted">
                    Fonte: {i.fonte} ({i.referencia})
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" role="list">
            {impactoQualitativo.map((item) => (
              <li key={item.titulo} className="flex flex-col items-center rounded-card bg-[#fbf0dc]/70 px-3 py-5 text-center">
                <Icone nome={item.icone} className="size-10 text-accent" espessura={1.7} />
                <h3 className="mt-2 font-heading text-[1rem] font-bold text-text">{item.titulo}</h3>
                <p className="mt-1 max-w-[14rem] text-[0.78rem] leading-snug text-muted">{item.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

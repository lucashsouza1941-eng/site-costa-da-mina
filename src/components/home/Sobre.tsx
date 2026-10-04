// "Sobre o Instituto": foto grande à esquerda (sangrando até a borda) com
// nota manuscrita; texto, botão e quatro marcadores à direita.
import Image from 'next/image';
import { imagem } from '@/content/acervo';
import { Botao } from '@/components/ui/Botao';
import { Icone, type NomeIcone } from '@/components/ui/Icone';
import { Rotulo } from '@/components/ui/Rotulo';
import { Coroa, Pincelada } from '@/components/ui/Ornamentos';

const marcadores: { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: 'territorio', titulo: 'Território', texto: 'Cidade Ademar – SP' },
  { icone: 'projetos', titulo: 'Projetos', texto: 'Em desenvolvimento' },
  { icone: 'comunidade', titulo: 'Comunidade', texto: 'Em movimento' },
  { icone: 'cultura', titulo: 'Cultura', texto: 'Que transforma' },
];

export function Sobre() {
  const foto = imagem('casa-de-cultura');
  return (
    <section id="instituto" aria-labelledby="titulo-sobre" className="relative isolate overflow-hidden bg-background">
      <Pincelada semente={41} className="absolute -top-6 -right-6 hidden h-64 w-24 -rotate-[28deg] text-accent/80 lg:block" />
      <div className="grid lg:grid-cols-[52%_1fr] lg:items-center">
        <div className="relative h-72 sm:h-[26rem] lg:h-[28rem] lg:overflow-hidden lg:rounded-r-card">
          <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover object-[35%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/45 via-transparent to-transparent lg:bg-gradient-to-l lg:from-primary-deep/35" />
          <p className="absolute right-[5%] bottom-[10%] max-w-[13ch] -rotate-[9deg] text-right font-script text-[1.55rem] leading-[1.05] font-semibold text-white drop-shadow-[0_2px_8px_rgb(0_0_0/0.7)] sm:text-[1.8rem]">
            Mais que um Instituto. Um movimento.
          </p>
          <Coroa className="absolute right-[24%] bottom-[30%] h-9 w-11 -rotate-12 text-accent drop-shadow" />
        </div>

        <div className="container-site py-10 lg:mx-0 lg:max-w-none lg:py-8 lg:pr-[max(var(--gutter),calc((100vw-var(--container-site))/2))] lg:pl-12">
          <Rotulo tom="laranja">Sobre o Instituto</Rotulo>
          <h2 id="titulo-sobre" className="mt-1.5 text-[clamp(1.75rem,1rem+1.6vw,2.4rem)] leading-[1.1] text-text">
            Da nossa comunidade para um futuro mais justo.
          </h2>
          <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-relaxed text-muted">
            O Instituto Costa da Mina nasceu da força da nossa gente, das tranças, da arte e da vontade de transformar realidades.
            Atuamos na Cidade Ademar promovendo cultura, educação, arte e oportunidades, fortalecendo o território e construindo um
            futuro com mais dignidade e pertencimento.
          </p>
          <Botao href="/instituto/" variante="roxo" seta className="mt-6">
            Nossa história
          </Botao>
          <ul className="mt-8 grid grid-cols-2 gap-y-5 border-t border-border pt-6 sm:grid-cols-4" role="list">
            {marcadores.map((m, i) => (
              <li key={m.titulo} className={`flex flex-col items-center px-2 text-center ${i > 0 ? 'sm:border-l sm:border-border' : ''}`}>
                <Icone nome={m.icone} className="size-7 text-primary" espessura={1.6} />
                <span className="mt-2 font-heading text-[0.8rem] font-bold text-text">{m.titulo}</span>
                <span className="text-[0.72rem] text-muted">{m.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

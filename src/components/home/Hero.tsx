// Hero da página inicial (design aprovado).
// Desktop: foto à direita com fusão para o roxo, texto à esquerda,
// pinceladas na borda e nota manuscrita. Celular: foto no topo, texto abaixo.
// A foto é a melhor imagem oficial disponível hoje; quando chegar uma foto
// horizontal grande do Instituto, basta trocar o id em `fotoHero`.
import Image from 'next/image';
import { hero } from '@/content/home';
import { imagem, type IdImagem } from '@/content/acervo';
import { Botao } from '@/components/ui/Botao';
import { BordaOndulada, Coroa, Pincelada } from '@/components/ui/Ornamentos';

const fotoHero: IdImagem = 'trancando-oficina';
const fundoHero: IdImagem = 'ilustracao-brasil-africa';

export function Hero() {
  const foto = imagem(fotoHero);
  const fundo = imagem(fundoHero);

  return (
    <section aria-labelledby="hero-titulo" className="relative isolate overflow-hidden bg-primary-deep text-white">
      {/* fundo: ilustração institucional Brasil–África, escurecida */}
      <Image src={fundo.src} alt="" fill sizes="100vw" loading="eager" className="-z-20 object-cover opacity-35 mix-blend-luminosity" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,var(--color-primary-deep)_10%,rgb(46_17_60/0.88)_45%,rgb(46_17_60/0.55)_100%)]" />

      {/* foto: topo no celular, metade direita no desktop */}
      <div className="relative h-72 w-full sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:-z-10 lg:h-auto lg:w-[56%]">
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          // maior elemento da primeira dobra (LCP)
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover object-[50%_32%] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_38%)]"
        />
        {/* nota manuscrita sobre a foto */}
        <div className="absolute right-[7%] bottom-[16%] hidden md:block">
          <Coroa className="absolute -top-7 -left-9 h-8 w-10 -rotate-12 text-accent" />
          <p className="max-w-[11ch] -rotate-[10deg] font-script text-[1.65rem] leading-[1.05] font-semibold text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)] xl:text-[1.9rem]">
            {hero.nota}
          </p>
          <svg viewBox="0 0 160 16" className="mt-1 ml-6 h-3 w-32 -rotate-[8deg] text-accent" aria-hidden="true" focusable="false">
            <path d="M3 11c30-6 70-9 110-6 14 1 28 3 44 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* pinceladas amarelas na borda esquerda */}
      <Pincelada className="pointer-events-none absolute top-[6%] -left-12 hidden h-[64%] w-36 rotate-[22deg] text-accent lg:block" />
      <Pincelada semente={23} className="pointer-events-none absolute bottom-[4%] -left-12 hidden h-[38%] w-24 rotate-[38deg] text-accent/90 lg:block" />

      <div className="container-site relative pt-6 pb-16 lg:flex lg:min-h-[clamp(27rem,31vw,34rem)] lg:items-center lg:pt-6 lg:pb-14">
        <div className="max-w-[34rem] lg:pl-11">
          <p className="font-heading text-[0.9rem] leading-snug font-semibold tracking-[0.06em] text-accent uppercase sm:text-[1.05rem]">
            {hero.frase.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </p>
          <h1 id="hero-titulo" className="mt-4 font-display text-hero font-extrabold uppercase">
            {hero.titulo.map((linha, i) => (
              <span key={linha} className={i === hero.titulo.length - 1 ? 'block text-accent' : 'block'}>
                {linha}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[30rem] text-[0.95rem] leading-relaxed text-white/90 lg:text-base">{hero.texto}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Botao href="/instituto/" seta>
              Conheça o Instituto
            </Botao>
            <Botao href="/apoie/" variante="contorno-claro">
              Apoie essa causa
            </Botao>
          </div>
        </div>
      </div>

      <BordaOndulada className="absolute inset-x-0 -bottom-px h-5 text-background sm:h-7" />
    </section>
  );
}

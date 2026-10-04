// "Apoie o Instituto": grande faixa roxa (design aprovado).
// A chave PIX só aparece quando `instituto.pixValidado` for true.
import Image from 'next/image';
import { imagem } from '@/content/acervo';
import { instituto, linkWhatsApp } from '@/content/instituto';
import { Botao } from '@/components/ui/Botao';
import { Icone } from '@/components/ui/Icone';
import { Rotulo } from '@/components/ui/Rotulo';
import { Coroa } from '@/components/ui/Ornamentos';
import { Pendente } from '@/components/ui/Desenvolvimento';

export function Apoie() {
  const foto = imagem('trancando-oficina-3');
  const cadeira = imagem('simbolo-branco');

  return (
    <section id="apoie" aria-labelledby="titulo-apoie" className="relative isolate overflow-hidden bg-primary-dark text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_20rem_at_30%_50%,rgb(95_38_125/0.55),transparent_70%)]" />
      {/* foto de mãos trançando, sangrando à esquerda */}
      <div className="absolute inset-y-0 left-0 -z-10 hidden w-[16%] lg:block">
        <Image src={foto.src} alt="" fill sizes="16vw" className="object-cover [mask-image:linear-gradient(to_right,black_45%,transparent)]" />
      </div>

      <div className="grid items-center gap-8 px-[var(--gutter)] py-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)_auto] lg:gap-8 lg:py-8 lg:pr-[max(var(--gutter),calc((100vw-var(--container-site))/2-3rem))] lg:pl-[16vw]">
        <div>
          <Rotulo tom="amarelo">Apoie o Instituto</Rotulo>
          <h2 id="titulo-apoie" className="mt-1.5 font-display text-[clamp(1.6rem,1rem+1.4vw,2.05rem)] leading-[1.05] font-extrabold">
            Sua contribuição fortalece pessoas,
            <span className="mt-1 block font-sans text-[clamp(0.95rem,0.8rem+0.4vw,1.15rem)] leading-snug font-normal text-white/90">
              forma novas histórias e mantém viva a nossa cultura.
            </span>
          </h2>
        </div>

        <div className="rounded-card bg-white p-5 text-text shadow-raised">
          {instituto.pixValidado ? (
            <div className="flex items-start gap-4">
              <Icone nome="pix" className="size-9 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-sm font-bold">PIX (CNPJ)</p>
                <p className="font-heading text-[1.35rem] font-extrabold tracking-wide tabular-nums">{instituto.cnpj}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <Icone nome="coracao" className="size-9 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-sm font-bold">Doações</p>
                <p className="mt-0.5 text-[0.85rem] leading-snug text-muted">
                  Para doar ou apoiar um projeto, fale com a equipe pelo{' '}
                  <a href={linkWhatsApp('Olá! Gostaria de apoiar o Instituto Costa da Mina.')} className="font-semibold text-primary underline underline-offset-2">
                    WhatsApp
                  </a>{' '}
                  ou pelo e-mail{' '}
                  <a href={`mailto:${instituto.email}`} className="font-semibold text-primary underline underline-offset-2 [overflow-wrap:anywhere]">
                    {instituto.email}
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
          <p className="mt-3 border-t border-border pt-3 text-[0.75rem] leading-snug text-muted">
            Sua doação ajuda a construir projetos, fortalecer nossa comunidade e criar novas oportunidades.
          </p>
          <Pendente id="pix-validacao" />
        </div>

        <div className="relative flex items-center gap-5 pt-6 lg:pt-8">
          <Botao href="/apoie/" seta>
            Quero apoiar
          </Botao>
          <div className="relative hidden h-28 w-24 sm:block" aria-hidden="true">
            <Coroa className="absolute -top-9 -left-12 h-10 w-12 -rotate-6 text-accent" />
            <Image src={cadeira.src} alt="" width={cadeira.largura} height={cadeira.altura} sizes="96px" className="h-full w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

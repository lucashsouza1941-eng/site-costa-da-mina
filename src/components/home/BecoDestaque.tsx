// Destaque do Beco da Mina: faixa inteira com fotos reais dos murais à
// esquerda e painel roxo com padrão geométrico amarelo à direita.
// As fotos do Beco no site atual têm ~300px de altura; a faixa tem a mesma
// altura no desktop, então elas aparecem praticamente em tamanho natural.
import Image from 'next/image';
import { imagem, type IdImagem } from '@/content/acervo';
import { Botao } from '@/components/ui/Botao';
import { Rotulo } from '@/components/ui/Rotulo';
import { Coroa, PadraoGeometrico } from '@/components/ui/Ornamentos';

const fotos: { id: IdImagem; classe: string }[] = [
  { id: 'beco-mural-trancistas', classe: 'flex-[1.05]' },
  { id: 'beco-mural-rosto', classe: 'flex-[1.15]' },
  { id: 'beco-pintura', classe: 'hidden sm:block flex-[1.05]' },
];

export function BecoDestaque() {
  return (
    <section aria-labelledby="titulo-beco" className="relative isolate overflow-hidden bg-primary-dark text-white">
      <div className="grid lg:min-h-[19rem] lg:grid-cols-[61%_1fr]">
        <div className="relative flex h-60 sm:h-72 lg:h-auto">
          {fotos.map(({ id, classe }) => {
            const f = imagem(id);
            return (
              <div key={id} className={`relative min-w-0 ${classe}`}>
                <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 21vw, 50vw" className="object-cover" />
              </div>
            );
          })}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-deep/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-primary-dark/70" />
          <Coroa className="absolute right-6 bottom-4 h-12 w-14 text-accent lg:right-8" />
        </div>

        <div className="relative px-[var(--gutter)] py-10 lg:py-9 lg:pr-[max(var(--gutter),calc((100vw-var(--container-site))/2+6rem))] lg:pl-10">
          <PadraoGeometrico className="absolute inset-y-0 right-0 hidden h-full w-[clamp(5rem,9vw,9rem)] text-accent/90 sm:block" />
          <div className="relative max-w-[28rem]">
            <Rotulo tom="amarelo">Destaque</Rotulo>
            <h2 id="titulo-beco" className="mt-1.5 text-[clamp(1.9rem,1.2rem+1.5vw,2.45rem)] leading-tight text-white">
              Beco da Mina
            </h2>
            <p className="mt-1 font-heading text-[clamp(1.2rem,0.9rem+0.7vw,1.5rem)] leading-snug font-medium text-white/95">
              Arte, ancestralidade
              <br />e pertencimento.
            </p>
            <p className="mt-4 max-w-[24rem] text-[0.88rem] leading-relaxed text-white/85">
              Um espaço de arte, memória e transformação no coração da Cidade Ademar, com murais que contam histórias e inspiram novos
              caminhos.
            </p>
            <Botao href="/projetos/beco-da-mina/" seta tamanho="sm" className="mt-5 lg:min-h-11 lg:px-5">
              Conheça o projeto
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}

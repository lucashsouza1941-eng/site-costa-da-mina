// "Nossa comunidade em ação": faixa de fotos reais do acervo e um bloco
// "Ver mais fotos" que leva à galeria completa.
import Image from 'next/image';
import Link from 'next/link';
import { listarGaleria } from '@/lib/conteudo';
import { Icone } from '@/components/ui/Icone';
import { Rotulo } from '@/components/ui/Rotulo';
import { Pincelada } from '@/components/ui/Ornamentos';

const destaque = ['beco-mural-rosto', 'beco-mural-trancistas', 'trancando-oficina', 'beco-artistas', 'casa-de-cultura', 'trancando-oficina-3'];

export function FaixaGaleria() {
  const todas = listarGaleria();
  const fotos = destaque.map((id) => todas.find((f) => f.id === id)).filter((f) => f !== undefined);
  const capaMais = todas.find((f) => f.id === 'beco-pintura') ?? fotos[0];

  return (
    <section id="galeria" aria-labelledby="titulo-galeria" className="relative isolate overflow-hidden bg-background pb-12">
      <Pincelada semente={71} className="absolute top-16 -left-6 hidden h-44 w-16 rotate-[40deg] text-brush-magenta lg:block" />
      <Pincelada semente={77} className="absolute top-6 -right-4 hidden h-48 w-16 -rotate-[30deg] text-accent lg:block" />
      <div className="container-site">
        <Rotulo tom="laranja">Nossa comunidade em ação</Rotulo>
        <h2 id="titulo-galeria" className="mt-1 font-heading text-[0.95rem] font-bold text-text">
          Momentos que mostram a força, a beleza e a transformação do nosso território.
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" role="list">
          {fotos.map((f, i) => (
            <li key={f.id} className={`relative aspect-[4/3] overflow-hidden rounded-card bg-primary-dark lg:aspect-[16/11] ${i >= 3 ? 'hidden sm:block' : ''}`}>
              <Image src={f.imagem.src} alt={f.imagem.alt} fill sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 50vw" className="object-cover" />
            </li>
          ))}
          <li className="relative aspect-[4/3] overflow-hidden rounded-card bg-primary-deep lg:aspect-[16/11]">
            {capaMais && <Image src={capaMais.imagem.src} alt="" fill sizes="14vw" className="object-cover opacity-30" />}
            <Link
              href="/galeria/"
              className="absolute inset-0 flex items-center justify-center gap-2 font-heading text-[0.95rem] font-bold text-white hover:text-accent focus-visible:outline-offset-[-4px]"
            >
              Ver mais fotos <Icone nome="seta" className="size-4" espessura={2.2} />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

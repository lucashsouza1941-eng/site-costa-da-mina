// Página inicial, na ordem do design aprovado.
import { metadados } from '@/lib/seo';
import { instituto } from '@/content/instituto';
import { Hero } from '@/components/home/Hero';
import { Pilares } from '@/components/home/Pilares';
import { ProjetosHome } from '@/components/home/ProjetosHome';
import { Sobre } from '@/components/home/Sobre';
import { BecoDestaque } from '@/components/home/BecoDestaque';
import { Impacto } from '@/components/home/Impacto';
import { AgendaHome } from '@/components/home/AgendaHome';
import { NoticiasHome } from '@/components/home/NoticiasHome';
import { Apoie } from '@/components/home/Apoie';
import { Parceiros } from '@/components/home/Parceiros';
import { FaixaGaleria } from '@/components/home/FaixaGaleria';

export const metadata = {
  ...metadados({
    titulo: `${instituto.nome} · ${instituto.lema.join(' ')}`,
    descricao: `Organização cultural e comunitária da ${instituto.territorio}: cultura, educação, arte e oportunidades. ${instituto.lema.join(' ')}`,
    caminho: '/',
  }),
  // na home o título não leva o sufixo " · Instituto Costa da Mina"
  title: { absolute: `${instituto.nome} · ${instituto.lema.join(' ')}` },
};

export default function Inicio() {
  return (
    <main id="conteudo">
      <Hero />
      <Pilares />
      <ProjetosHome />
      <Sobre />
      <BecoDestaque />
      <Impacto />
      <AgendaHome />
      <NoticiasHome />
      <Apoie />
      <Parceiros />
      <FaixaGaleria />
    </main>
  );
}

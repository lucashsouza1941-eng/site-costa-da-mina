// Página inicial, na ordem do design aprovado.
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

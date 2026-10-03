import { Cabecalho } from '@/components/layout/Cabecalho';
import { Hero } from '@/components/home/Hero';

// Fases 3 e 4: a home é montada seção por seção, na ordem do design aprovado.
export default function Inicio() {
  return (
    <>
      <Cabecalho />
      <main id="conteudo">
        <Hero />
      </main>
    </>
  );
}

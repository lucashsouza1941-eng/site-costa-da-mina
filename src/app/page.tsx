// Fase 1: página provisória. A home completa entra nas Fases 3 e 4.
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';
import { Rotulo } from '@/components/ui/Rotulo';

export default function Inicio() {
  return (
    <main id="conteudo" className="bg-primary-dark section-y text-white">
      <Container>
        <Rotulo tom="amarelo">Em construção</Rotulo>
        <h1 className="mt-2 font-display text-hero uppercase">Instituto Costa da Mina</h1>
        <p className="mt-4 max-w-xl text-white/85">Nova versão do site em desenvolvimento.</p>
        {process.env.NODE_ENV !== 'production' && (
          <Botao href="/design-system/" className="mt-8" seta>
            Ver o design system
          </Botao>
        )}
      </Container>
    </main>
  );
}

import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';

export default function NaoEncontrada() {
  return (
    <main id="conteudo" className="section-y">
      <Container>
        <p className="font-heading text-eyebrow text-label-vinho uppercase">Erro 404</p>
        <h1 className="mt-2 text-section">Esta página não existe.</h1>
        <p className="mt-3 text-muted">O link pode estar quebrado ou a página mudou de endereço.</p>
        <Botao href="/" variante="roxo" className="mt-6" seta>
          Voltar ao início
        </Botao>
      </Container>
    </main>
  );
}

// "Nossos parceiros". Nenhum logo é inventado: sem lista validada, a
// faixa de logos não aparece em produção (em desenvolvimento, placeholders).
import Image from 'next/image';
import { listarParceiros } from '@/lib/conteudo';
import { Botao } from '@/components/ui/Botao';
import { TituloSecao } from '@/components/ui/TituloSecao';
import { Placeholder } from '@/components/ui/Desenvolvimento';

export function Parceiros() {
  const parceiros = listarParceiros();
  return (
    <section id="parceiros" aria-labelledby="titulo-parceiros" className="bg-background section-y-sm">
      <div className="container-site">
        <TituloSecao
          id="titulo-parceiros"
          rotulo="Nossos parceiros"
          tomRotulo="laranja"
          titulo="Construindo essa transformação juntos."
          descricao="Organizações, empresas e pessoas que acreditam no nosso trabalho."
          acao={
            <Botao href="/apoie/#parceria" variante="contorno-amarelo" tamanho="sm" seta>
              Quero ser parceiro
            </Botao>
          }
        />
        {parceiros.length > 0 && (
          <ul className="mt-6 grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-6" role="list">
            {parceiros.map((p) =>
              p.exemplo ? (
                <li key={p.nome}>
                  <Placeholder rotulo="logo de parceiro" className="min-h-16" />
                </li>
              ) : (
                <li key={p.nome} className="flex h-16 items-center justify-center">
                  {p.logo ? (
                    <Image src={p.logo.src} alt={p.nome} width={p.logo.largura} height={p.logo.altura} className="max-h-12 w-auto grayscale" />
                  ) : (
                    <span className="font-heading font-bold text-muted">{p.nome}</span>
                  )}
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

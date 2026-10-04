// "Últimas notícias". Sem notícias reais publicadas, a seção não aparece
// em produção (em desenvolvimento mostra os exemplos marcados).
import { listarNoticias } from '@/lib/conteudo';
import { CartaoNoticia } from '@/components/cards/CartaoNoticia';
import { TituloSecao } from '@/components/ui/TituloSecao';
import { Botao } from '@/components/ui/Botao';
import { Pincelada } from '@/components/ui/Ornamentos';

export function NoticiasHome() {
  const noticias = listarNoticias(3);
  if (noticias.length === 0) return null;

  return (
    <section id="noticias" aria-labelledby="titulo-noticias" className="relative isolate overflow-hidden bg-background pb-[var(--section-y-sm)]">
      <Pincelada semente={57} className="absolute top-4 -left-8 hidden h-40 w-16 rotate-[30deg] text-accent/80 lg:block" />
      <Pincelada semente={63} className="absolute -right-6 bottom-0 hidden h-56 w-20 -rotate-[24deg] text-accent/80 lg:block" />
      <div className="container-site">
        <TituloSecao
          id="titulo-noticias"
          rotulo="Últimas notícias"
          tomRotulo="laranja"
          titulo="Acompanhe nossas ações, histórias e novidades."
          acao={
            <Botao href="/noticias/" variante="contorno-amarelo" tamanho="sm" seta>
              Ver todas as notícias
            </Botao>
          }
        />
        <ul className="mt-5 grid gap-5 md:grid-cols-3" role="list">
          {noticias.map((n) => (
            <li key={n.slug} className="grid">
              <CartaoNoticia noticia={n} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

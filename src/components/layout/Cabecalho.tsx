// Cabeçalho do site (design aprovado): logo à esquerda, menu central,
// busca e "Doe agora" à direita. No celular e no tablet, menu em <dialog>.
import { menuPrincipal } from '@/content/home';
import { instituto, linkWhatsApp } from '@/content/instituto';
import { listarProjetos } from '@/lib/conteudo';
import { Botao } from '@/components/ui/Botao';
import { Busca, type ItemBusca } from './Busca';
import { FaixaCabecalho } from './FaixaCabecalho';
import { Logo } from './Logo';
import { MenuCelular } from './MenuCelular';
import { NavPrincipal } from './NavPrincipal';

function montarIndiceDeBusca(): ItemBusca[] {
  const paginas: ItemBusca[] = menuPrincipal
    .filter((m) => m.href !== '/')
    .map((m) => ({ titulo: m.rotulo, href: m.href, tipo: 'Página' }));
  const projetos: ItemBusca[] = listarProjetos().map((p) => ({
    titulo: p.nome,
    descricao: p.resumoCard,
    href: `/projetos/${p.slug}/`,
    tipo: 'Projeto',
  }));
  return [...projetos, ...paginas];
}

export function Cabecalho() {
  const indice = montarIndiceDeBusca();
  const redes = [
    { rotulo: `Instagram @${instituto.redes.instagram.usuario}`, href: instituto.redes.instagram.url, icone: 'instagram' as const },
    { rotulo: 'WhatsApp', href: linkWhatsApp(), icone: 'whatsapp' as const },
    { rotulo: 'E-mail', href: `mailto:${instituto.email}`, icone: 'email' as const },
  ];

  return (
    <FaixaCabecalho>
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-4">
        <Logo className="h-11 lg:h-[3.4rem]" prioridade />

        <nav aria-label="Principal" className="hidden lg:block">
          <NavPrincipal itens={menuPrincipal} className="gap-4 text-[0.875rem] xl:gap-6 xl:text-[0.95rem]" />
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Busca indice={indice} className="hidden lg:grid" />
          <Botao href="/apoie/" seta tamanho="sm" className="hidden xs:inline-flex lg:min-h-12 lg:px-6 lg:text-[0.95rem]">
            Doe agora
          </Botao>
          <div className="lg:hidden">
            <MenuCelular
              itens={menuPrincipal}
              logo={<Logo tom="branco" className="h-full" />}
              redes={redes}
              busca={<Busca indice={indice} className="border border-white/30 text-white hover:bg-white/10" />}
            />
          </div>
        </div>
      </div>
    </FaixaCabecalho>
  );
}

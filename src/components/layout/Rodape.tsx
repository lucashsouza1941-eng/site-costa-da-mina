// Rodapé (design aprovado): fundo grafite, logo e frase, colunas de links,
// redes sociais, faixa em zigue-zague, contatos e barra final.
// Só redes e contatos confirmados (ver pendência "outras-redes").
import Link from 'next/link';
import { instituto, enderecoCompleto, linkWhatsApp, linkMapa } from '@/content/instituto';
import { Icone, type NomeIcone } from '@/components/ui/Icone';
import { Zigzag } from '@/components/ui/Ornamentos';
import { Logo } from './Logo';

const colunas: { titulo: string; links: { rotulo: string; href: string }[]; duasColunas?: boolean }[] = [
  {
    titulo: 'Institucional',
    duasColunas: true,
    links: [
      { rotulo: 'Início', href: '/' },
      { rotulo: 'Instituto', href: '/instituto/' },
      { rotulo: 'Projetos', href: '/projetos/' },
      { rotulo: 'Impacto', href: '/#impacto' },
      { rotulo: 'Agenda', href: '/agenda/' },
      { rotulo: 'Notícias', href: '/noticias/' },
      { rotulo: 'Galeria', href: '/galeria/' },
      { rotulo: 'Parceiros', href: '/#parceiros' },
    ],
  },
  {
    titulo: 'Apoie',
    links: [
      { rotulo: 'Doe', href: '/apoie/#doe' },
      { rotulo: 'Seja voluntário', href: '/apoie/#voluntariado' },
      { rotulo: 'Seja parceiro', href: '/apoie/#parceria' },
      { rotulo: 'Apoie um projeto', href: '/apoie/#projetos' },
    ],
  },
  {
    titulo: 'Contato',
    links: [
      { rotulo: 'Fale conosco', href: '/contato/' },
      { rotulo: 'Trabalhe conosco', href: '/contato/#trabalhe-conosco' },
      { rotulo: 'Imprensa', href: '/contato/#imprensa' },
    ],
  },
];

const redes: { rotulo: string; href: string; icone: NomeIcone }[] = [
  { rotulo: `Instagram @${instituto.redes.instagram.usuario}`, href: instituto.redes.instagram.url, icone: 'instagram' },
  { rotulo: 'WhatsApp', href: linkWhatsApp(), icone: 'whatsapp' },
  { rotulo: 'E-mail', href: `mailto:${instituto.email}`, icone: 'email' },
];

export function Rodape() {
  const ano = new Date().getFullYear();
  return (
    <footer className="bg-graphite text-white/75">
      <div className="container-site grid gap-10 py-12 md:grid-cols-[1.3fr_2fr] lg:grid-cols-[1.15fr_2.2fr_auto] lg:gap-12 lg:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-col xl:flex-row">
          <Logo tom="branco" className="h-12" />
          <p className="max-w-[12rem] text-[0.8rem] leading-snug">{instituto.lema.join(' ')}</p>
        </div>

        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-8 sm:grid-cols-[2fr_1fr_1fr]">
          {colunas.map((c) => (
            <div key={c.titulo} className={c.duasColunas ? 'col-span-2 sm:col-span-1' : ''}>
              <h2 className="font-heading text-[0.95rem] font-bold text-white">{c.titulo}</h2>
              <ul className={`mt-3 grid gap-2 text-[0.85rem] ${c.duasColunas ? 'grid-flow-col grid-cols-2 grid-rows-4 gap-x-8' : ''}`}>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-accent hover:underline">
                      {l.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-5">
          <ul className="flex gap-3" role="list">
            {redes.map((r) => (
              <li key={r.href}>
                <a href={r.href} aria-label={r.rotulo} className="grid size-10 place-items-center rounded-pill border border-white/40 text-white hover:border-accent hover:text-accent">
                  <Icone nome={r.icone} className="size-5" />
                </a>
              </li>
            ))}
          </ul>
          <Zigzag className="h-7 w-40" />
        </div>
      </div>

      <div className="container-site">
        <ul className="grid gap-3 border-t border-white/12 py-5 text-[0.8rem] md:grid-cols-[2fr_1.2fr_1fr]" role="list">
          <li>
            <a href={linkMapa} className="flex items-start gap-2.5 hover:text-accent">
              <Icone nome="local" className="mt-0.5 size-4 shrink-0" />
              {enderecoCompleto}
            </a>
          </li>
          <li>
            <a href={`mailto:${instituto.email}`} className="flex items-center gap-2.5 hover:text-accent [overflow-wrap:anywhere]">
              <Icone nome="email" className="size-4 shrink-0" />
              {instituto.email}
            </a>
          </li>
          <li>
            <a href={linkWhatsApp()} className="flex items-center gap-2.5 hover:text-accent">
              <Icone nome="telefone" className="size-4 shrink-0" />
              {instituto.whatsapp.exibicao}
            </a>
          </li>
        </ul>
        <div className="flex flex-col gap-2 border-t border-white/12 py-5 text-[0.75rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {instituto.nome}. Todos os direitos reservados.
          </p>
          <p className="flex gap-3">
            <Link href="/privacidade/" className="hover:text-accent hover:underline">
              Política de Privacidade
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/termos/" className="hover:text-accent hover:underline">
              Termos de Uso
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

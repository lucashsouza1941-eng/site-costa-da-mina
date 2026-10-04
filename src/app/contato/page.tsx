import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { Botao } from '@/components/ui/Botao';
import { Icone, type NomeIcone } from '@/components/ui/Icone';
import { Rotulo } from '@/components/ui/Rotulo';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { instituto, linkMapa, linkWhatsApp } from '@/content/instituto';
import { imagem } from '@/content/acervo';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Contato',
  descricao: 'WhatsApp, e-mail, Instagram e endereço do Instituto Costa da Mina, na Vila Inglesa, Cidade Ademar.',
  caminho: '/contato/',
});

const canais: { icone: NomeIcone; rotulo: string; valor: string; href: string }[] = [
  { icone: 'whatsapp', rotulo: 'WhatsApp e celular', valor: instituto.whatsapp.exibicao, href: linkWhatsApp('Olá! Vim pelo site do Instituto Costa da Mina.') },
  { icone: 'email', rotulo: 'E-mail', valor: instituto.email, href: `mailto:${instituto.email}` },
  { icone: 'instagram', rotulo: 'Instagram', valor: `@${instituto.redes.instagram.usuario}`, href: instituto.redes.instagram.url },
];

export default function PaginaContato() {
  return (
    <main id="conteudo">
      <CabecaPagina rotulo="Contato" titulo="Fale conosco." trilha={[{ rotulo: 'Contato' }]} imagem={imagem('beco-fachada')}>
        <p>Fale com o Instituto pelos canais oficiais ou encontre a gente na Vila Inglesa, Cidade Ademar.</p>
      </CabecaPagina>

      <section className="section-y-sm" aria-label="Canais de contato">
        <div className="container-site">
          <ul className="grid gap-4 md:grid-cols-3" role="list">
            {canais.map((c) => (
              <li key={c.rotulo}>
                <a href={c.href} className="group flex h-full flex-col gap-1 rounded-card border-2 border-transparent bg-surface p-6 shadow-card transition-colors hover:border-primary">
                  <span className="mb-3 grid size-12 place-items-center rounded-pill bg-primary text-accent">
                    <Icone nome={c.icone} className="size-6" />
                  </span>
                  <span className="font-heading text-xs font-bold tracking-wider text-muted uppercase">{c.rotulo}</span>
                  <span className="font-heading text-lg font-bold [overflow-wrap:anywhere]">{c.valor}</span>
                </a>
              </li>
            ))}
          </ul>
          <Pendente id="whatsapp" />
          <Pendente id="outras-redes" />
        </div>
      </section>

      <section aria-labelledby="titulo-endereco" className="bg-primary-dark py-12 text-white">
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Rotulo tom="amarelo">Endereço</Rotulo>
            <h2 id="titulo-endereco" className="mt-1.5 text-[clamp(1.5rem,1rem+1.2vw,2rem)]">
              {instituto.endereco.logradouro}
            </h2>
            <p className="mt-1 text-white/85">
              {instituto.endereco.bairro} · {instituto.endereco.distrito} · {instituto.endereco.cidade} – {instituto.endereco.uf}
            </p>
            <Pendente id="cep" />
            <Pendente id="horario" />
          </div>
          <Botao href={linkMapa} seta>
            Ver no mapa
          </Botao>
        </div>
      </section>

      <section className="section-y-sm" aria-label="Outros assuntos">
        <div className="container-site grid gap-5 md:grid-cols-2">
          <article id="trabalhe-conosco" className="rounded-card border border-border bg-surface p-6">
            <h2 className="font-heading text-xl font-bold">Trabalhe conosco</h2>
            <p className="mt-2 text-muted">Quer fazer parte das ações do Instituto? Envie uma mensagem contando um pouco sobre você e como gostaria de contribuir.</p>
            <Botao href={`mailto:${instituto.email}?subject=Trabalhe conosco`} variante="contorno-amarelo" tamanho="sm" seta className="mt-4">
              Enviar e-mail
            </Botao>
          </article>
          <article id="imprensa" className="rounded-card border border-border bg-surface p-6">
            <h2 className="font-heading text-xl font-bold">Imprensa</h2>
            <p className="mt-2 text-muted">Jornalistas e veículos podem pedir informações e entrevistas pelo e-mail do Instituto.</p>
            <Botao href={`mailto:${instituto.email}?subject=Imprensa`} variante="contorno-amarelo" tamanho="sm" seta className="mt-4">
              Falar com o Instituto
            </Botao>
          </article>
        </div>
      </section>
    </main>
  );
}

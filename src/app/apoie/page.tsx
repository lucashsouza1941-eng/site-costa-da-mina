import Link from 'next/link';
import { CabecaPagina, Prosa } from '@/components/layout/CabecaPagina';
import { Botao } from '@/components/ui/Botao';
import { Icone, type NomeIcone } from '@/components/ui/Icone';
import { Rotulo } from '@/components/ui/Rotulo';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { instituto, linkWhatsApp } from '@/content/instituto';
import { imagem } from '@/content/acervo';
import { listarProjetos } from '@/lib/conteudo';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Apoie',
  descricao: 'Doe, seja voluntário, seja parceiro ou apoie um projeto do Instituto Costa da Mina.',
  caminho: '/apoie/',
});

const formas: { id: string; icone: NomeIcone; titulo: string; texto: string; mensagem: string }[] = [
  {
    id: 'voluntariado',
    icone: 'comunidade',
    titulo: 'Seja voluntário',
    texto: 'Quer contribuir com seu tempo ou seu conhecimento nas ações do Instituto? Conte o que você gostaria de fazer.',
    mensagem: 'Olá! Gostaria de ser voluntário(a) no Instituto Costa da Mina.',
  },
  {
    id: 'parceria',
    icone: 'projetos',
    titulo: 'Seja parceiro',
    texto: 'Organizações, empresas e coletivos que queiram somar forças podem conversar com a equipe sobre parcerias.',
    mensagem: 'Olá! Gostaria de conversar sobre uma parceria com o Instituto Costa da Mina.',
  },
];

export default function PaginaApoie() {
  return (
    <main id="conteudo">
      <CabecaPagina
        rotulo="Apoie o Instituto"
        titulo="Sua contribuição fortalece pessoas."
        trilha={[{ rotulo: 'Apoie' }]}
        imagem={imagem('trancando-oficina-3')}
      >
        <p>Forma novas histórias e mantém viva a nossa cultura.</p>
      </CabecaPagina>

      <section id="doe" aria-labelledby="titulo-doe" className="section-y-sm">
        <div className="container-site grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
          <div>
            <Rotulo tom="laranja">Doe</Rotulo>
            <h2 id="titulo-doe" className="mt-1.5 text-[clamp(1.6rem,1rem+1.3vw,2.2rem)] leading-tight">
              Qualquer valor ajuda muito.
            </h2>
            <Prosa className="mt-3">
              <p>Sua doação ajuda a construir projetos, fortalecer nossa comunidade e criar novas oportunidades no território.</p>
            </Prosa>
          </div>
          <div className="rounded-card bg-primary-dark p-6 text-white shadow-raised">
            {instituto.pixValidado ? (
              <>
                <p className="font-heading text-sm font-bold tracking-wider text-accent uppercase">Chave PIX (CNPJ)</p>
                <p className="mt-1 font-heading text-[1.7rem] font-extrabold tabular-nums">{instituto.cnpj}</p>
              </>
            ) : (
              <>
                <p className="font-heading text-sm font-bold tracking-wider text-accent uppercase">Como doar</p>
                <p className="mt-2 text-white/90">
                  Os dados para doação estão sendo atualizados. Para doar agora, fale com a equipe: ela envia as informações oficiais.
                </p>
              </>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <Botao href={linkWhatsApp('Olá! Gostaria de fazer uma doação ao Instituto Costa da Mina.')} seta>
                Falar no WhatsApp
              </Botao>
              <Botao href={`mailto:${instituto.email}?subject=Doação`} variante="contorno-claro">
                Enviar e-mail
              </Botao>
            </div>
            <Pendente id="pix-validacao" />
          </div>
        </div>
      </section>

      <section aria-label="Outras formas de apoiar" className="section-y-sm bg-surface">
        <div className="container-site grid gap-5 md:grid-cols-2">
          {formas.map((f) => (
            <article key={f.id} id={f.id} className="flex flex-col gap-3 rounded-card border border-border bg-white p-6 shadow-card">
              <Icone nome={f.icone} className="size-10 text-primary" />
              <h2 className="font-heading text-xl font-bold">{f.titulo}</h2>
              <p className="text-muted">{f.texto}</p>
              <Botao href={linkWhatsApp(f.mensagem)} variante="contorno-amarelo" tamanho="sm" seta className="mt-auto self-start">
                Conversar com a equipe
              </Botao>
            </article>
          ))}
        </div>
      </section>

      <section id="projetos" aria-labelledby="titulo-apoie-projeto" className="section-y-sm">
        <div className="container-site">
          <Rotulo>Apoie um projeto</Rotulo>
          <h2 id="titulo-apoie-projeto" className="mt-1.5 mb-6 text-section">
            Escolha uma iniciativa para fortalecer.
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {listarProjetos().map((p) => (
              <li key={p.slug} className="flex flex-col gap-2 rounded-card border border-border bg-surface p-5">
                <h3 className="font-heading text-lg font-bold">{p.nome}</h3>
                <p className="text-sm text-muted">{p.resumoCard}</p>
                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm font-semibold">
                  <a href={linkWhatsApp(`Olá! Quero apoiar o projeto ${p.nome}.`)} className="text-primary underline underline-offset-2">
                    Quero apoiar
                  </a>
                  <Link href={`/projetos/${p.slug}/`} className="text-muted underline underline-offset-2">
                    Conhecer
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

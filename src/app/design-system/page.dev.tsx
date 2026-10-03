// Vitrine do design system. Só em desenvolvimento: a extensão .dev.tsx
// não é reconhecida no build de produção (next.config.ts).
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Botao } from '@/components/ui/Botao';
import { Rotulo } from '@/components/ui/Rotulo';
import { TituloSecao } from '@/components/ui/TituloSecao';
import { Card } from '@/components/ui/Card';
import { Icone, type NomeIcone } from '@/components/ui/Icone';
import { NotaManuscrita } from '@/components/ui/NotaManuscrita';
import { BordaOndulada, Coroa, PadraoGeometrico, Pincelada, Zigzag } from '@/components/ui/Ornamentos';
import { Placeholder } from '@/components/ui/Desenvolvimento';

export const metadata: Metadata = { title: 'Design system', robots: { index: false, follow: false } };

const cores: { token: string; valor: string; uso: string; claro?: boolean }[] = [
  { token: '--color-primary', valor: '#5f267d', uso: 'Botões roxos, ícones dos pilares' },
  { token: '--color-primary-dark', valor: '#2e113c', uso: 'Faixas Beco da Mina e Apoie' },
  { token: '--color-primary-deep', valor: '#170927', uso: 'Degradês, texto sobre amarelo' },
  { token: '--color-accent', valor: '#f8b019', uso: 'Botões amarelos, datas, destaques', claro: true },
  { token: '--color-background', valor: '#fbf5ea', uso: 'Fundo creme', claro: true },
  { token: '--color-surface', valor: '#fef8f1', uso: 'Cards', claro: true },
  { token: '--color-text', valor: '#161522', uso: 'Títulos e texto' },
  { token: '--color-muted', valor: '#625a65', uso: 'Textos secundários' },
  { token: '--color-border', valor: '#e7ded2', uso: 'Bordas e divisórias', claro: true },
  { token: '--color-label-vinho', valor: '#9e4d6c', uso: 'Rótulo "Nossos projetos"' },
  { token: '--color-label-laranja', valor: '#a55405', uso: 'Rótulo "Sobre o Instituto" (tom acessível)' },
  { token: '--color-graphite', valor: '#0a0d13', uso: 'Rodapé' },
];

const icones: NomeIcone[] = [
  'cultura', 'educacao', 'arte', 'comunidade', 'renda', 'territorio', 'projetos', 'seta', 'menu', 'fechar', 'busca',
  'calendario', 'local', 'relogio', 'email', 'telefone', 'whatsapp', 'instagram', 'facebook', 'youtube', 'coracao', 'pix', 'copiar', 'mais',
];

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10">
      <h2 className="mb-6 font-heading text-xl font-bold">{titulo}</h2>
      {children}
    </section>
  );
}

export default function DesignSystem() {
  return (
    <main id="conteudo" className="section-y-sm">
      <Container>
        <Rotulo>Fase 1</Rotulo>
        <h1 className="mt-1 text-section">Design system · Instituto Costa da Mina</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Tokens extraídos da imagem aprovada. Esta página só existe em desenvolvimento.
        </p>

        <Bloco titulo="Cores">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cores.map((c) => (
              <li key={c.token} className="flex items-center gap-3 rounded-card border border-border bg-white p-3">
                <span className="size-14 shrink-0 rounded-card border border-border" style={{ background: c.valor }} />
                <span className="text-sm">
                  <code className="block font-semibold">{c.token}</code>
                  <span className="block text-muted">
                    {c.valor} · {c.uso}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Bloco>

        <Bloco titulo="Tipografia">
          <div className="grid gap-6">
            <div className="rounded-panel bg-primary-dark p-6 text-white">
              <p className="font-heading text-eyebrow text-accent uppercase">Raízes que educam, cultura que transforma.</p>
              <p className="mt-2 font-display text-hero font-extrabold uppercase">
                Cultura, educação
                <br />e oportunidades para
                <br />
                <span className="text-accent">um futuro mais justo.</span>
              </p>
              <p className="mt-2 text-sm text-white/70">Barlow Condensed 800 · text-hero</p>
            </div>
            <div>
              <p className="text-section font-extrabold">Iniciativas que transformam pessoas e territórios.</p>
              <p className="text-sm text-muted">Barlow 800 · text-section</p>
            </div>
            <div className="max-w-xl">
              <p>
                O Instituto Costa da Mina atua na Cidade Ademar – SP, promovendo cultura, educação, arte e oportunidades para
                fortalecer pessoas e transformar territórios.
              </p>
              <p className="text-sm text-muted">Inter 400 · texto corrido</p>
            </div>
            <div className="rounded-panel bg-primary-dark p-8">
              <NotaManuscrita sublinhado>Da nossa comunidade para o mundo.</NotaManuscrita>
              <p className="mt-4 text-sm text-white/70">Caveat 600 · notas manuscritas</p>
            </div>
          </div>
        </Bloco>

        <Bloco titulo="Botões">
          <div className="flex flex-wrap items-center gap-3">
            <Botao seta>Conheça o Instituto</Botao>
            <Botao variante="roxo" seta>
              Nossa história
            </Botao>
            <Botao variante="contorno-amarelo" tamanho="sm" seta>
              Ver todas as notícias
            </Botao>
            <Botao variante="link" seta>
              Ver todos os projetos
            </Botao>
            <Botao tamanho="sm" seta>
              Doe agora
            </Botao>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 rounded-panel bg-primary-dark p-5">
            <Botao seta>Conheça o projeto</Botao>
            <Botao variante="contorno-claro">Apoie essa causa</Botao>
          </div>
        </Bloco>

        <Bloco titulo="Rótulos e títulos de seção">
          <div className="grid gap-8">
            <TituloSecao
              rotulo="Nossos projetos"
              titulo="Iniciativas que transformam pessoas e territórios."
              acao={
                <Botao variante="link" seta>
                  Ver todos os projetos
                </Botao>
              }
            />
            <TituloSecao
              rotulo="Nosso impacto"
              tomRotulo="laranja"
              titulo="Pessoas, cultura e território em movimento."
              descricao="Cada projeto é uma semente para um futuro com mais oportunidades."
            />
          </div>
        </Bloco>

        <Bloco titulo="Card">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="overflow-hidden">
              <Placeholder rotulo="foto do projeto" className="aspect-[16/10] rounded-none border-0" />
              <div className="p-4">
                <h3 className="font-heading text-lg font-bold">Beco da Mina</h3>
                <p className="mt-1 text-sm text-muted">Arte urbana que revitaliza territórios e transforma realidades.</p>
                <Botao variante="link" className="mt-3 text-sm text-label-laranja" seta>
                  Saiba mais
                </Botao>
              </div>
            </Card>
          </div>
        </Bloco>

        <Bloco titulo="Ícones">
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {icones.map((n) => (
              <li key={n} className="flex flex-col items-center gap-1 rounded-card bg-white p-3 text-xs text-muted">
                <Icone nome={n} className="size-7 text-primary" />
                {n}
              </li>
            ))}
          </ul>
        </Bloco>

        <Bloco titulo="Ornamentos">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="flex h-56 items-center justify-center rounded-panel bg-white">
              <Pincelada className="h-48 text-accent" />
            </div>
            <div className="h-56 overflow-hidden rounded-panel bg-primary-dark">
              <PadraoGeometrico className="h-full w-full text-accent" />
            </div>
            <div className="flex h-56 flex-col justify-center gap-6 rounded-panel bg-graphite p-4">
              <Zigzag className="h-6 w-full" />
              <Coroa className="h-10 w-12 text-accent" />
            </div>
            <div className="flex h-56 flex-col justify-end rounded-panel bg-primary-deep">
              <BordaOndulada className="h-8 text-background" />
            </div>
          </div>
        </Bloco>

        <Bloco titulo="Raios, sombras e espaçamentos">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="rounded-card bg-surface p-4 shadow-card">radius-card · shadow-card</div>
            <div className="rounded-panel bg-surface p-4 shadow-raised">radius-panel · shadow-raised</div>
            <div className="rounded-pill bg-accent px-5 py-2 font-semibold">radius-pill</div>
            <div className="rounded-card border border-border bg-white p-4">
              container: 1240px · gutter 16/24/32px · seção: 48–88px
            </div>
          </div>
        </Bloco>
      </Container>
    </main>
  );
}

import Image from 'next/image';
import { CabecaPagina, Prosa } from '@/components/layout/CabecaPagina';
import { Botao } from '@/components/ui/Botao';
import { Rotulo } from '@/components/ui/Rotulo';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { Coroa, Pincelada } from '@/components/ui/Ornamentos';
import { imagem } from '@/content/acervo';
import { instituto, metas, enderecoCompleto } from '@/content/instituto';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'O Instituto',
  descricao: 'História, missão e símbolo do Instituto Costa da Mina, nascido na Cidade Ademar, Zona Sul de São Paulo.',
  caminho: '/instituto/',
});

// Visão, valores e equipe não existem no site anterior: entram aqui quando o
// Instituto enviar (pendência "visao-valores-equipe"). Listas vazias = seção oculta.
const visao: string | null = null;
const valores: string[] = [];
const equipe: { nome: string; papel: string }[] = [];

function Secao({ id, rotulo, titulo, children, claro = true }: { id: string; rotulo: string; titulo: string; children: React.ReactNode; claro?: boolean }) {
  return (
    <section id={id} aria-labelledby={`titulo-${id}`} className={claro ? 'section-y-sm' : 'section-y-sm bg-primary-dark text-white'}>
      <div className="container-site grid gap-4 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <Rotulo tom={claro ? 'laranja' : 'amarelo'}>{rotulo}</Rotulo>
          <h2 id={`titulo-${id}`} className={`mt-1.5 text-[clamp(1.6rem,1rem+1.3vw,2.2rem)] leading-tight ${claro ? 'text-text' : 'text-white'}`}>
            {titulo}
          </h2>
        </div>
        <div className={claro ? '' : '[&_p]:text-white/85'}>{children}</div>
      </div>
    </section>
  );
}

export default function PaginaInstituto() {
  const territorio = imagem('casa-de-cultura');
  const simbolo = imagem('simbolo');

  return (
    <main id="conteudo">
      <CabecaPagina
        rotulo="O Instituto"
        titulo="Mais que um nome: um elo entre histórias e resistências."
        trilha={[{ rotulo: 'Instituto' }]}
        imagem={{ ...imagem('cidade-ademar'), foco: '50% 30%' }}
      >
        <p>{instituto.lema.join(' ')}</p>
      </CabecaPagina>

      <Secao id="historia" rotulo="Nossa história" titulo="Um nome que atravessa o Atlântico.">
        <Prosa>
          <p className="text-[1.1rem] text-text">
            O nome do Instituto refere-se à Costa da Mina, região da África Ocidental localizada ao longo do Golfo da Guiné, berço de
            diversos povos e culturas que contribuíram de forma profunda para a formação da identidade afro-brasileira.
          </p>
          <p>
            Mais do que uma referência geográfica, a Costa da Mina simboliza um legado civilizatório marcado por saberes ancestrais,
            espiritualidade, organização social e riqueza cultural, que atravessaram o tempo mesmo diante da diáspora forçada.
          </p>
        </Prosa>
      </Secao>

      <section aria-label="O que acreditamos" className="relative overflow-hidden bg-accent py-12 text-primary-deep lg:py-16">
        <div className="container-site">
          <blockquote className="max-w-[26ch] font-display text-[clamp(1.8rem,1.1rem+2.4vw,3.2rem)] leading-[1.05] font-extrabold uppercase">
            Acreditamos que desenvolver é reparar, incluir e reconhecer, e que cada pessoa carrega dentro de si{' '}
            <span className="text-primary">o valor de um continente inteiro.</span>
          </blockquote>
        </div>
        <Coroa className="absolute right-[8%] bottom-8 hidden h-16 w-20 text-primary-deep/80 md:block" />
      </section>

      <section id="territorio" aria-labelledby="titulo-territorio" className="section-y-sm">
        <div className="container-site grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            <Rotulo tom="laranja">Origem e território</Rotulo>
            <h2 id="titulo-territorio" className="mt-1.5 text-[clamp(1.6rem,1rem+1.3vw,2.2rem)] leading-tight text-text">
              Nascemos na Cidade Ademar.
            </h2>
            <Prosa className="mt-4">
              <p>
                O Instituto nasce na Cidade Ademar, Zona Sul de São Paulo, a partir da mobilização de agentes culturais da própria
                comunidade, como resposta às necessidades locais de acesso à cultura, à educação e a oportunidades.
              </p>
              <p>
                Sua fundação está diretamente conectada ao fortalecimento do território, à valorização das raízes e à criação de
                caminhos reais de desenvolvimento coletivo.
              </p>
            </Prosa>
            <Pendente id="ano-fundacao" />
          </div>
          <div className="relative aspect-[855/540] overflow-hidden rounded-card shadow-card">
            <Image src={territorio.src} alt={territorio.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <Secao id="missao" rotulo="Missão" titulo="Ampliar oportunidades e garantir direitos." claro={false}>
        <Prosa>
          <p className="text-[1.1rem]">
            Nossa missão é ampliar oportunidades e garantir direitos fundamentais, fortalecendo vínculos, promovendo a formação cidadã
            e criando pontes entre saberes tradicionais e contemporâneos.
          </p>
          <p>
            Por meio de parcerias, projetos e redes colaborativas, unimos o espírito comunitário à construção de um Brasil mais
            justo, criativo e plural.
          </p>
        </Prosa>
        {(visao || valores.length > 0) && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {visao && (
              <div>
                <h3 className="font-heading text-lg font-bold text-accent">Visão</h3>
                <p className="mt-1">{visao}</p>
              </div>
            )}
            {valores.length > 0 && (
              <div>
                <h3 className="font-heading text-lg font-bold text-accent">Valores</h3>
                <ul className="mt-1 list-disc pl-5">
                  {valores.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <Pendente id="visao-valores-equipe" />
      </Secao>

      <section id="fundadora" aria-labelledby="titulo-fundadora" className="section-y-sm overflow-hidden">
        <div className="container-site grid items-center gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div className="relative mx-auto grid aspect-square w-full max-w-[20rem] place-items-center rounded-full bg-surface shadow-[inset_0_0_0_0.6rem_var(--color-accent)]">
            <Image src={simbolo.src} alt={simbolo.alt} width={simbolo.largura} height={simbolo.altura} sizes="200px" className="w-[55%]" />
            <Pincelada semente={88} className="absolute -right-6 -bottom-4 h-28 w-12 -rotate-[30deg] text-accent/80" />
          </div>
          <div>
            <Rotulo tom="laranja">Quem está à frente</Rotulo>
            <h2 id="titulo-fundadora" className="mt-1.5 text-[clamp(1.6rem,1rem+1.3vw,2.2rem)] leading-tight text-text">
              A cadeira que vira raiz.
            </h2>
            <Prosa className="mt-4">
              <p>
                O projeto começou com a junção de agentes culturais da Cidade Ademar, sobretudo a partir do salão{' '}
                {instituto.fundadora.salao}, espaço que já atuava como ponto de encontro, cuidado e troca dentro do território. À frente
                dessa trajetória está {instituto.fundadora.nome}, empresária local, ativista social e fundadora do Instituto.
              </p>
              <p>
                Trancista com mais de 30 anos de experiência, reconhecida por sua atuação e conexão com uma federação internacional da
                área, Helaine é uma mulher preta e periférica que aprendeu a trançar ainda na infância com sua mãe. Ao longo dos anos,
                acolheu em sua cadeira inúmeras pessoas e histórias, evidenciando a potência das raízes como base para o florescimento.
              </p>
              <p>
                <strong>Essa mesma cadeira</strong>, espaço de escuta, cuidado e transformação, tornou-se o símbolo do Instituto Costa da
                Mina, representando o encontro entre ancestralidade, identidade e futuro.
              </p>
            </Prosa>
            <Pendente id="federacao" />
            <Pendente id="identificacao-pessoas" />
          </div>
        </div>
      </section>

      <section id="metas" aria-labelledby="titulo-metas" className="section-y-sm bg-primary-dark text-white">
        <div className="container-site">
          <Rotulo tom="amarelo">Metas do Instituto</Rotulo>
          <h2 id="titulo-metas" className="mt-1.5 font-display text-[clamp(2rem,1.2rem+2vw,3rem)] font-extrabold uppercase">
            {instituto.chamado}
          </h2>
          <p className="mt-3 max-w-[44rem] text-white/85">
            Promover o desenvolvimento social, cultural, educacional e profissionalizante de pessoas em situação de vulnerabilidade,
            por meio de ações integradas que visam garantir direitos fundamentais e ampliar oportunidades, em parceria com instituições
            públicas e privadas e com grupos de apoio nas áreas de educação e cultura.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {metas.map((m, i) => (
              <li key={m.titulo} className="rounded-card border border-white/15 bg-white/5 p-5">
                <span className="font-display text-3xl font-extrabold text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-heading text-lg font-bold">{m.titulo}</h3>
                <p className="mt-1 text-[0.9rem] text-white/80">{m.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {equipe.length > 0 && (
        <section id="equipe" aria-labelledby="titulo-equipe" className="section-y-sm">
          <div className="container-site">
            <Rotulo tom="laranja">Equipe</Rotulo>
            <h2 id="titulo-equipe" className="mt-1.5 text-section">Quem faz o Instituto</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {equipe.map((p) => (
                <li key={p.nome} className="rounded-card bg-surface p-4 shadow-card">
                  <strong className="block font-heading">{p.nome}</strong>
                  <span className="text-sm text-muted">{p.papel}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="transparencia" aria-labelledby="titulo-transparencia" className="section-y-sm">
        <div className="container-site grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <Rotulo tom="laranja">Transparência</Rotulo>
            <h2 id="titulo-transparencia" className="mt-1.5 text-[clamp(1.6rem,1rem+1.3vw,2.2rem)] leading-tight text-text">
              Dados institucionais
            </h2>
          </div>
          <div>
            <dl className="grid gap-3 rounded-card border border-border bg-surface p-5 text-[0.95rem] sm:grid-cols-[10rem_1fr]">
              <dt className="font-semibold text-text">Organização</dt>
              <dd className="text-muted">{instituto.nome}</dd>
              <dt className="font-semibold text-text">CNPJ</dt>
              <dd className="text-muted tabular-nums">{instituto.cnpj}</dd>
              <dt className="font-semibold text-text">Endereço</dt>
              <dd className="text-muted">{enderecoCompleto}</dd>
              <dt className="font-semibold text-text">Contato</dt>
              <dd className="text-muted [overflow-wrap:anywhere]">{instituto.email}</dd>
            </dl>
            <Pendente id="nome-juridico" />
            <Pendente id="transparencia-documentos" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Botao href="/projetos/" variante="roxo" seta>
                Conheça os projetos
              </Botao>
              <Botao href="/apoie/" variante="contorno-amarelo" seta>
                Apoie o Instituto
              </Botao>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

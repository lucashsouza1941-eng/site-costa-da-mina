import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { instituto, enderecoCompleto } from '@/content/instituto';
import { secoesPrivacidade } from '@/content/privacidade';
import { VERSAO_POLITICA } from '../../../supabase/functions/_compartilhado/regras';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Política de Privacidade',
  descricao: 'Como o Instituto Costa da Mina trata dados pessoais, de acordo com a LGPD.',
  caminho: '/privacidade/',
});

const h2 = 'mt-10 font-heading text-[1.25rem] font-bold text-primary';

export default function PaginaPrivacidade() {
  return (
    <main id="conteudo">
      <CabecaPagina rotulo="Transparência" titulo="Política de Privacidade" trilha={[{ rotulo: 'Política de Privacidade' }]} />
      <section className="section-y-sm">
        <div className="container-site max-w-[48rem] text-[0.98rem] leading-relaxed text-muted [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_strong]:text-text">
          <Pendente id="privacidade-data" />
          <p className="text-[1.08rem] text-text">
            O Instituto Costa da Mina valoriza a privacidade, a segurança e a transparência no tratamento dos dados pessoais de seus
            visitantes, participantes, parceiros, colaboradores e demais pessoas que se relacionam conosco.
          </p>
          <p>
            Esta Política de Privacidade tem como objetivo explicar, de forma clara e transparente, como coletamos, utilizamos,
            armazenamos e protegemos dados pessoais quando você acessa nosso site ou entra em contato conosco.
          </p>
          <p>
            Ao utilizar nosso site ou fornecer seus dados pessoais ao Instituto Costa da Mina, você declara estar ciente das práticas
            descritas nesta Política.
          </p>

          {secoesPrivacidade.map((s) => (
            <section key={s.titulo}>
              <h2 className={h2}>{s.titulo}</h2>
              {s.paragrafos?.map((p) => <p key={p}>{p}</p>)}
              {s.lista && (
                <ul className="mt-3 space-y-1">
                  {s.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {s.depois?.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}

          <section id="cursos">
            <h2 className={h2}>12. Inscrições nos cursos e lista de presença</h2>
            <p>Quando você se inscreve em um curso do Instituto, coletamos somente:</p>
            <ul className="mt-3 space-y-1">
              <li>nome completo, data de nascimento, WhatsApp, bairro e disponibilidade de horário;</li>
              <li>e-mail, apenas se você quiser informar;</li>
              <li>a data, o horário e a forma de cada registro de presença nas aulas.</li>
            </ul>
            <p>Não pedimos CPF, RG nem outros documentos na inscrição.</p>
            <p>
              <strong>Para que usamos:</strong> organizar as turmas, as vagas e a lista de espera, falar com você sobre as aulas pelo
              WhatsApp e controlar a frequência. A data de nascimento serve para conferir a idade mínima, quando a turma tiver uma.
            </p>
            <p>
              <strong>Base legal:</strong> o seu consentimento, dado ao marcar a autorização no formulário. Guardamos a data e a versão
              desta política aceita (versão {VERSAO_POLITICA}).
            </p>
            <p>
              <strong>Quem acessa:</strong> somente pessoas autorizadas da equipe do Instituto, com login individual. A professora vê
              apenas o nome e a presença de cada participante; telefone e e-mail ficam restritos à coordenação. A lista de participantes
              nunca é publicada no site. Toda alteração feita pela equipe fica registrada com data, responsável e motivo.
            </p>
            <p>
              <strong>Serviços utilizados:</strong> os dados ficam em um banco de dados contratado de um provedor de nuvem (Supabase).
              Para impedir envios automáticos, o formulário usa uma verificação anti-robô (Cloudflare Turnstile), que pode tratar dados
              técnicos de navegação, como o endereço IP. Para limitar tentativas repetidas, guardamos por até um dia apenas um código
              cifrado derivado do endereço IP, nunca o endereço em si.
            </p>
            <p>
              <strong>Seus direitos:</strong> você pode pedir a correção ou a exclusão dos seus dados pelo e-mail abaixo. Na exclusão, seus
              dados pessoais são apagados e os registros de presença continuam apenas como números, sem identificação.
            </p>
            <Pendente id="retencao-cursos" />
            <Pendente id="regiao-dados" />
          </section>

          <section>
            <h2 className={h2}>13. Como entrar em contato</h2>
            <p>
              Caso você tenha dúvidas sobre esta Política de Privacidade, queira exercer seus direitos como titular de dados ou precise
              de informações sobre o tratamento de seus dados pessoais, entre em contato conosco:
            </p>
            <address className="mt-4 rounded-card bg-surface p-5 not-italic">
              <strong>{instituto.nome}</strong>
              <br />
              E-mail:{' '}
              <a href={`mailto:${instituto.email}`} className="text-primary underline">
                {instituto.email}
              </a>
              <br />
              Telefone/WhatsApp: {instituto.whatsapp.exibicao}
              <br />
              Endereço: {enderecoCompleto}
            </address>
          </section>
        </div>
      </section>
    </main>
  );
}

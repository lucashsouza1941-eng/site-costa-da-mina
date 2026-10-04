// Termos de Uso: não há texto oficial no site anterior. Regras básicas de
// um site informativo, a revisar pelo Instituto (pendência "termos-revisao").
import Link from 'next/link';
import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { instituto } from '@/content/instituto';
import { metadados } from '@/lib/seo';

export const metadata = metadados({
  titulo: 'Termos de Uso',
  descricao: 'Condições de uso do site do Instituto Costa da Mina.',
  caminho: '/termos/',
});

const h2 = 'mt-10 font-heading text-[1.25rem] font-bold text-primary';

export default function PaginaTermos() {
  return (
    <main id="conteudo">
      <CabecaPagina rotulo="Transparência" titulo="Termos de Uso" trilha={[{ rotulo: 'Termos de Uso' }]} />
      <section className="section-y-sm">
        <div className="container-site max-w-[48rem] text-[0.98rem] leading-relaxed text-muted [&_p]:mt-3">
          <Pendente id="termos-revisao" />
          <h2 className={h2}>1. Sobre este site</h2>
          <p>
            Este site apresenta o {instituto.nome}, seus projetos, sua agenda e formas de contato e apoio. Ao navegar por ele, você
            concorda com estas condições.
          </p>
          <h2 className={h2}>2. Conteúdo</h2>
          <p>
            Textos, fotografias, logotipos e demais materiais publicados pertencem ao Instituto ou às pessoas e organizações que os
            cederam. Não podem ser reproduzidos para fins comerciais sem autorização. Para usar algum material, fale com o Instituto.
          </p>
          <h2 className={h2}>3. Informações publicadas</h2>
          <p>
            O Instituto procura manter as informações corretas e atualizadas. Datas, vagas e horários de atividades podem mudar; em caso
            de dúvida, confirme pelos canais oficiais.
          </p>
          <h2 className={h2}>4. Links para outros sites</h2>
          <p>O site pode ter links para redes sociais e outros serviços, que seguem suas próprias regras e políticas de privacidade.</p>
          <h2 className={h2}>5. Dados pessoais</h2>
          <p>
            O tratamento de dados pessoais segue a{' '}
            <Link href="/privacidade/" className="text-primary underline">
              Política de Privacidade
            </Link>
            .
          </p>
          <h2 className={h2}>6. Contato</h2>
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{' '}
            <a href={`mailto:${instituto.email}`} className="text-primary underline">
              {instituto.email}
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

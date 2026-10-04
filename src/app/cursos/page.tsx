// Inscrição nos cursos. Fora da navegação: o link "Cursos" só aparece no
// cabeçalho quando existe turma com inscrições abertas (docs/CURSOS.md).
import Link from 'next/link';
import Script from 'next/script';
import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { Icone } from '@/components/ui/Icone';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { instituto, linkWhatsApp } from '@/content/instituto';
import { AtivarModulo } from '@/modulos/cursos/Ativar';
import { cursosConfigurado, turnstileChave } from '@/modulos/cursos/lib/config';
import { metadados } from '@/lib/seo';
import '@/modulos/cursos/estilos/modulo.css';

export const metadata = metadados({ titulo: 'Cursos de tranças', descricao: 'Inscrições nos cursos de tranças do Instituto Costa da Mina.', caminho: '/cursos/' });

export default function PaginaCursos() {
  return (
    <main id="conteudo" className="modulo-cursos">
      <CabecaPagina rotulo="Cursos" titulo="Cursos de tranças" trilha={[{ rotulo: 'Cursos' }]}>
        <p>Inscrições gratuitas nas turmas do Instituto Costa da Mina.</p>
      </CabecaPagina>

      <section className="section-y-sm">
        <div className="container-site cursos grid max-w-[44rem] gap-10" data-cursos data-configurado={cursosConfigurado ? 'sim' : 'nao'} data-turnstile={turnstileChave}>
          <Pendente id="contas-cursos" />
          <Pendente id="menores-cursos" />
          <div data-estado aria-live="polite">
            {cursosConfigurado ? (
              <p className="carregando">Procurando turmas com inscrições abertas…</p>
            ) : (
              <div className="aviso">
                <h2>Nenhuma inscrição aberta no momento</h2>
                <p>
                  Acompanhe as novidades no Instagram <a href={instituto.redes.instagram.url}>@{instituto.redes.instagram.usuario}</a>.
                </p>
              </div>
            )}
          </div>

          <div data-turmas hidden>
            <h2 className="cursos__titulo">Turmas com inscrições abertas</h2>
            <ul className="turmas" role="list" data-lista-turmas />
          </div>

          <form className="form inscricao" data-form noValidate hidden aria-labelledby="titulo-form">
            <h2 id="titulo-form" className="cursos__titulo" tabIndex={-1}>
              Faça sua inscrição
            </h2>
            <p className="dica">
              Campos marcados com <span aria-hidden="true">*</span>
              <span className="visualmente-oculto">asterisco</span> são obrigatórios.
            </p>

            <div className="aviso aviso--erro" data-resumo-erros role="alert" tabIndex={-1} hidden />

            <fieldset className="grupo" data-campo="turma">
              <legend>
                Turma <span aria-hidden="true">*</span>
              </legend>
              <div className="grupo" data-opcoes-turma />
              <p className="erro-campo" id="erro-turma" />
            </fieldset>

            <div className="campo">
              <label htmlFor="nome">
                Nome completo <span aria-hidden="true">*</span>
              </label>
              <input className="entrada" id="nome" name="nome" autoComplete="name" required maxLength={120} aria-describedby="erro-nome" />
              <p className="erro-campo" id="erro-nome" />
            </div>

            <div className="campo">
              <label htmlFor="nascimento">
                Data de nascimento <span aria-hidden="true">*</span>
              </label>
              <input className="entrada" id="nascimento" name="nascimento" type="date" autoComplete="bday" required min="1900-01-01" aria-describedby="erro-nascimento" />
              <p className="erro-campo" id="erro-nascimento" />
            </div>

            <div className="campo">
              <label htmlFor="whatsapp">
                WhatsApp com DDD <span aria-hidden="true">*</span>
              </label>
              <input
                className="entrada"
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                maxLength={20}
                placeholder="(11) 91234-5678"
                aria-describedby="dica-whatsapp erro-whatsapp"
              />
              <p className="dica" id="dica-whatsapp">
                Usamos o WhatsApp para falar sobre a turma. Ele também serve para registrar presença nas aulas.
              </p>
              <p className="erro-campo" id="erro-whatsapp" />
            </div>

            <div className="campo">
              <label htmlFor="email">
                E-mail <span className="opcional">(opcional)</span>
              </label>
              <input className="entrada" id="email" name="email" type="email" autoComplete="email" maxLength={200} aria-describedby="erro-email" />
              <p className="erro-campo" id="erro-email" />
            </div>

            <div className="campo">
              <label htmlFor="bairro">
                Bairro <span aria-hidden="true">*</span>
              </label>
              <input className="entrada" id="bairro" name="bairro" autoComplete="address-level3" required maxLength={120} aria-describedby="erro-bairro" />
              <p className="erro-campo" id="erro-bairro" />
            </div>

            <div className="campo">
              <label htmlFor="disponibilidade">
                Disponibilidade de horário <span aria-hidden="true">*</span>
              </label>
              <textarea className="entrada" id="disponibilidade" name="disponibilidade" required maxLength={500} aria-describedby="dica-disponibilidade erro-disponibilidade" />
              <p className="dica" id="dica-disponibilidade">
                Em quais dias e horários você consegue participar? Por exemplo: “domingos de manhã”.
              </p>
              <p className="erro-campo" id="erro-disponibilidade" />
            </div>

            <div className="aviso finalidade">
              <h3>Para que usamos seus dados</h3>
              <p>
                Usamos estes dados somente para organizar a turma: confirmar sua vaga, avisar sobre as aulas pelo WhatsApp e registrar a
                presença. Eles ficam guardados com acesso restrito à equipe do Instituto e não são publicados nem vendidos. Você pode
                pedir a correção ou a exclusão a qualquer momento pelo e-mail <a href={`mailto:${instituto.email}`}>{instituto.email}</a>.
              </p>
            </div>

            <div className="campo">
              <label className="opcao" htmlFor="consentimento">
                <input type="checkbox" id="consentimento" name="consentimento" required aria-describedby="erro-consentimento" />
                <span>
                  Li a{' '}
                  <Link href="/privacidade/#cursos" target="_blank" rel="noopener">
                    Política de Privacidade<span className="visualmente-oculto"> (abre em nova aba)</span>
                  </Link>{' '}
                  e autorizo o Instituto Costa da Mina a tratar meus dados para esta inscrição. <span aria-hidden="true">*</span>
                </span>
              </label>
              <p className="erro-campo" id="erro-consentimento" />
            </div>

            <div className="armadilha" aria-hidden="true">
              <label htmlFor="site">Deixe este campo em branco</label>
              <input id="site" name="site" tabIndex={-1} autoComplete="off" />
            </div>

            <div data-captcha />

            <div>
              <button className="botao botao--roxo" type="submit" data-enviar>
                Enviar inscrição <Icone nome="seta" />
              </button>
            </div>
          </form>

          <div className="confirmacao" data-confirmacao hidden tabIndex={-1} />

          <p className="text-muted">
            Precisa de ajuda? <a href={linkWhatsApp('Olá! Preciso de ajuda com a inscrição no curso de tranças.')}>Fale com a equipe pelo WhatsApp</a>.
          </p>
        </div>
      </section>
      {turnstileChave && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />}
      <AtivarModulo qual="inscricao" />
    </main>
  );
}

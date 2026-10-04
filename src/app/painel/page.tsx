// Painel da equipe (sem link no site, noindex). A página é estática e não
// contém dados: tudo vem do Supabase depois do login, filtrado pelo RLS.
import QRCode from 'qrcode';
import { Pendente } from '@/components/ui/Desenvolvimento';
import { AtivarModulo } from '@/modulos/cursos/Ativar';
import { cursosConfigurado } from '@/modulos/cursos/lib/config';
import { urlAbsoluta } from '@/lib/site';
import { metadados } from '@/lib/seo';
import '@/modulos/cursos/estilos/modulo.css';

export const metadata = metadados({ titulo: 'Painel da equipe', descricao: 'Área restrita da equipe do Instituto Costa da Mina.', caminho: '/painel/' });

export default async function PaginaPainel() {
  const enderecoPresenca = urlAbsoluta('/presenca/');
  const qrSvg = await QRCode.toString(enderecoPresenca, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#170927', light: '#ffffff' },
  });

  return (
    <main id="conteudo" className="modulo-cursos">
      <section className="painel container-site" data-painel data-configurado={cursosConfigurado ? 'sim' : 'nao'}>
        <h1 className="painel__titulo font-display uppercase" tabIndex={-1}>
          Painel da equipe
        </h1>

        <div className="painel__aviso" data-aviso role="status" aria-live="polite" />
        <Pendente id="contas-cursos" />

        {!cursosConfigurado && (
          <div className="aviso">
            <h2>Painel ainda não configurado</h2>
            <p>Falta ligar o site ao Supabase. Veja o passo a passo em docs/CURSOS.md.</p>
          </div>
        )}

        <form className="form painel__login" data-login hidden noValidate>
          <h2>Entrar</h2>
          <div className="campo">
            <label htmlFor="login-email">E-mail</label>
            <input className="entrada" id="login-email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="campo">
            <label htmlFor="login-senha">Senha</label>
            <input className="entrada" id="login-senha" name="senha" type="password" autoComplete="current-password" required />
          </div>
          <p className="erro-campo" data-erro-login role="alert" />
          <div className="grupo-botoes">
            <button className="botao botao--roxo" type="submit">
              Entrar
            </button>
            <button className="botao botao--contorno" type="button" data-esqueci>
              Esqueci a senha
            </button>
          </div>
        </form>

        <form className="form painel__login" data-nova-senha hidden noValidate>
          <h2>Criar nova senha</h2>
          <div className="campo">
            <label htmlFor="nova-senha">Nova senha</label>
            <input className="entrada" id="nova-senha" name="senha" type="password" autoComplete="new-password" minLength={10} required aria-describedby="dica-senha" />
            <p className="dica" id="dica-senha">
              Use pelo menos 10 caracteres.
            </p>
          </div>
          <p className="erro-campo" data-erro-senha role="alert" />
          <button className="botao botao--roxo" type="submit">
            Salvar senha
          </button>
        </form>

        <div className="painel__app" data-app hidden>
          <div className="painel__topo">
            <p>
              <strong data-nome /> · <span data-funcao />
            </p>
            <button className="botao botao--contorno" type="button" data-sair>
              Sair
            </button>
          </div>
          <nav className="painel__abas" aria-label="Seções do painel">
            <a href="#turmas" data-aba="turmas">
              Turmas
            </a>
            <a href="#cursos" data-aba="cursos" data-gerir>
              Cursos
            </a>
            <a href="#historico" data-aba="historico" data-gerir>
              Histórico
            </a>
            <a href="#equipe" data-aba="equipe" data-admin>
              Equipe
            </a>
            <a href="#qr" data-aba="qr">
              QR Code
            </a>
          </nav>
          <div className="painel__tela" data-tela />

          {/* modelo da tela do QR Code (o painel clona este bloco) */}
          <div data-qr hidden>
            <section className="qr">
              <h2>QR Code da chamada</h2>
              <p>
                Este é o QR Code fixo das aulas. Ele só leva à página de presença: nada é registrado até a chamada estar aberta e a
                participante se identificar. Pode imprimir e reutilizar.
              </p>
              <div className="qr__imagem" role="img" aria-label={`QR Code para ${enderecoPresenca}`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <p className="qr__endereco">{enderecoPresenca}</p>
              <button className="botao botao--roxo" type="button" data-imprimir>
                Imprimir
              </button>
            </section>
          </div>
        </div>

        <dialog className="dialogo" data-dialogo aria-labelledby="dialogo-titulo">
          <form method="dialog" className="form">
            <h2 id="dialogo-titulo" data-dialogo-titulo />
            <div className="campo">
              <label htmlFor="dialogo-campo" data-dialogo-rotulo />
              <textarea className="entrada" id="dialogo-campo" maxLength={500} required />
              <p className="erro-campo" data-dialogo-erro />
            </div>
            <div className="grupo-botoes">
              <button className="botao botao--roxo" value="ok" data-dialogo-ok>
                Confirmar
              </button>
              <button className="botao botao--contorno" value="cancelar" formNoValidate>
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
      </section>
      <AtivarModulo qual="painel" />
    </main>
  );
}

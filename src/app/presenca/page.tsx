// Destino do QR Code fixo das aulas. Abrir a página não registra nada: a
// presença só vale com a chamada aberta pela equipe e a identificação.
import { CabecaPagina } from '@/components/layout/CabecaPagina';
import { AtivarModulo } from '@/modulos/cursos/Ativar';
import { cursosConfigurado } from '@/modulos/cursos/lib/config';
import { metadados } from '@/lib/seo';
import '@/modulos/cursos/estilos/modulo.css';

export const metadata = metadados({ titulo: 'Registrar presença', descricao: 'Confirme sua presença na aula do Instituto Costa da Mina.', caminho: '/presenca/' });

export default function PaginaPresenca() {
  return (
    <main id="conteudo" className="modulo-cursos">
      <CabecaPagina rotulo="Lista de chamada" titulo="Registrar presença" trilha={[{ rotulo: 'Presença' }]}>
        <p>Use o código da sua inscrição ou o WhatsApp cadastrado.</p>
      </CabecaPagina>

      <section className="section-y-sm">
        <div className="container-site presenca grid max-w-[34rem] gap-6" data-presenca data-configurado={cursosConfigurado ? 'sim' : 'nao'}>
          <div data-estado aria-live="polite">
            {cursosConfigurado ? (
              <p className="carregando">Verificando se há chamada aberta…</p>
            ) : (
              <div className="aviso">
                <h2>Não existe chamada disponível agora</h2>
                <p>A presença só pode ser registrada durante a aula, quando a professora abrir a chamada.</p>
              </div>
            )}
          </div>

          <form className="form" data-form noValidate hidden>
            <div className="campo">
              <label htmlFor="identificador">Código da inscrição ou WhatsApp</label>
              <input
                className="entrada"
                id="identificador"
                name="identificador"
                required
                maxLength={40}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="CDM-ABCD-EFGH ou (11) 91234-5678"
                aria-describedby="dica-identificador erro-identificador"
              />
              <p className="dica" id="dica-identificador">
                O código aparece na tela de confirmação da inscrição.
              </p>
              <p className="erro-campo" id="erro-identificador" />
            </div>
            <div className="armadilha" aria-hidden="true">
              <label htmlFor="site">Deixe este campo em branco</label>
              <input id="site" name="site" tabIndex={-1} autoComplete="off" />
            </div>
            <div>
              <button className="botao botao--roxo" type="submit" data-enviar>
                Confirmar presença
              </button>
            </div>
          </form>

          <div data-resultado tabIndex={-1} aria-live="assertive" />

          <button className="botao botao--contorno justify-self-start text-primary" type="button" data-atualizar hidden>
            Verificar de novo
          </button>
        </div>
      </section>
      <AtivarModulo qual="presenca" />
    </main>
  );
}

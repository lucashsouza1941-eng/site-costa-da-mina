// Página aberta pelo QR Code: confirma presença só com chamada aberta.
import { cursosConfigurado } from './lib/config';
import { chamadaDisponivel, chamarFuncao } from './lib/api-publica';
import { mensagemDe, normalizarCodigo, normalizarWhatsapp } from '../../../supabase/functions/_compartilhado/regras';
import { el, formatarHora } from './lib/dom';

const raiz = document.querySelector<HTMLElement>('[data-presenca]');
if (raiz && cursosConfigurado) iniciar(raiz);

function iniciar(raiz: HTMLElement) {
  const estado = raiz.querySelector<HTMLElement>('[data-estado]')!;
  const form = raiz.querySelector<HTMLFormElement>('[data-form]')!;
  const entrada = raiz.querySelector<HTMLInputElement>('#identificador')!;
  const erro = raiz.querySelector<HTMLElement>('#erro-identificador')!;
  const resultado = raiz.querySelector<HTMLElement>('[data-resultado]')!;
  const botao = raiz.querySelector<HTMLButtonElement>('[data-enviar]')!;
  const atualizar = raiz.querySelector<HTMLButtonElement>('[data-atualizar]')!;

  const semChamada = () => {
    form.hidden = true;
    estado.replaceChildren(
      el('div', { class: 'aviso' }, [
        el('h2', {}, 'Não existe chamada disponível agora'),
        el('p', {}, 'A presença só pode ser registrada durante a aula, quando a professora abrir a chamada. Se ela já abriu, toque em "Verificar de novo".'),
      ]),
    );
    atualizar.hidden = false;
  };

  async function verificar() {
    resultado.replaceChildren();
    estado.replaceChildren(el('p', { class: 'carregando' }, 'Verificando se há chamada aberta…'));
    try {
      if (await chamadaDisponivel()) {
        estado.replaceChildren(el('p', {}, 'A chamada está aberta. Informe seus dados para confirmar a presença.'));
        form.hidden = false;
        atualizar.hidden = true;
        entrada.focus();
      } else {
        semChamada();
      }
    } catch {
      form.hidden = true;
      estado.replaceChildren(el('div', { class: 'aviso aviso--erro' }, [el('p', {}, mensagemDe('INDISPONIVEL'))]));
      atualizar.hidden = false;
    }
  }

  atualizar.addEventListener('click', verificar);

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    erro.textContent = '';
    entrada.removeAttribute('aria-invalid');
    resultado.replaceChildren();

    const valor = entrada.value;
    if (!normalizarCodigo(valor) && !normalizarWhatsapp(valor)) {
      erro.textContent = mensagemDe('IDENTIFICADOR_INVALIDO');
      entrada.setAttribute('aria-invalid', 'true');
      entrada.focus();
      return;
    }

    botao.disabled = true;
    botao.textContent = 'Confirmando…';
    const resposta = await chamarFuncao('presenca', {
      identificador: valor,
      site: (form.elements.namedItem('site') as HTMLInputElement).value,
    });
    botao.disabled = false;
    botao.textContent = 'Confirmar presença';

    if (resposta.ok) {
      const confirmadas = (resposta.confirmadas ?? []) as { turma: string; aula: string; registrado_em: string }[];
      form.hidden = true;
      estado.replaceChildren();
      resultado.replaceChildren(
        el('div', { class: 'aviso aviso--sucesso' }, [
          el('h2', {}, 'Presença registrada!'),
          ...confirmadas.map((c) => el('p', {}, `${c.turma} · ${c.aula} · às ${formatarHora(c.registrado_em)}`)),
          el('p', {}, 'Pode guardar o celular. Boa aula!'),
        ]),
      );
      resultado.focus();
      return;
    }

    if (resposta.codigo === 'SEM_CHAMADA') {
      semChamada();
      return;
    }
    const sucessoAnterior = resposta.codigo === 'JA_REGISTRADA';
    resultado.replaceChildren(
      el('div', { class: `aviso ${sucessoAnterior ? 'aviso--sucesso' : 'aviso--erro'}`, role: 'alert' }, [
        el('p', {}, resposta.mensagem ?? mensagemDe(resposta.codigo ?? 'INDISPONIVEL')),
      ]),
    );
    if (!sucessoAnterior) entrada.setAttribute('aria-invalid', 'true');
  });

  verificar();
}

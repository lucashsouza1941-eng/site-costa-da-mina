// Painel: login, controle de acesso e navegação entre telas.
import { cursosConfigurado } from '../lib/config';
import { el } from '../lib/dom';
import { NOMES_FUNCAO, avisar, definirAlvoAviso, ehAdmin, podeGerir, sb, sessao, textoDoErro, type Membro } from './comum';
import { telaTurmas, telaTurma, telaFormTurma } from './turmas';
import { telaAula } from './chamada';
import { telaCursos } from './cursos';
import { telaEquipe } from './equipe';
import { telaHistorico } from './historico';

const raiz = document.querySelector<HTMLElement>('[data-painel]');
if (raiz && cursosConfigurado) iniciar(raiz);

function iniciar(raiz: HTMLElement) {
  const formLogin = raiz.querySelector<HTMLFormElement>('[data-login]')!;
  const formSenha = raiz.querySelector<HTMLFormElement>('[data-nova-senha]')!;
  const app = raiz.querySelector<HTMLElement>('[data-app]')!;
  const tela = raiz.querySelector<HTMLElement>('[data-tela]')!;
  const erroLogin = raiz.querySelector<HTMLElement>('[data-erro-login]')!;
  definirAlvoAviso(raiz.querySelector<HTMLElement>('[data-aviso]')!);

  const mostrar = (qual: 'login' | 'senha' | 'app' | 'nada') => {
    formLogin.hidden = qual !== 'login';
    formSenha.hidden = qual !== 'senha';
    app.hidden = qual !== 'app';
  };

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    erroLogin.textContent = '';
    const fd = new FormData(formLogin);
    const { error } = await sb.auth.signInWithPassword({ email: String(fd.get('email')), password: String(fd.get('senha')) });
    if (error) {
      erroLogin.textContent = 'E-mail ou senha incorretos.';
      formLogin.querySelector<HTMLInputElement>('#login-senha')?.focus();
    }
  });

  raiz.querySelector('[data-esqueci]')!.addEventListener('click', async () => {
    const email = formLogin.querySelector<HTMLInputElement>('#login-email')!.value.trim();
    if (!email) {
      erroLogin.textContent = 'Digite seu e-mail acima e toque de novo em "Esqueci a senha".';
      return;
    }
    await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] });
    // mesma resposta exista ou não a conta (não revela quem é da equipe)
    avisar('Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha.', 'sucesso');
  });

  formSenha.addEventListener('submit', async (e) => {
    e.preventDefault();
    const senha = formSenha.querySelector<HTMLInputElement>('#nova-senha')!.value;
    const erro = formSenha.querySelector<HTMLElement>('[data-erro-senha]')!;
    if (senha.length < 10) {
      erro.textContent = 'A senha precisa ter pelo menos 10 caracteres.';
      return;
    }
    const { error } = await sb.auth.updateUser({ password: senha });
    if (error) {
      erro.textContent = textoDoErro(error);
      return;
    }
    avisar('Senha alterada.', 'sucesso');
    await entrar();
  });

  raiz.querySelector('[data-sair]')!.addEventListener('click', async () => {
    await sb.auth.signOut();
    sessao.membro = null;
    tela.replaceChildren();
    mostrar('login');
  });

  let recuperando = false;
  sb.auth.onAuthStateChange((evento) => {
    if (evento === 'PASSWORD_RECOVERY') {
      recuperando = true;
      mostrar('senha');
    } else if (evento === 'SIGNED_IN' && !recuperando && !sessao.membro) {
      entrar();
    } else if (evento === 'SIGNED_OUT') {
      mostrar('login');
    }
  });

  async function entrar() {
    recuperando = false;
    const { data: usuario } = await sb.auth.getUser();
    if (!usuario.user) return mostrar('login');
    const { data, error } = await sb.from('equipe').select('user_id, nome, funcao, ativo').eq('user_id', usuario.user.id).maybeSingle();
    if (error || !data || !data.ativo) {
      mostrar('nada');
      avisar('Sua conta não tem acesso ao painel. Fale com a administração do Instituto.', 'erro');
      await sb.auth.signOut();
      return;
    }
    sessao.membro = data as Membro;
    raiz!.querySelector('[data-nome]')!.textContent = data.nome;
    raiz!.querySelector('[data-funcao]')!.textContent = NOMES_FUNCAO[data.funcao as Membro['funcao']];
    raiz!.querySelectorAll<HTMLElement>('[data-gerir]').forEach((a) => (a.hidden = !podeGerir()));
    raiz!.querySelectorAll<HTMLElement>('[data-admin]').forEach((a) => (a.hidden = !ehAdmin()));
    mostrar('app');
    rotear();
  }

  async function rotear() {
    if (!sessao.membro) return;
    const [secao, id] = (location.hash.slice(1) || 'turmas').split('/');
    raiz!.querySelectorAll<HTMLAnchorElement>('[data-aba]').forEach((a) => {
      const ativa = a.dataset.aba === secao || (a.dataset.aba === 'turmas' && ['turma', 'aula', 'turma-form'].includes(secao));
      if (ativa) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    tela.replaceChildren(el('p', { class: 'carregando' }, 'Carregando…'));
    try {
      switch (secao) {
        case 'turma':
          await telaTurma(tela, id);
          break;
        case 'turma-form':
          await telaFormTurma(tela, id);
          break;
        case 'aula':
          await telaAula(tela, id);
          break;
        case 'cursos':
          await telaCursos(tela);
          break;
        case 'equipe':
          await telaEquipe(tela);
          break;
        case 'historico':
          await telaHistorico(tela);
          break;
        case 'qr': {
          const modelo = raiz!.querySelector<HTMLTemplateElement>('[data-qr]')!;
          tela.replaceChildren(modelo.content.cloneNode(true));
          tela.querySelector('[data-imprimir]')?.addEventListener('click', () => print());
          break;
        }
        default:
          await telaTurmas(tela);
      }
    } catch (erro) {
      tela.replaceChildren(el('div', { class: 'aviso aviso--erro', role: 'alert' }, textoDoErro(erro as Error)));
    }
    tela.querySelector<HTMLElement>('h2')?.setAttribute('tabindex', '-1');
    tela.querySelector<HTMLElement>('h2')?.focus();
  }

  window.addEventListener('hashchange', rotear);

  sb.auth.getSession().then(({ data }) => {
    if (location.hash.includes('type=recovery')) return; // o evento PASSWORD_RECOVERY cuida disso
    if (data.session) entrar();
    else mostrar('login');
  });
}

// Equipe (só administração): quem acessa o painel e com qual função.
import { el } from '../lib/dom';
import { NOMES_FUNCAO, avisar, botao, campo, entrada, sb, selecao, sessao, textoDoErro } from './comum';

export async function telaEquipe(tela: HTMLElement) {
  const { data, error } = await sb.from('equipe').select('*').order('nome');
  if (error) throw error;

  const linhas = (data ?? []).map((m: any) => {
    const funcao = selecao(Object.entries(NOMES_FUNCAO), m.funcao);
    funcao.classList.add('entrada');
    funcao.setAttribute('aria-label', `Função de ${m.nome}`);
    const ativo = selecao(
      [
        ['true', 'Ativo'],
        ['false', 'Sem acesso'],
      ],
      String(m.ativo),
    );
    ativo.classList.add('entrada');
    ativo.setAttribute('aria-label', `Acesso de ${m.nome}`);
    const proprio = m.user_id === sessao.membro?.user_id;
    const salvar = botao(
      'Salvar',
      async () => {
        const { error: erro } = await sb
          .from('equipe')
          .update({ funcao: funcao.value, ativo: ativo.value === 'true' })
          .eq('user_id', m.user_id);
        if (erro) return avisar(textoDoErro(erro), 'erro');
        avisar(`${m.nome} atualizado.`, 'sucesso');
      },
      'botao botao--contorno',
    );
    salvar.setAttribute('aria-label', `Salvar ${m.nome}`);
    // a própria administradora não tira o próprio acesso por engano
    if (proprio) {
      funcao.disabled = true;
      ativo.disabled = true;
      salvar.disabled = true;
    }
    return el('tr', {}, [
      el('th', { scope: 'row' }, m.nome + (proprio ? ' (você)' : '')),
      el('td', {}, [funcao]),
      el('td', {}, [ativo]),
      el('td', {}, [salvar]),
    ]);
  });

  const c = {
    email: entrada('email', '', { required: '', autocomplete: 'off' }),
    nome: entrada('text', '', { required: '', maxlength: '120' }),
    funcao: selecao(Object.entries(NOMES_FUNCAO), 'professora'),
  };
  const form = el('form', { class: 'form cartao-painel', novalidate: '' }, [
    el('h3', {}, 'Adicionar pessoa à equipe'),
    el('p', {}, 'Primeiro convide a conta no Supabase (Authentication → Users → Invite user). Depois informe o mesmo e-mail aqui.'),
    el('div', { class: 'grade-form' }, [
      campo('eq-email', 'E-mail da conta', c.email),
      campo('eq-nome', 'Nome', c.nome),
      campo('eq-funcao', 'Função', c.funcao, {
        dica: 'Professora: chamada e presença. Coordenação: também cursos, turmas e inscrições. Administração: tudo, inclusive equipe e exclusão de dados.',
        largo: true,
      }),
    ]),
    el('button', { type: 'submit', class: 'botao botao--roxo' }, 'Adicionar'),
  ]);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error: erro } = await sb.rpc('adicionar_membro', {
      p_email: c.email.value,
      p_nome: c.nome.value,
      p_funcao: c.funcao.value,
    });
    if (erro) return avisar(textoDoErro(erro), 'erro');
    avisar('Pessoa adicionada à equipe.', 'sucesso');
    telaEquipe(tela);
  });

  tela.replaceChildren(
    el('h2', {}, 'Equipe'),
    el('div', { class: 'tabela-rolagem' }, [
      el('table', { class: 'tabela' }, [
        el('caption', {}, 'Pessoas com acesso ao painel'),
        el('thead', {}, [el('tr', {}, ['Nome', 'Função', 'Acesso', 'Ação'].map((t) => el('th', { scope: 'col' }, t)))]),
        el('tbody', {}, linhas),
      ]),
    ]),
    form,
  );
}

// Cursos: cadastro e edição.
import { el } from '../lib/dom';
import { areaTexto, avisar, botao, campo, entrada, sb, selecao, textoDoErro } from './comum';

export async function telaCursos(tela: HTMLElement) {
  const { data, error } = await sb.from('cursos').select('*').order('nome');
  if (error) throw error;

  const formulario = (curso: any | null) => {
    const c = {
      nome: entrada('text', curso?.nome, { maxlength: '120', required: '' }),
      descricao: areaTexto(curso?.descricao, { maxlength: '4000' }),
      publico_alvo: entrada('text', curso?.publico_alvo, { maxlength: '500' }),
      carga_horaria: entrada('text', curso?.carga_horaria, { maxlength: '120' }),
      ativo: selecao(
        [
          ['true', 'Ativo'],
          ['false', 'Inativo (não aparece no site)'],
        ],
        String(curso?.ativo ?? true),
      ),
    };
    const prefixo = curso ? `cur-${curso.id.slice(0, 8)}` : 'cur-novo';
    const form = el('form', { class: 'form cartao-painel', novalidate: '' }, [
      el('h3', {}, curso ? `Editar: ${curso.nome}` : 'Novo curso'),
      el('div', { class: 'grade-form' }, [
        campo(`${prefixo}-nome`, 'Nome do curso', c.nome),
        campo(`${prefixo}-ativo`, 'Situação', c.ativo),
        campo(`${prefixo}-descricao`, 'Descrição (aparece no site)', c.descricao, { largo: true }),
        campo(`${prefixo}-publico`, 'Para quem (opcional)', c.publico_alvo),
        campo(`${prefixo}-carga`, 'Carga horária (opcional)', c.carga_horaria, { dica: 'Ex.: "8 encontros de 2 horas".' }),
      ]),
      el('div', { class: 'grupo-botoes' }, [
        el('button', { type: 'submit', class: 'botao botao--roxo' }, curso ? 'Salvar' : 'Criar curso'),
        curso ? botao('Cancelar', () => telaCursos(tela), 'botao botao--contorno') : null,
      ]),
    ]);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const valores = {
        nome: c.nome.value.trim(),
        descricao: c.descricao.value.trim() || null,
        publico_alvo: c.publico_alvo.value.trim() || null,
        carga_horaria: c.carga_horaria.value.trim() || null,
        ativo: c.ativo.value === 'true',
      };
      if (valores.nome.length < 3) return avisar('Dê um nome ao curso (mínimo de 3 letras).', 'erro');
      const { error: erro } = curso
        ? await sb.from('cursos').update(valores).eq('id', curso.id)
        : await sb.from('cursos').insert(valores);
      if (erro) return avisar(textoDoErro(erro), 'erro');
      avisar(curso ? 'Curso atualizado.' : 'Curso criado.', 'sucesso');
      telaCursos(tela);
    });
    return form;
  };

  const lista = (data ?? []).map((curso: any) =>
    el('li', { class: 'cartao-painel' }, [
      el('h3', {}, curso.nome),
      el('p', {}, curso.ativo ? 'Ativo' : 'Inativo'),
      curso.descricao ? el('p', {}, curso.descricao) : null,
      botao(
        'Editar',
        () => {
          const form = formulario(curso);
          tela.replaceChildren(el('h2', {}, 'Cursos'), form);
          form.querySelector<HTMLInputElement>('input')?.focus();
        },
        'botao botao--contorno',
      ),
    ]),
  );

  tela.replaceChildren(
    el('h2', {}, 'Cursos'),
    lista.length ? el('ul', { class: 'cartoes', role: 'list' }, lista) : el('p', {}, 'Nenhum curso cadastrado.'),
    formulario(null),
  );
}

// Chamada de uma aula: abrir/encerrar o QR, acompanhar e marcar presenças.
import { el, formatarData, formatarHora } from '../lib/dom';
import { NOMES_METODO, NOMES_PRESENCA, avisar, botao, link, pedirTexto, sb, selecao, selo, textoDoErro } from './comum';

let atualizacao: number | undefined;

export async function telaAula(tela: HTMLElement, id: string) {
  clearInterval(atualizacao);
  const { data: aula, error } = await sb.from('aulas').select('*, turmas(nome, cursos(nome))').eq('id', id).single();
  if (error) throw error;

  const nomeAula = aula.titulo || `Aula ${aula.numero ?? ''}`.trim();
  const estado = el('div', { class: 'chamada-status', role: 'status', 'aria-live': 'polite' });
  const acoes = el('div', { class: 'barra' });
  const lista = el('div');

  const duracao = selecao(
    [
      ['15', '15 minutos'],
      ['30', '30 minutos'],
      ['45', '45 minutos'],
      ['60', '1 hora'],
    ],
    '15',
  );
  duracao.id = 'duracao-chamada';
  duracao.classList.add('entrada');

  async function recarregar() {
    const { data: a } = await sb.from('aulas').select('chamada_aberta_em, chamada_fecha_em, chamada_encerrada_em').eq('id', id).single();
    const aberta = a && a.chamada_aberta_em && !a.chamada_encerrada_em && new Date(a.chamada_fecha_em) > new Date();

    estado.replaceChildren(
      aberta
        ? el('p', {}, [el('strong', {}, 'Chamada aberta'), ` até ${formatarHora(a.chamada_fecha_em)}. As participantes já podem usar o QR Code.`])
        : el('p', {}, [
            el('strong', {}, 'Chamada fechada.'),
            a?.chamada_encerrada_em ? ` Encerrada às ${formatarHora(a.chamada_encerrada_em)}.` : ' O QR Code não registra presença agora.',
          ]),
    );

    acoes.replaceChildren(
      ...(aberta
        ? [
            botao('Encerrar chamada', async () => {
              const { error: erro } = await sb.rpc('encerrar_chamada', { p_aula: id });
              if (erro) return avisar(textoDoErro(erro), 'erro');
              avisar('Chamada encerrada.', 'sucesso');
              recarregar();
            }, 'botao botao--roxo'),
          ]
        : [
            el('div', { class: 'campo' }, [el('label', { for: 'duracao-chamada' }, 'Duração'), duracao]),
            botao('Abrir chamada', async () => {
              const { error: erro } = await sb.rpc('abrir_chamada', { p_aula: id, p_minutos: Number(duracao.value) });
              if (erro) return avisar(textoDoErro(erro), 'erro');
              avisar('Chamada aberta. Mostre o QR Code para a turma.', 'sucesso');
              recarregar();
            }, 'botao botao--roxo'),
          ]),
      link('#qr', 'Mostrar QR Code', 'botao botao--contorno'),
    );

    await desenharLista();

    clearInterval(atualizacao);
    if (aberta) {
      // enquanto a chamada está aberta, a lista se atualiza sozinha
      atualizacao = window.setInterval(() => {
        if (!document.body.contains(lista)) return clearInterval(atualizacao);
        recarregar();
      }, 15000);
    }
  }

  async function desenharLista() {
    const { data, error: erro } = await sb.rpc('lista_chamada', { p_aula: id });
    if (erro) {
      lista.replaceChildren(el('div', { class: 'aviso aviso--erro' }, textoDoErro(erro)));
      return;
    }
    const pessoas = data ?? [];
    const presentes = pessoas.filter((p: any) => p.status === 'presente').length;

    const linhas = pessoas.map((p: any, indice: number) => {
      const atual = p.status ?? '';
      const seletor = selecao(
        [
          ['', '— escolha —'],
          ...Object.entries(NOMES_PRESENCA),
        ] as [string, string][],
        atual,
      );
      seletor.id = `presenca-${indice}`;
      seletor.classList.add('entrada');
      seletor.setAttribute('aria-label', `Presença de ${p.nome}`);
      const salvar = botao('Salvar', async () => {
        const novo = seletor.value;
        if (!novo || novo === atual) return;
        let motivo: string | null = null;
        if (atual) {
          motivo = await pedirTexto(`Corrigir a presença de ${p.nome}`, `Motivo da correção (de "${NOMES_PRESENCA[atual]}" para "${NOMES_PRESENCA[novo]}")`);
          if (!motivo) return;
        }
        const { error: e } = await sb.rpc('marcar_presenca', { p_aula: id, p_inscricao: p.inscricao_id, p_status: novo, p_motivo: motivo });
        if (e) return avisar(textoDoErro(e), 'erro');
        avisar(`${p.nome}: ${NOMES_PRESENCA[novo]}.`, 'sucesso');
        desenharLista();
      }, 'botao botao--contorno');
      salvar.setAttribute('aria-label', `Salvar presença de ${p.nome}`);

      return el('tr', {}, [
        el('th', { scope: 'row' }, p.nome),
        el('td', {}, p.codigo),
        el('td', {}, p.status ? [selo(p.status, NOMES_PRESENCA)] : 'Sem registro'),
        el('td', {}, p.metodo ? `${NOMES_METODO[p.metodo]} · ${formatarHora(p.registrado_em)}` : ''),
        el('td', {}, p.corrigido_em ? `Corrigida às ${formatarHora(p.corrigido_em)}: ${p.motivo_correcao}` : ''),
        el('td', {}, [seletor, ' ', salvar]),
      ]);
    });

    lista.replaceChildren(
      pessoas.length
        ? el('div', { class: 'tabela-rolagem' }, [
            el('table', { class: 'tabela' }, [
              el('caption', {}, `${presentes} presentes de ${pessoas.length} inscritas confirmadas`),
              el('thead', {}, [
                el('tr', {}, ['Nome', 'Código', 'Situação', 'Registro', 'Correção', 'Marcar ou corrigir'].map((c) => el('th', { scope: 'col' }, c))),
              ]),
              el('tbody', {}, linhas),
            ]),
          ])
        : el('p', {}, 'Nenhuma inscrição confirmada nesta turma.'),
    );
  }

  tela.replaceChildren(
    el('p', {}, [link(`#turma/${aula.turma_id}`, '← Voltar à turma')]),
    el('h2', {}, `${nomeAula} · ${formatarData(aula.data)}`),
    el('p', {}, `${aula.turmas?.cursos?.nome ?? ''} · ${aula.turmas?.nome ?? ''}`),
    estado,
    acoes,
    el('h3', {}, 'Lista de chamada'),
    el('p', { class: 'dica' }, 'Alterar uma presença já registrada (inclusive pelo QR) pede um motivo, que fica guardado no histórico com seu nome e o horário.'),
    lista,
  );
  await recarregar();
}

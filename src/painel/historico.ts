// Histórico de alterações (auditoria), para administração e coordenação.
import { el, formatarDataHora } from '../lib/dom';
import { avisar, botao, ehAdmin, pedirTexto, sb, textoDoErro } from './comum';

const TABELAS: Record<string, string> = {
  equipe: 'Equipe',
  cursos: 'Curso',
  turmas: 'Turma',
  aulas: 'Aula',
  participantes: 'Participante',
  inscricoes: 'Inscrição',
  presencas: 'Presença',
};
const ACOES: Record<string, string> = { insert: 'Criou', update: 'Alterou', delete: 'Excluiu' };

/** Lista só os nomes dos campos que mudaram, sem despejar dados pessoais. */
function camposAlterados(antes: any, depois: any): string {
  if (!antes || !depois) return '';
  const ignorar = new Set(['atualizado_em', 'criado_em']);
  return Object.keys(depois)
    .filter((k) => !ignorar.has(k) && JSON.stringify(antes[k]) !== JSON.stringify(depois[k]))
    .join(', ');
}

export async function telaHistorico(tela: HTMLElement) {
  const [{ data, error }, { data: equipe }] = await Promise.all([
    sb.from('historico').select('*').order('id', { ascending: false }).limit(200),
    sb.from('equipe').select('user_id, nome'),
  ]);
  if (error) throw error;
  const nomes = new Map((equipe ?? []).map((m: any) => [m.user_id, m.nome]));

  const quem = (h: any) =>
    h.autor ? (nomes.get(h.autor) ?? 'Pessoa removida da equipe') : h.autor_tipo === 'publico' ? 'Participante (pelo site)' : 'Sistema';

  const linhas = (data ?? []).map((h: any) =>
    el('tr', {}, [
      el('td', {}, formatarDataHora(h.criado_em)),
      el('td', {}, quem(h)),
      el('td', {}, `${ACOES[h.acao] ?? h.acao}: ${TABELAS[h.tabela] ?? h.tabela}`),
      el('td', {}, camposAlterados(h.dados_antes, h.dados_depois)),
      el('td', {}, h.motivo ?? ''),
    ]),
  );

  const blocos: HTMLElement[] = [
    el('h2', {}, 'Histórico de alterações'),
    el('p', {}, 'As 200 alterações mais recentes: quem fez, quando, o que mudou e o motivo informado.'),
    el('div', { class: 'tabela-rolagem' }, [
      el('table', { class: 'tabela' }, [
        el('caption', {}, 'Alterações recentes'),
        el('thead', {}, [
          el('tr', {}, ['Quando', 'Quem', 'O quê', 'Campos alterados', 'Motivo'].map((t) => el('th', { scope: 'col' }, t))),
        ]),
        el('tbody', {}, linhas),
      ]),
    ]),
  ];

  if (ehAdmin()) {
    blocos.push(
      el('section', { class: 'cartao-painel' }, [
        el('h3', {}, 'Excluir dados pessoais de uma participante (LGPD)'),
        el(
          'p',
          {},
          'Use quando a titular pedir a exclusão. Nome, WhatsApp, e-mail, nascimento e bairro são apagados, inclusive do histórico; as presenças continuam nos números, sem identificação. Não dá para desfazer.',
        ),
        botao(
          'Anonimizar pelo código da inscrição',
          async () => {
            const codigo = await pedirTexto('Anonimizar participante', 'Código da inscrição (CDM-XXXX-XXXX)');
            if (!codigo) return;
            const { data: insc } = await sb
              .from('inscricoes')
              .select('participante_id')
              .eq('codigo', codigo.trim().toUpperCase())
              .maybeSingle();
            if (!insc) return avisar('Código não encontrado.', 'erro');
            const motivo = await pedirTexto('Motivo da exclusão', 'Ex.: pedido da titular por e-mail em 03/10');
            if (!motivo) return;
            const { error: erro } = await sb.rpc('anonimizar_participante', {
              p_participante: insc.participante_id,
              p_motivo: motivo,
            });
            if (erro) return avisar(textoDoErro(erro), 'erro');
            avisar('Dados pessoais apagados.', 'sucesso');
            telaHistorico(tela);
          },
          'botao botao--contorno',
        ),
      ]),
    );
  }
  tela.replaceChildren(...blocos);
}

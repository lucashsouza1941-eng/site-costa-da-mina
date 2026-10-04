// Peças compartilhadas pelas telas do painel.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseChave, supabaseUrl } from '../lib/config';
import { el } from '../lib/dom';
import { gerarCsv, mensagemDe } from '../../../../supabase/functions/_compartilhado/regras';

export type Funcao = 'admin' | 'coordenacao' | 'professora';
export type Membro = { user_id: string; nome: string; funcao: Funcao };

export const sb: SupabaseClient = createClient(supabaseUrl || 'http://invalido.local', supabaseChave || 'x', {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'icm-painel' },
});

export const sessao: { membro: Membro | null } = { membro: null };

export const podeGerir = () => sessao.membro?.funcao === 'admin' || sessao.membro?.funcao === 'coordenacao';
export const ehAdmin = () => sessao.membro?.funcao === 'admin';

export const NOMES_FUNCAO: Record<Funcao, string> = {
  admin: 'Administração',
  coordenacao: 'Coordenação',
  professora: 'Professora',
};

export const NOMES_STATUS_TURMA: Record<string, string> = {
  rascunho: 'Rascunho',
  inscricoes_programadas: 'Inscrições programadas',
  inscricoes_abertas: 'Inscrições abertas',
  inscricoes_encerradas: 'Inscrições encerradas',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

export const NOMES_STATUS_INSCRICAO: Record<string, string> = {
  confirmada: 'Confirmada',
  lista_espera: 'Lista de espera',
  cancelada: 'Cancelada',
};

export const NOMES_PRESENCA: Record<string, string> = {
  presente: 'Presente',
  ausente: 'Ausente',
  justificada: 'Presença justificada',
  nao_registrado: 'Não registrado',
};

export const NOMES_METODO: Record<string, string> = {
  qr_codigo: 'QR + código',
  qr_whatsapp: 'QR + WhatsApp',
  manual: 'Manual',
};

const MENSAGENS_EQUIPE: Record<string, string> = {
  SEM_PERMISSAO: 'Sua função não permite esta ação.',
  MOTIVO_OBRIGATORIO: 'Informe o motivo.',
  SEM_VAGA: 'Não há vaga livre. Aumente as vagas da turma ou cancele outra inscrição antes.',
  NAO_ESTA_NA_ESPERA: 'Esta inscrição não está na lista de espera.',
  TURMA_SEM_AULAS: 'A chamada não pode ser aberta em turma em rascunho, concluída ou cancelada.',
  DURACAO_INVALIDA: 'A chamada deve durar entre 5 e 180 minutos.',
  INSCRICAO_FORA_DA_TURMA: 'Esta inscrição não pertence à turma da aula.',
  WHATSAPP_EM_USO: 'Este WhatsApp já pertence a outra participante.',
  CONTA_INEXISTENTE: 'Não há conta com este e-mail. Crie o usuário no Supabase (Authentication → Users) antes.',
  TURMA_FINALIZADA: 'A turma está concluída ou cancelada.',
};

/** Traduz erros do Supabase em frases para a equipe. */
export function textoDoErro(erro: { message?: string; code?: string } | null | undefined): string {
  if (!erro) return 'Algo deu errado.';
  const codigo = erro.message ?? '';
  if (MENSAGENS_EQUIPE[codigo]) return MENSAGENS_EQUIPE[codigo];
  if (/^[A-Z_]+$/.test(codigo)) return mensagemDe(codigo);
  if (erro.code === '42501' || /row-level security/.test(codigo)) return MENSAGENS_EQUIPE.SEM_PERMISSAO;
  if (erro.code === '23503') return 'Não é possível excluir: existem registros ligados a este item.';
  return `Não foi possível concluir: ${codigo}`;
}

let alvoAviso: HTMLElement | null = null;
export function definirAlvoAviso(alvo: HTMLElement) {
  alvoAviso = alvo;
}

/** Mensagem no topo do painel, anunciada por leitores de tela. */
export function avisar(texto: string, tipo: 'sucesso' | 'erro' | 'info' = 'info') {
  if (!alvoAviso) return;
  alvoAviso.replaceChildren(
    el('div', { class: `aviso ${tipo === 'info' ? '' : `aviso--${tipo}`}`, role: tipo === 'erro' ? 'alert' : null }, texto),
  );
  if (tipo !== 'erro') setTimeout(() => alvoAviso?.replaceChildren(), 6000);
}

export const selo = (status: string, nomes: Record<string, string>) =>
  el('span', { class: `selo selo--${status}` }, nomes[status] ?? status);

/** Diálogo acessível que pede um texto (motivo). Devolve null se cancelado. */
export function pedirTexto(titulo: string, rotulo: string): Promise<string | null> {
  const dialogo = document.querySelector<HTMLDialogElement>('[data-dialogo]')!;
  const campo = dialogo.querySelector<HTMLTextAreaElement>('#dialogo-campo')!;
  const erro = dialogo.querySelector<HTMLElement>('[data-dialogo-erro]')!;
  dialogo.querySelector('[data-dialogo-titulo]')!.textContent = titulo;
  dialogo.querySelector('[data-dialogo-rotulo]')!.textContent = rotulo;
  campo.value = '';
  erro.textContent = '';
  dialogo.showModal();
  campo.focus();

  return new Promise((resolver) => {
    const aoFechar = () => {
      dialogo.removeEventListener('close', aoFechar);
      resolver(dialogo.returnValue === 'ok' && campo.value.trim() ? campo.value.trim() : null);
    };
    dialogo.addEventListener('close', aoFechar);
  });
}

export function baixarCsv(nome: string, colunas: { chave: string; titulo: string }[], linhas: Record<string, unknown>[]) {
  const blob = new Blob([gerarCsv(colunas, linhas)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: nome });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// datetime-local ⇄ timestamptz no fuso de São Paulo (UTC−3, sem horário de verão)
export function paraCampoDataHora(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(new Date(iso).getTime() - 3 * 3600_000);
  return d.toISOString().slice(0, 16);
}
export const deCampoDataHora = (valor: string) => (valor ? `${valor}:00-03:00` : null);

/** Campo de formulário com rótulo ligado. */
export function campo(
  id: string,
  rotulo: string,
  controle: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  opcoes: { dica?: string; largo?: boolean } = {},
) {
  controle.id = id;
  controle.name = id;
  controle.classList.add('entrada');
  const filhos: HTMLElement[] = [el('label', { for: id }, rotulo), controle];
  if (opcoes.dica) {
    controle.setAttribute('aria-describedby', `${id}-dica`);
    filhos.push(el('p', { class: 'dica', id: `${id}-dica` }, opcoes.dica));
  }
  return el('div', { class: `campo${opcoes.largo ? ' campo--largo' : ''}` }, filhos);
}

export function entrada(tipo: string, valor: unknown, extra: Record<string, string> = {}) {
  const i = el('input', { type: tipo, ...extra });
  i.value = valor === null || valor === undefined ? '' : String(valor);
  return i;
}

export function selecao(opcoes: [string, string][], valor: unknown) {
  const s = el('select', {}, opcoes.map(([v, t]) => el('option', { value: v }, t)));
  s.value = valor === null || valor === undefined ? '' : String(valor);
  return s;
}

export function areaTexto(valor: unknown, extra: Record<string, string> = {}) {
  const t = el('textarea', extra);
  t.value = valor === null || valor === undefined ? '' : String(valor);
  return t;
}

export function botao(texto: string, aoClicar: () => void, classe = 'botao') {
  const b = el('button', { type: 'button', class: classe }, texto);
  b.addEventListener('click', aoClicar);
  return b;
}

export const link = (href: string, texto: string, classe?: string) => el('a', { href, class: classe }, texto);

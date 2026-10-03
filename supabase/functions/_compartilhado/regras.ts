// Regras compartilhadas entre o navegador (formulário) e as Edge Functions.
// Sem dependências e sem APIs do Deno: roda em Node, Deno e no navegador.
// O banco valida tudo de novo; isto serve para dar retorno rápido e claro.

/** Versão da Política de Privacidade aceita no formulário. */
export const VERSAO_POLITICA = '2026-10-03';

export type DadosInscricao = {
  turma: string;
  nome: string;
  nascimento: string; // AAAA-MM-DD
  whatsapp: string;
  email: string | null;
  bairro: string;
  disponibilidade: string;
  consentimento: boolean;
};

export type ResultadoValidacao =
  | { ok: true; dados: DadosInscricao }
  | { ok: false; erros: Partial<Record<keyof DadosInscricao, string>> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const texto = (v: unknown) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');

/** Mesmo critério do banco: só dígitos, DDD + número, sem o 55. */
export function normalizarWhatsapp(valor: string): string | null {
  const d = valor.replace(/\D/g, '');
  if (/^55\d{10,11}$/.test(d)) return d.slice(2);
  if (/^\d{10,11}$/.test(d)) return d;
  return null;
}

/** Aceita "cdm abcd efgh", "ABCDEFGH" etc. Devolve CDM-XXXX-XXXX ou null. */
export function normalizarCodigo(valor: string): string | null {
  const s = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!/^(CDM)?[A-Z0-9]{8}$/.test(s)) return null;
  const n = s.slice(-8);
  return `CDM-${n.slice(0, 4)}-${n.slice(4)}`;
}

function dataValida(valor: string, hoje = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const d = new Date(`${valor}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) return false;
  return d.getUTCFullYear() >= 1900 && d <= hoje;
}

export function validarInscricao(corpo: Record<string, unknown>, hoje = new Date()): ResultadoValidacao {
  const erros: Partial<Record<keyof DadosInscricao, string>> = {};
  const dados: DadosInscricao = {
    turma: texto(corpo.turma),
    nome: texto(corpo.nome),
    nascimento: texto(corpo.nascimento),
    whatsapp: texto(corpo.whatsapp),
    email: texto(corpo.email).toLowerCase() || null,
    bairro: texto(corpo.bairro),
    disponibilidade: texto(corpo.disponibilidade),
    consentimento: corpo.consentimento === true || corpo.consentimento === 'on' || corpo.consentimento === 'sim',
  };

  if (!UUID.test(dados.turma)) erros.turma = 'Escolha uma turma.';
  if (dados.nome.length < 3 || dados.nome.length > 120 || !/\p{L}/u.test(dados.nome))
    erros.nome = 'Informe seu nome completo.';
  if (!dataValida(dados.nascimento, hoje)) erros.nascimento = 'Informe uma data de nascimento válida.';
  if (!normalizarWhatsapp(dados.whatsapp)) erros.whatsapp = 'Informe o WhatsApp com DDD, por exemplo (11) 91234-5678.';
  if (dados.email && (dados.email.length > 200 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(dados.email)))
    erros.email = 'O e-mail parece incompleto. Ele é opcional: pode deixar em branco.';
  if (dados.bairro.length < 2 || dados.bairro.length > 120) erros.bairro = 'Informe seu bairro.';
  if (dados.disponibilidade.length < 1 || dados.disponibilidade.length > 500)
    erros.disponibilidade = 'Conte em quais dias e horários você pode participar.';
  if (!dados.consentimento) erros.consentimento = 'Para se inscrever, é preciso aceitar a Política de Privacidade.';

  return Object.keys(erros).length ? { ok: false, erros } : { ok: true, dados };
}

/** Mensagens para cada código de erro do banco ou das funções. */
export const MENSAGENS: Record<string, string> = {
  INSCRICOES_FECHADAS: 'As inscrições desta turma não estão abertas.',
  TURMA_INEXISTENTE: 'Não encontramos esta turma. Atualize a página e tente de novo.',
  JA_INSCRITA:
    'Este WhatsApp já tem uma inscrição nesta turma. Se perdeu o código, fale com a equipe do Instituto pelo WhatsApp.',
  IDADE_MINIMA: 'Esta turma tem idade mínima e a data de nascimento informada não atende.',
  CONSENTIMENTO_OBRIGATORIO: 'Para se inscrever, é preciso aceitar a Política de Privacidade.',
  NOME_INVALIDO: 'Informe seu nome completo.',
  NASCIMENTO_INVALIDO: 'Informe uma data de nascimento válida.',
  WHATSAPP_INVALIDO: 'Informe o WhatsApp com DDD.',
  EMAIL_INVALIDO: 'O e-mail parece incompleto.',
  BAIRRO_INVALIDO: 'Informe seu bairro.',
  DISPONIBILIDADE_INVALIDA: 'Conte em quais dias e horários você pode participar.',
  SEM_CHAMADA: 'Não existe chamada aberta agora. A presença só pode ser registrada durante a aula, quando a professora abrir a chamada.',
  NAO_INSCRITA:
    'Não encontramos uma inscrição confirmada com esses dados na turma que está com a chamada aberta. Confira o código ou o WhatsApp e tente de novo.',
  JA_REGISTRADA: 'Sua presença nesta aula já estava registrada. Não precisa fazer mais nada.',
  IDENTIFICADOR_INVALIDO: 'Digite o código da inscrição (como CDM-ABCD-EFGH) ou o WhatsApp com DDD.',
  CAPTCHA: 'Não conseguimos confirmar que o envio foi feito por uma pessoa. Recarregue a página e tente de novo.',
  MUITAS_TENTATIVAS: 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.',
  ROBO: 'Não foi possível concluir o envio. Recarregue a página e tente de novo.',
  INDISPONIVEL: 'O serviço está indisponível no momento. Tente de novo mais tarde ou fale com a equipe pelo WhatsApp.',
};

export const mensagemDe = (codigo: string) => MENSAGENS[codigo] ?? MENSAGENS.INDISPONIVEL;

/** Status HTTP de cada erro de negócio. */
export function statusHttp(codigo: string): number {
  if (codigo === 'MUITAS_TENTATIVAS') return 429;
  if (codigo === 'CAPTCHA' || codigo === 'ROBO') return 403;
  if (['JA_INSCRITA', 'JA_REGISTRADA', 'INSCRICOES_FECHADAS', 'SEM_CHAMADA'].includes(codigo)) return 409;
  if (codigo in MENSAGENS && codigo !== 'INDISPONIVEL') return 400;
  return 500;
}

/** Sinais de envio automatizado: campo-armadilha preenchido ou envio rápido demais. */
export function pareceRobo(corpo: Record<string, unknown>, agora = Date.now(), tempoMinimoMs = 3000): boolean {
  if (texto(corpo.site) !== '') return true;
  const inicio = Number(corpo.iniciado_em);
  if (!Number.isFinite(inicio)) return true;
  return agora - inicio < tempoMinimoMs;
}

/** Evita injeção de fórmulas ao abrir o CSV em planilhas. */
export function celulaCsv(valor: unknown): string {
  let s = valor === null || valor === undefined ? '' : String(valor);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function gerarCsv(colunas: { chave: string; titulo: string }[], linhas: Record<string, unknown>[]): string {
  const cabecalho = colunas.map((c) => celulaCsv(c.titulo)).join(';');
  const corpo = linhas.map((l) => colunas.map((c) => celulaCsv(l[c.chave])).join(';'));
  // BOM para o Excel reconhecer acentos; ponto e vírgula é o separador do Excel em pt-BR
  return '﻿' + [cabecalho, ...corpo].join('\r\n');
}

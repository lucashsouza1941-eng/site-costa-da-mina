// Utilidades HTTP das Edge Functions (Deno).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { mensagemDe, statusHttp } from './regras.ts';

const origens = (Deno.env.get('ORIGENS_PERMITIDAS') ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export function cabecalhosCors(req: Request): HeadersInit {
  const origem = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': origens.includes(origem) ? origem : origens[0] ?? 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function json(req: Request, status: number, corpo: unknown): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...cabecalhosCors(req), 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const erro = (req: Request, codigo: string, extra: Record<string, unknown> = {}) =>
  json(req, statusHttp(codigo), { ok: false, codigo, mensagem: mensagemDe(codigo), ...extra });

/** Só aceita POST com JSON vindo de uma origem permitida. */
export async function lerPedido(req: Request): Promise<Record<string, unknown> | Response> {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cabecalhosCors(req) });
  if (req.method !== 'POST') return json(req, 405, { ok: false, codigo: 'METODO' });
  const origem = req.headers.get('origin') ?? '';
  if (origens.length && !origens.includes(origem)) return erro(req, 'ROBO');
  try {
    const corpo = await req.json();
    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return erro(req, 'ROBO');
    return corpo as Record<string, unknown>;
  } catch {
    return erro(req, 'ROBO');
  }
}

/** Cliente com a chave de serviço. A chave só existe nos segredos do Supabase. */
export function clienteServico() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Hash do IP com sal: permite limitar tentativas sem guardar o IP. */
export async function chaveDoCliente(req: Request, extra = ''): Promise<string> {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'desconhecido';
  const sal = Deno.env.get('SAL_TENTATIVAS') ?? '';
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${sal}|${ip}|${extra}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function dentroDoLimite(
  db: ReturnType<typeof clienteServico>,
  acao: string,
  chave: string,
  limite: number,
  janelaSegundos: number,
): Promise<boolean> {
  const { data, error } = await db.rpc('registrar_tentativa', {
    p_acao: acao,
    p_chave: chave,
    p_limite: limite,
    p_janela_segundos: janelaSegundos,
  });
  if (error) throw error;
  return data === true;
}

/** Verifica o token do Cloudflare Turnstile no servidor. */
export async function captchaValido(req: Request, token: unknown): Promise<boolean> {
  if (Deno.env.get('CAPTCHA_DESATIVADO') === 'sim') return true;
  const segredo = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!segredo || typeof token !== 'string' || !token) return false;
  const corpo = new FormData();
  corpo.append('secret', segredo);
  corpo.append('response', token);
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim();
  if (ip) corpo.append('remoteip', ip);
  const resposta = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: corpo });
  const resultado = await resposta.json();
  return resultado.success === true;
}

/** Extrai o código de negócio de um erro do Postgres (ex.: 'JA_INSCRITA'). */
export function codigoDoErro(e: { code?: string; message?: string } | null, seDuplicado: string): string {
  if (!e) return 'INDISPONIVEL';
  if (e.code === 'P0001' && e.message && /^[A-Z_]+$/.test(e.message)) return e.message;
  // violação de unicidade em envios simultâneos
  if (e.code === '23505') return seDuplicado;
  return 'INDISPONIVEL';
}

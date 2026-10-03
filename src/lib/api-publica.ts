// Chamadas públicas ao Supabase, sem a biblioteca completa (página leve).
import { supabaseUrl, supabaseChave } from './config';

const cabecalhos = () => ({
  apikey: supabaseChave,
  Authorization: `Bearer ${supabaseChave}`,
  'Content-Type': 'application/json',
});

export type TurmaPublica = {
  id: string;
  curso: string;
  curso_descricao: string | null;
  publico_alvo: string | null;
  carga_horaria: string | null;
  turma: string;
  local: string | null;
  endereco: string | null;
  dias_horarios: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  inscricoes_fim: string | null;
  idade_minima: number | null;
  observacoes: string | null;
  vagas_restantes: number;
};

async function rpc<T>(nome: string): Promise<T> {
  const r = await fetch(`${supabaseUrl}/rest/v1/rpc/${nome}`, { method: 'POST', headers: cabecalhos(), body: '{}' });
  if (!r.ok) throw new Error(`rpc ${nome}: ${r.status}`);
  return r.json();
}

export const turmasAbertas = () => rpc<TurmaPublica[]>('turmas_publicas');
export const chamadaDisponivel = () => rpc<boolean>('chamada_disponivel');

export type RespostaFuncao = { ok: boolean; codigo?: string; mensagem?: string; campos?: Record<string, string> } & Record<
  string,
  unknown
>;

export async function chamarFuncao(nome: 'inscricao' | 'presenca', corpo: unknown): Promise<RespostaFuncao> {
  try {
    const r = await fetch(`${supabaseUrl}/functions/v1/${nome}`, {
      method: 'POST',
      headers: cabecalhos(),
      body: JSON.stringify(corpo),
    });
    return await r.json();
  } catch {
    return { ok: false, codigo: 'INDISPONIVEL' };
  }
}

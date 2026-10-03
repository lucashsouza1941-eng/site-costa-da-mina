// Supabase falso para desenvolvimento das páginas públicas (/cursos/ e
// /presenca/) sem conta no Supabase. Usa o SQL real da migração (PGlite) e
// imita os endpoints públicos: duas RPCs e as duas Edge Functions.
// NÃO cobre o painel (login). Uso:
//   node tests/apoio/supabase-falso.mjs
//   PUBLIC_SUPABASE_URL=http://localhost:54321 PUBLIC_SUPABASE_ANON_KEY=dev npx astro dev --port 4322
// Atalhos: GET /dev/abrir-chamada · GET /dev/fechar-chamada · GET /dev/lotar
import { createServer } from 'node:http';
import { criarBanco, criarMembro, como, comoPublico, comoServico } from './banco.mjs';
import {
  VERSAO_POLITICA,
  mensagemDe,
  normalizarCodigo,
  normalizarWhatsapp,
  pareceRobo,
  statusHttp,
  validarInscricao,
} from '../../supabase/functions/_compartilhado/regras.ts';

const PORTA = Number(process.env.PORTA ?? 54321);
const db = await criarBanco();
const professora = await criarMembro(db, 'professora');

const curso = (
  await db.query(
    "insert into public.cursos (nome, descricao) values ('Curso de tranças (exemplo)', 'Turma fictícia, só para desenvolvimento.') returning id",
  )
).rows[0].id;
const turma = (
  await db.query(
    `insert into public.turmas (curso_id, nome, vagas, status, dias_horarios, local, inscricoes_fim)
     values ($1, 'Turma de exemplo', 3, 'inscricoes_abertas', 'Domingos, 10h às 12h', 'Local de exemplo', now() + interval '7 days') returning id`,
    [curso],
  )
).rows[0].id;
const aula = (await db.query("insert into public.aulas (turma_id, numero, data) values ($1, 1, current_date) returning id", [turma])).rows[0].id;

const erroDe = (e) => (e?.message && /^[A-Z_]+$/.test(e.message) ? e.message : 'INDISPONIVEL');

function responder(res, status, corpo) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  });
  res.end(JSON.stringify(corpo));
}

const falha = (res, codigo) => responder(res, statusHttp(codigo), { ok: false, codigo, mensagem: mensagemDe(codigo) });

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return responder(res, 204, {});
  let texto = '';
  for await (const parte of req) texto += parte;
  const corpo = texto ? JSON.parse(texto) : {};
  const rota = req.url.split('?')[0];

  try {
    if (rota === '/rest/v1/rpc/turmas_publicas') {
      return responder(res, 200, await comoPublico(db, 'select * from public.turmas_publicas()'));
    }
    if (rota === '/rest/v1/rpc/chamada_disponivel') {
      return responder(res, 200, (await comoPublico(db, 'select public.chamada_disponivel() as d'))[0].d);
    }
    if (rota === '/functions/v1/inscricao') {
      if (pareceRobo(corpo)) return falha(res, 'ROBO');
      const v = validarInscricao(corpo);
      if (!v.ok) return responder(res, 400, { ok: false, codigo: 'DADOS_INVALIDOS', mensagem: 'Confira os campos indicados.', campos: v.erros });
      const d = v.dados;
      try {
        const r = await comoServico(db, 'select public.inscrever_publico($1,$2,$3,$4,$5,$6,$7,$8,$9) as r', [
          d.turma, d.nome, d.nascimento, d.whatsapp, d.email, d.bairro, d.disponibilidade, d.consentimento, VERSAO_POLITICA,
        ]);
        return responder(res, 200, { ok: true, ...r[0].r });
      } catch (e) {
        return falha(res, erroDe(e));
      }
    }
    if (rota === '/functions/v1/presenca') {
      const id = normalizarCodigo(corpo.identificador ?? '') ?? normalizarWhatsapp(corpo.identificador ?? '');
      if (!id) return falha(res, 'IDENTIFICADOR_INVALIDO');
      try {
        const r = await comoServico(db, 'select public.confirmar_presenca_publica($1) as r', [id]);
        return responder(res, 200, { ok: true, ...r[0].r });
      } catch (e) {
        return falha(res, erroDe(e));
      }
    }
    if (rota === '/dev/abrir-chamada') {
      await como(db, 'authenticated', professora, 'select public.abrir_chamada($1, 15)', [aula]);
      return responder(res, 200, { ok: true, aberta: true });
    }
    if (rota === '/dev/fechar-chamada') {
      await como(db, 'authenticated', professora, 'select public.encerrar_chamada($1)', [aula]);
      return responder(res, 200, { ok: true, aberta: false });
    }
    if (rota === '/dev/lotar') {
      await db.query("update public.turmas set vagas = 1 where id = $1", [turma]);
      return responder(res, 200, { ok: true });
    }
    responder(res, 404, { erro: 'rota desconhecida' });
  } catch (e) {
    responder(res, 500, { erro: String(e.message) });
  }
}).listen(PORTA, () => console.log(`Supabase falso em http://localhost:${PORTA}`));

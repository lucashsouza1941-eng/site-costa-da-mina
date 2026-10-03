// Banco de testes: Postgres real (PGlite) com o mínimo do Supabase simulado
// (papéis anon/authenticated/service_role, schema auth e auth.uid()).
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';

const pastaMigracoes = new URL('../../supabase/migrations/', import.meta.url);

const SUPABASE_SIMULADO = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant usage on schema public to anon, authenticated, service_role;
`;

export async function criarBanco() {
  const db = new PGlite();
  await db.exec(SUPABASE_SIMULADO);
  for (const arquivo of readdirSync(pastaMigracoes).filter((n) => n.endsWith('.sql')).sort()) {
    await db.exec(readFileSync(new URL(arquivo, pastaMigracoes), 'utf8'));
  }
  // o Supabase dá à service_role acesso às tabelas; aqui reproduzimos isso
  await db.exec('grant all on all tables in schema public to service_role;');
  return db;
}

/** Executa SQL como um papel do Supabase (e, opcionalmente, um usuário logado). */
export async function como(db, papel, usuario, sql, parametros = []) {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${papel}`);
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [usuario ?? '']);
    const resultado = await tx.query(sql, parametros);
    return resultado.rows;
  });
}

export const comoPublico = (db, sql, p) => como(db, 'anon', null, sql, p);
export const comoServico = (db, sql, p) => como(db, 'service_role', null, sql, p);
export const comoEquipe = (db, usuario, sql, p) => como(db, 'authenticated', usuario, sql, p);

export async function criarMembro(db, funcao, nome = `Pessoa ${funcao}`) {
  const { rows } = await db.query('insert into auth.users (email) values ($1) returning id', [`${funcao}-${Math.random()}@teste`]);
  const id = rows[0].id;
  if (funcao) await db.query('insert into public.equipe (user_id, nome, funcao) values ($1, $2, $3)', [id, nome, funcao]);
  return id;
}

export async function criarTurma(db, campos = {}) {
  const curso = (
    await db.query("insert into public.cursos (nome) values ('Trançando o Futuro') returning id")
  ).rows[0].id;
  const t = {
    nome: 'Turma de teste',
    vagas: 2,
    status: 'inscricoes_abertas',
    inscricoes_inicio: null,
    inscricoes_fim: null,
    idade_minima: null,
    ...campos,
  };
  const { rows } = await db.query(
    `insert into public.turmas (curso_id, nome, vagas, status, inscricoes_inicio, inscricoes_fim, idade_minima)
     values ($1, $2, $3, $4, $5, $6, $7) returning id`,
    [curso, t.nome, t.vagas, t.status, t.inscricoes_inicio, t.inscricoes_fim, t.idade_minima],
  );
  return rows[0].id;
}

export async function criarAula(db, turma, numero = 1) {
  const { rows } = await db.query(
    'insert into public.aulas (turma_id, numero, data) values ($1, $2, current_date) returning id',
    [turma, numero],
  );
  return rows[0].id;
}

let sequencia = 0;
/** Inscreve pelo caminho público (como a Edge Function faz). */
export async function inscrever(db, turma, dados = {}) {
  sequencia += 1;
  const d = {
    nome: 'Maria da Silva',
    nascimento: '1995-05-10',
    whatsapp: `(11) 9${String(10000000 + sequencia).slice(-8)}`,
    email: null,
    bairro: 'Vila Inglesa',
    disponibilidade: 'Domingos de manhã',
    consentimento: true,
    versao: '2026-10-03',
    ...dados,
  };
  const rows = await comoServico(
    db,
    'select public.inscrever_publico($1, $2, $3, $4, $5, $6, $7, $8, $9) as r',
    [turma, d.nome, d.nascimento, d.whatsapp, d.email, d.bairro, d.disponibilidade, d.consentimento, d.versao],
  );
  return { ...rows[0].r, whatsapp: d.whatsapp };
}

/** Espera que a promessa falhe com o código de negócio informado. */
export async function falhaCom(promessa, codigo) {
  try {
    await promessa;
  } catch (erro) {
    if (erro.message === codigo) return erro;
    throw new Error(`esperava ${codigo}, veio: ${erro.message}`);
  }
  throw new Error(`esperava falha ${codigo}, mas deu certo`);
}

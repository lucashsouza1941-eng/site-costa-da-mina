// Regras de inscrição, vagas, lista de espera, chamada e permissões,
// testadas no SQL real da migração (PGlite). Não depende do build.
import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import {
  criarBanco,
  criarMembro,
  criarTurma,
  criarAula,
  inscrever,
  comoPublico,
  comoServico,
  comoEquipe,
  falhaCom,
} from './apoio/banco.mjs';

let db;
let admin, coordenacao, professora, estranha;

before(async () => {
  db = await criarBanco();
  admin = await criarMembro(db, 'admin');
  coordenacao = await criarMembro(db, 'coordenacao');
  professora = await criarMembro(db, 'professora');
  estranha = await criarMembro(db, null); // conta de login sem vínculo com a equipe
});

const presencaPublica = (identificador) =>
  comoServico(db, 'select public.confirmar_presenca_publica($1) as r', [identificador]).then((r) => r[0].r);

const presencaDe = async (aula, codigo) =>
  (
    await db.query(
      'select pr.* from public.presencas pr join public.inscricoes i on i.id = pr.inscricao_id where pr.aula_id = $1 and i.codigo = $2',
      [aula, codigo],
    )
  ).rows[0];

const idInscricao = async (codigo) =>
  (await db.query('select id from public.inscricoes where codigo = $1', [codigo])).rows[0].id;

// -------------------------------------------------------------------
describe('inscrição', () => {
  test('inscrição válida é confirmada e recebe código individual', async () => {
    const turma = await criarTurma(db);
    const r = await inscrever(db, turma, { nome: '  Ana   Paula  Souza ' });
    assert.equal(r.status, 'confirmada');
    assert.match(r.codigo, /^CDM-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    const p = (await db.query("select * from public.v_inscricoes where codigo = $1", [r.codigo])).rows[0];
    assert.equal(p.nome, 'Ana Paula Souza', 'espaços normalizados');
    assert.match(p.whatsapp, /^[0-9]{11}$/, 'WhatsApp guardado só com dígitos');
    assert.ok(p.consentimento_em, 'consentimento registrado');
  });

  test('códigos são únicos', async () => {
    const turma = await criarTurma(db, { vagas: 50 });
    const codigos = new Set();
    for (let i = 0; i < 20; i++) codigos.add((await inscrever(db, turma)).codigo);
    assert.equal(codigos.size, 20);
  });

  test('sem consentimento não inscreve', async () => {
    const turma = await criarTurma(db);
    await falhaCom(inscrever(db, turma, { consentimento: false }), 'CONSENTIMENTO_OBRIGATORIO');
  });

  test('validação no servidor recusa dados inválidos', async () => {
    const turma = await criarTurma(db);
    await falhaCom(inscrever(db, turma, { nome: 'A' }), 'NOME_INVALIDO');
    await falhaCom(inscrever(db, turma, { whatsapp: '1234' }), 'WHATSAPP_INVALIDO');
    await falhaCom(inscrever(db, turma, { email: 'sem-arroba' }), 'EMAIL_INVALIDO');
    await falhaCom(inscrever(db, turma, { nascimento: '2999-01-01' }), 'NASCIMENTO_INVALIDO');
    await falhaCom(inscrever(db, turma, { bairro: '' }), 'BAIRRO_INVALIDO');
    await falhaCom(inscrever(db, turma, { disponibilidade: '  ' }), 'DISPONIBILIDADE_INVALIDA');
  });

  test('idade mínima, quando a turma define uma', async () => {
    const turma = await criarTurma(db, { idade_minima: 14 });
    const ano = new Date().getFullYear();
    await falhaCom(inscrever(db, turma, { nascimento: `${ano - 10}-01-01` }), 'IDADE_MINIMA');
    assert.equal((await inscrever(db, turma, { nascimento: `${ano - 20}-01-01` })).status, 'confirmada');
  });
});

// -------------------------------------------------------------------
describe('estados da turma', () => {
  test('só aceita inscrição com inscrições abertas', async () => {
    for (const status of ['rascunho', 'inscricoes_encerradas', 'em_andamento', 'concluida', 'cancelada']) {
      const turma = await criarTurma(db, { status });
      await falhaCom(inscrever(db, turma), 'INSCRICOES_FECHADAS');
    }
  });

  test('programada abre sozinha quando chega a data', async () => {
    const futura = await criarTurma(db, {
      status: 'inscricoes_programadas',
      inscricoes_inicio: new Date(Date.now() + 86_400_000).toISOString(),
    });
    await falhaCom(inscrever(db, futura), 'INSCRICOES_FECHADAS');

    const comecou = await criarTurma(db, {
      status: 'inscricoes_programadas',
      inscricoes_inicio: new Date(Date.now() - 60_000).toISOString(),
    });
    assert.equal((await inscrever(db, comecou)).status, 'confirmada');
  });

  test('aberta fecha sozinha quando passa o fim das inscrições', async () => {
    const turma = await criarTurma(db, {
      inscricoes_inicio: new Date(Date.now() - 2 * 86_400_000).toISOString(),
      inscricoes_fim: new Date(Date.now() - 60_000).toISOString(),
    });
    await falhaCom(inscrever(db, turma), 'INSCRICOES_FECHADAS');
  });

  test('o site público só enxerga turmas com inscrições abertas', async () => {
    const aberta = await criarTurma(db, { nome: 'Visível' });
    const rascunho = await criarTurma(db, { nome: 'Oculta', status: 'rascunho' });
    const ids = (await comoPublico(db, 'select id from public.turmas_publicas()')).map((r) => r.id);
    assert.ok(ids.includes(aberta));
    assert.ok(!ids.includes(rascunho));
  });

  test('turmas_publicas não devolve dados pessoais', async () => {
    const turma = await criarTurma(db, { vagas: 3 });
    await inscrever(db, turma);
    const linha = (await comoPublico(db, 'select * from public.turmas_publicas() where id = $1', [turma]))[0];
    assert.equal(linha.vagas_restantes, 2);
    for (const campo of ['nome', 'whatsapp', 'email', 'codigo', 'bairro']) assert.ok(!(campo in linha), campo);
  });
});

// -------------------------------------------------------------------
describe('limite de vagas e lista de espera', () => {
  test('passadas as vagas, entra na lista de espera em ordem', async () => {
    const turma = await criarTurma(db, { vagas: 2 });
    assert.equal((await inscrever(db, turma)).status, 'confirmada');
    assert.equal((await inscrever(db, turma)).status, 'confirmada');
    const e1 = await inscrever(db, turma);
    const e2 = await inscrever(db, turma);
    assert.equal(e1.status, 'lista_espera');
    assert.equal(e1.posicao_espera, 1);
    assert.equal(e2.posicao_espera, 2);
    const confirmadas = (
      await db.query("select count(*)::int as n from public.inscricoes where turma_id = $1 and status = 'confirmada'", [turma])
    ).rows[0].n;
    assert.equal(confirmadas, 2, 'nunca ultrapassa as vagas');
  });

  test('cancelar uma inscrição exige motivo e renumera a espera', async () => {
    const turma = await criarTurma(db, { vagas: 1 });
    const c = await inscrever(db, turma);
    const e1 = await inscrever(db, turma);
    const e2 = await inscrever(db, turma);
    await falhaCom(comoEquipe(db, coordenacao, 'select public.cancelar_inscricao($1, $2)', [await idInscricao(e1.codigo), '']), 'MOTIVO_OBRIGATORIO');
    await comoEquipe(db, coordenacao, 'select public.cancelar_inscricao($1, $2)', [await idInscricao(e1.codigo), 'Desistiu']);
    const pos = (await db.query('select posicao_espera from public.inscricoes where codigo = $1', [e2.codigo])).rows[0];
    assert.equal(pos.posicao_espera, 1);
    // ainda não há vaga: a confirmada continua
    await falhaCom(comoEquipe(db, coordenacao, 'select public.promover_da_espera($1)', [await idInscricao(e2.codigo)]), 'SEM_VAGA');
    await comoEquipe(db, coordenacao, 'select public.cancelar_inscricao($1, $2)', [await idInscricao(c.codigo), 'Mudou de cidade']);
    await comoEquipe(db, coordenacao, 'select public.promover_da_espera($1)', [await idInscricao(e2.codigo)]);
    const st = (await db.query('select status, posicao_espera from public.inscricoes where codigo = $1', [e2.codigo])).rows[0];
    assert.deepEqual(st, { status: 'confirmada', posicao_espera: null });
  });

  test('inscrições simultâneas não estouram as vagas', async () => {
    const turma = await criarTurma(db, { vagas: 3 });
    const resultados = await Promise.all(Array.from({ length: 8 }, () => inscrever(db, turma)));
    assert.equal(resultados.filter((r) => r.status === 'confirmada').length, 3);
    assert.equal(resultados.filter((r) => r.status === 'lista_espera').length, 5);
  });
});

// -------------------------------------------------------------------
describe('duplicidade', () => {
  test('mesmo WhatsApp, com outra formatação, não se inscreve duas vezes na turma', async () => {
    const turma = await criarTurma(db, { vagas: 10 });
    await inscrever(db, turma, { whatsapp: '(11) 98888-7777' });
    await falhaCom(inscrever(db, turma, { whatsapp: '+55 11 988887777' }), 'JA_INSCRITA');
  });

  test('a mesma pessoa pode se inscrever em outra turma', async () => {
    const a = await criarTurma(db);
    const b = await criarTurma(db);
    await inscrever(db, a, { whatsapp: '11977776666' });
    assert.equal((await inscrever(db, b, { whatsapp: '11977776666' })).status, 'confirmada');
  });

  test('formulário público não sobrescreve dados já cadastrados', async () => {
    const a = await criarTurma(db);
    const b = await criarTurma(db);
    const r = await inscrever(db, a, { whatsapp: '11966665555', nome: 'Nome Original' });
    await inscrever(db, b, { whatsapp: '11966665555', nome: 'Outra Pessoa' });
    const nome = (await db.query('select nome from public.v_inscricoes where codigo = $1', [r.codigo])).rows[0].nome;
    assert.equal(nome, 'Nome Original');
  });

  test('depois de cancelada, pode se inscrever de novo', async () => {
    const turma = await criarTurma(db);
    const r = await inscrever(db, turma, { whatsapp: '11955554444' });
    await comoEquipe(db, admin, 'select public.cancelar_inscricao($1, $2)', [await idInscricao(r.codigo), 'Teste']);
    assert.equal((await inscrever(db, turma, { whatsapp: '11955554444' })).status, 'confirmada');
  });
});

// -------------------------------------------------------------------
describe('chamada pelo QR Code', () => {
  test('com a chamada fechada, não registra nada', async () => {
    const turma = await criarTurma(db);
    await criarAula(db, turma);
    const r = await inscrever(db, turma);
    await db.query('update public.aulas set chamada_aberta_em = null, chamada_fecha_em = null');
    await falhaCom(presencaPublica(r.codigo), 'SEM_CHAMADA');
    assert.equal((await comoPublico(db, 'select public.chamada_disponivel() as d'))[0].d, false);
  });

  test('chamada aberta: confirma pelo código e pelo WhatsApp', async () => {
    const turma = await criarTurma(db, { vagas: 5 });
    const aula = await criarAula(db, turma);
    const a = await inscrever(db, turma);
    const b = await inscrever(db, turma, { whatsapp: '(11) 94444-3333' });
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aula]);
    assert.equal((await comoPublico(db, 'select public.chamada_disponivel() as d'))[0].d, true);

    const viaCodigo = await presencaPublica(a.codigo.toLowerCase().replaceAll('-', ' '));
    assert.equal(viaCodigo.confirmadas.length, 1);
    assert.equal((await presencaDe(aula, a.codigo)).metodo, 'qr_codigo');

    await presencaPublica('11 944443333');
    const pb = await presencaDe(aula, b.codigo);
    assert.equal(pb.status, 'presente');
    assert.equal(pb.metodo, 'qr_whatsapp');
    assert.equal(pb.registrado_por, null, 'registrada pela própria participante');
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aula]);
  });

  test('presença duplicada é recusada', async () => {
    const turma = await criarTurma(db);
    const aula = await criarAula(db, turma);
    const r = await inscrever(db, turma);
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aula]);
    await presencaPublica(r.codigo);
    await falhaCom(presencaPublica(r.codigo), 'JA_REGISTRADA');
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aula]);
  });

  test('quem não está inscrita na turma da chamada aberta é recusada', async () => {
    const turmaA = await criarTurma(db);
    const turmaB = await criarTurma(db);
    const aulaA = await criarAula(db, turmaA);
    const deB = await inscrever(db, turmaB);
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aulaA]);
    await falhaCom(presencaPublica(deB.codigo), 'NAO_INSCRITA');
    await falhaCom(presencaPublica('CDM-AAAA-AAAA'), 'NAO_INSCRITA');
    await falhaCom(presencaPublica('qualquer coisa'), 'IDENTIFICADOR_INVALIDO');
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aulaA]);
  });

  test('lista de espera não confirma presença', async () => {
    const turma = await criarTurma(db, { vagas: 1 });
    const aula = await criarAula(db, turma);
    await inscrever(db, turma);
    const espera = await inscrever(db, turma);
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aula]);
    await falhaCom(presencaPublica(espera.codigo), 'NAO_INSCRITA');
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aula]);
  });

  test('chamada encerrada ou vencida não aceita presença', async () => {
    const turma = await criarTurma(db);
    const aula = await criarAula(db, turma);
    const r = await inscrever(db, turma);
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aula]);
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aula]);
    await falhaCom(presencaPublica(r.codigo), 'SEM_CHAMADA');

    await db.query(
      "update public.aulas set chamada_aberta_em = now() - interval '1 hour', chamada_fecha_em = now() - interval '30 minutes', chamada_encerrada_em = null where id = $1",
      [aula],
    );
    await falhaCom(presencaPublica(r.codigo), 'SEM_CHAMADA');
  });

  test('duração da chamada é limitada e turma em rascunho não abre chamada', async () => {
    const turma = await criarTurma(db);
    const aula = await criarAula(db, turma);
    await falhaCom(comoEquipe(db, professora, 'select public.abrir_chamada($1, 1)', [aula]), 'DURACAO_INVALIDA');
    const rascunho = await criarTurma(db, { status: 'rascunho' });
    const aulaR = await criarAula(db, rascunho);
    await falhaCom(comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aulaR]), 'TURMA_SEM_AULAS');
  });
});

// -------------------------------------------------------------------
describe('chamada manual e correções', () => {
  test('a equipe marca presente, ausente, justificada e não registrado', async () => {
    const turma = await criarTurma(db, { vagas: 5 });
    const aula = await criarAula(db, turma);
    const pessoas = await Promise.all([1, 2, 3, 4].map(() => inscrever(db, turma)));
    const status = ['presente', 'ausente', 'justificada', 'nao_registrado'];
    for (const [i, p] of pessoas.entries()) {
      await comoEquipe(db, professora, 'select public.marcar_presenca($1, $2, $3)', [aula, await idInscricao(p.codigo), status[i]]);
    }
    const lista = await comoEquipe(db, professora, 'select * from public.lista_chamada($1)', [aula]);
    assert.deepEqual(lista.map((l) => l.status).sort(), [...status].sort());
    assert.ok(lista.every((l) => l.metodo === 'manual'));
  });

  test('corrigir presença do QR exige motivo e guarda data, responsável e motivo', async () => {
    const turma = await criarTurma(db);
    const aula = await criarAula(db, turma);
    const r = await inscrever(db, turma);
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aula]);
    await presencaPublica(r.codigo);
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aula]);

    const insc = await idInscricao(r.codigo);
    await falhaCom(comoEquipe(db, professora, 'select public.marcar_presenca($1, $2, $3)', [aula, insc, 'ausente']), 'MOTIVO_OBRIGATORIO');
    await comoEquipe(db, professora, 'select public.marcar_presenca($1, $2, $3, $4)', [aula, insc, 'ausente', 'Saiu antes do início']);

    const p = await presencaDe(aula, r.codigo);
    assert.equal(p.status, 'ausente');
    assert.equal(p.metodo, 'qr_codigo', 'método original preservado');
    assert.equal(p.corrigido_por, professora);
    assert.equal(p.motivo_correcao, 'Saiu antes do início');
    assert.ok(p.corrigido_em);

    const h = (
      await db.query(
        "select * from public.historico where tabela = 'presencas' and registro_id = $1 and acao = 'update' order by id desc limit 1",
        [p.id],
      )
    ).rows[0];
    assert.equal(h.autor, professora);
    assert.equal(h.motivo, 'Saiu antes do início');
    assert.equal(h.dados_antes.status, 'presente');
    assert.equal(h.dados_depois.status, 'ausente');
  });

  test('não marca presença de quem não é da turma', async () => {
    const a = await criarTurma(db);
    const b = await criarTurma(db);
    const aula = await criarAula(db, a);
    const deB = await inscrever(db, b);
    await falhaCom(
      comoEquipe(db, professora, 'select public.marcar_presenca($1, $2, $3)', [aula, await idInscricao(deB.codigo), 'presente']),
      'INSCRICAO_FORA_DA_TURMA',
    );
  });

  test('presença registrada pelo QR fica no histórico como público', async () => {
    const turma = await criarTurma(db);
    const aula = await criarAula(db, turma);
    const r = await inscrever(db, turma);
    await comoEquipe(db, professora, 'select public.abrir_chamada($1, 15)', [aula]);
    await presencaPublica(r.codigo);
    const p = await presencaDe(aula, r.codigo);
    const h = (await db.query("select * from public.historico where tabela = 'presencas' and registro_id = $1", [p.id])).rows[0];
    assert.equal(h.autor_tipo, 'publico');
    assert.equal(h.autor, null);
    await comoEquipe(db, professora, 'select public.encerrar_chamada($1)', [aula]);
  });
});

// -------------------------------------------------------------------
describe('permissões e proteção de dados', () => {
  test('o público não lê nenhuma tabela', async () => {
    for (const tabela of ['participantes', 'inscricoes', 'presencas', 'turmas', 'cursos', 'aulas', 'historico', 'equipe']) {
      await assert.rejects(comoPublico(db, `select * from public.${tabela} limit 1`), /permission denied/, tabela);
    }
    await assert.rejects(comoPublico(db, 'select * from public.v_inscricoes limit 1'), /permission denied/);
  });

  test('o público não chama as funções de gravação diretamente', async () => {
    const turma = await criarTurma(db);
    await assert.rejects(
      comoPublico(db, "select public.inscrever_publico($1, 'Ana Silva', '1990-01-01', '11999990000', null, 'Centro', 'Manhã', true, 'v1')", [turma]),
      /permission denied/,
    );
    await assert.rejects(comoPublico(db, "select public.confirmar_presenca_publica('CDM-AAAA-AAAA')"), /permission denied/);
    await assert.rejects(comoPublico(db, "select public.marcar_presenca(gen_random_uuid(), gen_random_uuid(), 'presente')"), /permission denied/);
  });

  test('conta logada sem vínculo com a equipe não vê nada nem age', async () => {
    await criarTurma(db);
    assert.equal((await comoEquipe(db, estranha, 'select * from public.turmas')).length, 0);
    assert.equal((await comoEquipe(db, estranha, 'select * from public.participantes')).length, 0);
    const aula = await criarAula(db, await criarTurma(db));
    await falhaCom(comoEquipe(db, estranha, 'select public.abrir_chamada($1, 15)', [aula]), 'SEM_PERMISSAO');
  });

  test('professora vê a lista de chamada, mas não WhatsApp e e-mail', async () => {
    const turma = await criarTurma(db);
    const aula = await criarAula(db, turma);
    await inscrever(db, turma, { email: 'aluna@exemplo.org' });
    assert.equal((await comoEquipe(db, professora, 'select * from public.participantes')).length, 0);
    assert.equal((await comoEquipe(db, professora, 'select * from public.v_inscricoes')).length, 0);
    const lista = await comoEquipe(db, professora, 'select * from public.lista_chamada($1)', [aula]);
    assert.equal(lista.length, 1);
    assert.ok(!('whatsapp' in lista[0]) && !('email' in lista[0]));
    await falhaCom(
      comoEquipe(db, professora, "select public.cancelar_inscricao($1, 'x')", [lista[0].inscricao_id]),
      'SEM_PERMISSAO',
    );
  });

  test('coordenação vê participantes; professora não cria turma', async () => {
    const turma = await criarTurma(db);
    await inscrever(db, turma);
    assert.ok((await comoEquipe(db, coordenacao, 'select * from public.v_inscricoes where turma_id = $1', [turma])).length > 0);
    const curso = (await db.query('select curso_id from public.turmas where id = $1', [turma])).rows[0].curso_id;
    await assert.rejects(
      comoEquipe(db, professora, "insert into public.turmas (curso_id, nome, vagas) values ($1, 'X', 5)", [curso]),
      /row-level security/,
    );
    await comoEquipe(db, coordenacao, "insert into public.turmas (curso_id, nome, vagas) values ($1, 'Nova', 5)", [curso]);
  });

  test('alterações da equipe vão para o histórico com autor', async () => {
    const turma = await criarTurma(db);
    await comoEquipe(db, coordenacao, "update public.turmas set vagas = 12 where id = $1", [turma]);
    const h = (
      await db.query("select * from public.historico where tabela = 'turmas' and registro_id = $1 and acao = 'update'", [turma])
    ).rows[0];
    assert.equal(h.autor, coordenacao);
    assert.equal(h.autor_tipo, 'equipe');
    assert.equal(h.dados_depois.vagas, 12);
  });

  test('a equipe altera a inscrição informando motivo', async () => {
    const turma = await criarTurma(db);
    const r = await inscrever(db, turma, { nome: 'Nome Errado' });
    const id = await idInscricao(r.codigo);
    await comoEquipe(
      db,
      coordenacao,
      'select public.alterar_inscricao($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, 'Nome Certo', '1990-02-02', '11933332222', 'certo@exemplo.org', 'Cidade Ademar', 'Tarde', 'Pedido da participante'],
    );
    const v = (await db.query('select nome, whatsapp, email from public.v_inscricoes where id = $1', [id])).rows[0];
    assert.deepEqual(v, { nome: 'Nome Certo', whatsapp: '11933332222', email: 'certo@exemplo.org' });
  });

  test('anonimização (LGPD) apaga dados pessoais e limpa o histórico', async () => {
    const turma = await criarTurma(db);
    const r = await inscrever(db, turma, { nome: 'Pessoa Para Apagar', email: 'apagar@exemplo.org' });
    const part = (await db.query('select participante_id from public.v_inscricoes where codigo = $1', [r.codigo])).rows[0].participante_id;
    await falhaCom(comoEquipe(db, coordenacao, "select public.anonimizar_participante($1, 'pedido')", [part]), 'SEM_PERMISSAO');
    await comoEquipe(db, admin, "select public.anonimizar_participante($1, 'Pedido de exclusão da titular')", [part]);
    const p = (await db.query('select * from public.participantes where id = $1', [part])).rows[0];
    assert.equal(p.nome, 'Participante anonimizada');
    assert.equal(p.email, null);
    assert.ok(p.whatsapp.startsWith('anon-'));
    const vazou = (
      await db.query("select count(*)::int as n from public.historico where (dados_antes::text || dados_depois::text) like '%apagar@exemplo.org%'")
    ).rows[0].n;
    assert.equal(vazou, 0);
  });

  test('contagem por turma sem dados pessoais, inclusive para a professora', async () => {
    const turma = await criarTurma(db, { vagas: 1 });
    await inscrever(db, turma);
    await inscrever(db, turma);
    const c = (await comoEquipe(db, professora, 'select * from public.contagem_turmas() where turma_id = $1', [turma]))[0];
    assert.deepEqual({ confirmadas: c.confirmadas, lista_espera: c.lista_espera }, { confirmadas: 1, lista_espera: 1 });
    await falhaCom(comoEquipe(db, estranha, 'select * from public.contagem_turmas()'), 'SEM_PERMISSAO');
  });

  test('só a administração adiciona pessoas à equipe', async () => {
    await db.query("insert into auth.users (email) values ('nova.professora@teste')");
    await falhaCom(
      comoEquipe(db, coordenacao, "select public.adicionar_membro('nova.professora@teste', 'Nova', 'professora')"),
      'SEM_PERMISSAO',
    );
    await comoEquipe(db, admin, "select public.adicionar_membro('Nova.Professora@teste', 'Nova', 'professora')");
    const m = (await db.query("select e.funcao from public.equipe e join auth.users u on u.id = e.user_id where u.email = 'nova.professora@teste'")).rows[0];
    assert.equal(m.funcao, 'professora');
    await falhaCom(comoEquipe(db, admin, "select public.adicionar_membro('ninguem@teste', 'X', 'admin')"), 'CONTA_INEXISTENTE');
  });

  test('turma com inscrições não pode ser excluída', async () => {
    const turma = await criarTurma(db, { status: 'rascunho' });
    await db.query("insert into public.participantes (nome, data_nascimento, whatsapp, bairro, consentimento_em, consentimento_versao) values ('Teste Exclusão', '1990-01-01', '11900001111', 'Centro', now(), 'v') ");
    await db.query("insert into public.inscricoes (turma_id, participante_id, codigo, status, disponibilidade) select $1, id, 'CDM-TTTT-TTTT', 'confirmada', 'x' from public.participantes where whatsapp = '11900001111'", [turma]);
    await comoEquipe(db, coordenacao, 'delete from public.turmas where id = $1', [turma]);
    assert.equal((await db.query('select count(*)::int as n from public.turmas where id = $1', [turma])).rows[0].n, 1);
    const vazia = await criarTurma(db, { status: 'rascunho' });
    await comoEquipe(db, coordenacao, 'delete from public.turmas where id = $1', [vazia]);
    assert.equal((await db.query('select count(*)::int as n from public.turmas where id = $1', [vazia])).rows[0].n, 0);
  });

  test('limite de tentativas das Edge Functions', async () => {
    const tentar = () => comoServico(db, "select public.registrar_tentativa('teste', 'hash-ip', 3, 600) as ok").then((r) => r[0].ok);
    assert.deepEqual([await tentar(), await tentar(), await tentar(), await tentar()], [true, true, true, false]);
    await assert.rejects(comoPublico(db, "select public.registrar_tentativa('teste', 'x', 3, 600)"), /permission denied/);
  });
});

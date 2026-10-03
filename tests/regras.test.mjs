// Regras compartilhadas entre formulário e Edge Functions.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarInscricao,
  normalizarWhatsapp,
  normalizarCodigo,
  pareceRobo,
  celulaCsv,
  gerarCsv,
  statusHttp,
  mensagemDe,
} from '../supabase/functions/_compartilhado/regras.ts';

const valido = {
  turma: '1b4e28ba-2fa1-11d2-883f-0016d3cca427',
  nome: 'Maria da Silva',
  nascimento: '1995-05-10',
  whatsapp: '(11) 98765-4321',
  email: '',
  bairro: 'Vila Inglesa',
  disponibilidade: 'Domingos de manhã',
  consentimento: true,
};

test('inscrição válida passa e normaliza espaços', () => {
  const r = validarInscricao({ ...valido, nome: '  Maria   da Silva ' });
  assert.equal(r.ok, true);
  assert.equal(r.dados.nome, 'Maria da Silva');
  assert.equal(r.dados.email, null, 'e-mail vazio vira null (é opcional)');
});

test('cada campo obrigatório tem mensagem própria', () => {
  const r = validarInscricao({ turma: 'x', nome: '', nascimento: '31/02/2000', whatsapp: '123', bairro: '', disponibilidade: '', consentimento: false, email: 'a@' });
  assert.equal(r.ok, false);
  for (const campo of ['turma', 'nome', 'nascimento', 'whatsapp', 'email', 'bairro', 'disponibilidade', 'consentimento']) {
    assert.ok(r.erros[campo], `faltou erro em ${campo}`);
  }
});

test('data de nascimento: recusa futura e inexistente', () => {
  assert.equal(validarInscricao({ ...valido, nascimento: '2999-01-01' }).ok, false);
  assert.equal(validarInscricao({ ...valido, nascimento: '2001-02-30' }).ok, false);
});

test('não pede CPF nem RG', () => {
  const r = validarInscricao({ ...valido, cpf: '123', rg: '456' });
  assert.equal(r.ok, true);
  assert.ok(!('cpf' in r.dados) && !('rg' in r.dados), 'campos extras são descartados');
});

test('WhatsApp: aceita formatos comuns e tira o 55', () => {
  assert.equal(normalizarWhatsapp('(11) 98765-4321'), '11987654321');
  assert.equal(normalizarWhatsapp('+55 11 98765 4321'), '11987654321');
  assert.equal(normalizarWhatsapp('1132345678'), '1132345678');
  assert.equal(normalizarWhatsapp('98765-4321'), null, 'sem DDD');
});

test('código: aceita minúsculas, espaços e sem prefixo', () => {
  assert.equal(normalizarCodigo('cdm-abcd-efgh'), 'CDM-ABCD-EFGH');
  assert.equal(normalizarCodigo('ABCD EFGH'), 'CDM-ABCD-EFGH');
  assert.equal(normalizarCodigo('11987654321'), null);
});

test('proteção contra robôs: armadilha e tempo mínimo', () => {
  const agora = 1_000_000;
  assert.equal(pareceRobo({ site: '', iniciado_em: agora - 10_000 }, agora), false);
  assert.equal(pareceRobo({ site: 'http://spam', iniciado_em: agora - 10_000 }, agora), true);
  assert.equal(pareceRobo({ site: '', iniciado_em: agora - 500 }, agora), true);
  assert.equal(pareceRobo({ site: '' }, agora), true);
});

test('CSV: neutraliza fórmulas e escapa separadores', () => {
  assert.equal(celulaCsv('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
  assert.equal(celulaCsv('+5511'), "'+5511");
  assert.equal(celulaCsv('a;b'), '"a;b"');
  assert.equal(celulaCsv(null), '');
  const csv = gerarCsv([{ chave: 'n', titulo: 'Nome' }], [{ n: 'Ana' }]);
  assert.ok(csv.startsWith('﻿Nome\r\nAna'));
});

test('erros têm mensagem e status HTTP coerentes', () => {
  assert.equal(statusHttp('MUITAS_TENTATIVAS'), 429);
  assert.equal(statusHttp('JA_INSCRITA'), 409);
  assert.equal(statusHttp('CAPTCHA'), 403);
  assert.equal(statusHttp('ALGO_DESCONHECIDO'), 500);
  assert.match(mensagemDe('SEM_CHAMADA'), /chamada/);
  assert.equal(mensagemDe('XYZ'), mensagemDe('INDISPONIVEL'));
});

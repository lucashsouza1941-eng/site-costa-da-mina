// Fluxo do módulo de cursos no navegador, contra o Supabase falso
// (tests/apoio/supabase-falso.mjs). Rodado por: npm run e2e:cursos
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { prepararAmbiente, esperar, esperarHidratacao } from '../e2e/apoio.mjs';

const SUPABASE = 'http://localhost:54321';
let amb;
let codigo;

before(async () => {
  amb = await prepararAmbiente();
});
after(async () => {
  await amb?.encerrar();
});

async function preencher(p, dados) {
  await esperar(3200); // tempo mínimo da proteção contra robôs
  await p.evaluate((d) => {
    const f = document.querySelector('[data-form]');
    for (const [id, v] of Object.entries(d)) f.querySelector('#' + id).value = v;
    f.querySelector('#consentimento').checked = true;
  }, dados);
  await p.click('[data-enviar]');
  await esperar(1200);
}

const dadosBase = { nome: 'Joana Teste Silva', nascimento: '1990-06-01', whatsapp: '(11) 96666-1234', bairro: 'Cidade Ademar', disponibilidade: 'Sábados à tarde' };

test('com turma aberta, o link "Cursos" aparece no cabeçalho', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/', { waitUntil: 'networkidle0' });
  await p.waitForFunction(() => [...document.querySelectorAll('nav[aria-label="Principal"] [data-link-cursos]')].some((li) => !li.hidden), { timeout: 10000 });
  await p.close();
});

test('inscrição válida mostra a confirmação com código e recebe o foco', async () => {
  const p = await amb.novaPagina({ largura: 375 });
  await p.goto(amb.url + '/cursos/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-form]:not([hidden])');
  await preencher(p, dadosBase);
  const r = await p.evaluate(() => {
    const c = document.querySelector('[data-confirmacao]');
    return { visivel: !c.hidden, focado: document.activeElement === c, texto: c.textContent };
  });
  assert.ok(r.visivel && r.focado, 'confirmação visível e com foco');
  codigo = r.texto.match(/CDM-[A-Z0-9]{4}-[A-Z0-9]{4}/)?.[0];
  assert.ok(codigo, 'código individual');
  await p.close();
});

test('erros de preenchimento: resumo com links e campos marcados', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/cursos/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-form]:not([hidden])');
  await p.click('[data-enviar]');
  await esperar(300);
  const r = await p.evaluate(() => ({
    resumo: document.querySelector('[data-resumo-erros]').textContent,
    focoNoResumo: document.activeElement.hasAttribute('data-resumo-erros'),
    invalidos: [...document.querySelectorAll('[aria-invalid="true"]')].map((e) => e.id).filter(Boolean),
  }));
  assert.ok(r.focoNoResumo);
  assert.match(r.resumo, /Corrija \d+ campos/);
  for (const id of ['nome', 'nascimento', 'whatsapp', 'bairro', 'disponibilidade', 'consentimento']) assert.ok(r.invalidos.includes(id), id);
  await p.close();
});

test('o mesmo WhatsApp não se inscreve duas vezes na turma', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/cursos/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-form]:not([hidden])');
  await preencher(p, { ...dadosBase, nome: 'Outra Pessoa', whatsapp: '+55 11 966661234' });
  assert.match(await p.$eval('[data-resumo-erros]', (e) => e.textContent), /já tem uma inscrição/);
  await p.close();
});

test('turma cheia: nova inscrição entra na lista de espera', async () => {
  await fetch(`${SUPABASE}/dev/lotar`);
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/cursos/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-form]:not([hidden])');
  await preencher(p, { ...dadosBase, nome: 'Pessoa da Espera', whatsapp: '(11) 95555-0000' });
  assert.match(await p.$eval('[data-confirmacao]', (e) => e.textContent), /lista de espera \(posição 1\)/);
  await p.close();
});

test('presença: sem chamada aberta não registra; com chamada, confirma e recusa duplicada', async () => {
  const p = await amb.novaPagina({ largura: 375 });
  await fetch(`${SUPABASE}/dev/fechar-chamada`);
  await p.goto(amb.url + '/presenca/', { waitUntil: 'networkidle0' });
  await p.waitForFunction(() => document.querySelector('[data-estado]').textContent.includes('Não existe chamada'));
  assert.equal(await p.$eval('[data-form]', (f) => f.hidden), true);

  await fetch(`${SUPABASE}/dev/abrir-chamada`);
  await p.click('[data-atualizar]');
  await p.waitForSelector('[data-form]:not([hidden])');
  await p.type('#identificador', codigo.toLowerCase().replaceAll('-', ' '));
  await p.click('[data-form] button[type="submit"]');
  await p.waitForFunction(() => document.querySelector('[data-resultado]').textContent.includes('Presença registrada'));

  await p.goto(amb.url + '/presenca/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-form]:not([hidden])');
  await p.type('#identificador', '11 96666-1234');
  await p.click('[data-form] button[type="submit"]');
  await p.waitForFunction(() => document.querySelector('[data-resultado]').textContent.includes('já estava registrada'));
  await fetch(`${SUPABASE}/dev/fechar-chamada`);
  await p.close();
});

test('lista de espera não confirma presença', async () => {
  await fetch(`${SUPABASE}/dev/abrir-chamada`);
  const p = await amb.novaPagina({ largura: 375 });
  await p.goto(amb.url + '/presenca/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-form]:not([hidden])');
  await p.type('#identificador', '(11) 95555-0000');
  await p.click('[data-form] button[type="submit"]');
  await p.waitForFunction(() => document.querySelector('[data-resultado]').textContent.includes('Não encontramos uma inscrição confirmada'));
  await fetch(`${SUPABASE}/dev/fechar-chamada`);
  await p.close();
});

test('formulário volta a funcionar depois de navegar para fora e retornar', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/cursos/', { waitUntil: 'networkidle0' });
  await esperarHidratacao(p);
  await p.click('header a[aria-label="Instituto Costa da Mina, página inicial"]');
  await p.waitForFunction(() => location.pathname.endsWith('/') && !location.pathname.includes('cursos'));
  await p.waitForFunction(() => [...document.querySelectorAll('nav[aria-label="Principal"] [data-link-cursos]')].some((li) => !li.hidden));
  await p.click('nav[aria-label="Principal"] [data-link-cursos] a');
  await p.waitForSelector('[data-form]:not([hidden])', { timeout: 10000 });
  await p.close();
});

test('painel mostra o login (sem dados antes de entrar)', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/painel/', { waitUntil: 'networkidle0' });
  await p.waitForSelector('[data-login]:not([hidden])');
  assert.equal(await p.$eval('[data-app]', (e) => e.hidden), true);
  await p.close();
});

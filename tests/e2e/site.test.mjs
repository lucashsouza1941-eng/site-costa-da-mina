// Testes de ponta a ponta no navegador real, sobre o site exportado (out/).
// Rode depois do build: npm run build && npm run e2e
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { prepararAmbiente, rolarTudo, esperar, esperarHidratacao, PAGINAS } from './apoio.mjs';

const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
let amb;

before(async () => {
  amb = await prepararAmbiente();
});
after(async () => {
  await amb?.encerrar();
});

test('todas as páginas abrem sem erro de console, 404 ou imagem quebrada', async () => {
  const problemas = [];
  for (const caminho of PAGINAS) {
    const p = await amb.novaPagina({ largura: 1280 });
    const resposta = await p.goto(amb.url + caminho, { waitUntil: 'networkidle0' });
    if (resposta.status() !== 200) problemas.push(`${caminho}: HTTP ${resposta.status()}`);
    await rolarTudo(p);
    await esperar(400);
    const quebradas = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc));
    for (const q of quebradas) problemas.push(`${caminho}: imagem quebrada ${q}`);
    for (const e of p.erros) problemas.push(`${caminho}: ${e}`);
    await p.close();
  }
  assert.deepEqual(problemas, []);
});

test('nenhuma rolagem lateral em 320, 375, 768, 1024 e 1440 px', async () => {
  const problemas = [];
  for (const largura of [320, 375, 768, 1024, 1440]) {
    const p = await amb.novaPagina({ largura });
    for (const caminho of PAGINAS) {
      await p.goto(amb.url + caminho, { waitUntil: 'networkidle0' });
      const { sw, vw } = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
      if (sw > vw) problemas.push(`${largura}px ${caminho}: ${sw} > ${vw}`);
    }
    await p.close();
  }
  assert.deepEqual(problemas, []);
});

test('acessibilidade: nenhuma violação WCAG 2.1 AA (axe-core) no desktop e no celular', async () => {
  const violacoes = [];
  for (const largura of [1280, 375]) {
    const p = await amb.novaPagina({ largura });
    for (const caminho of PAGINAS) {
      await p.goto(amb.url + caminho, { waitUntil: 'networkidle0' });
      await p.evaluate(axe);
      const r = await p.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations);
      for (const v of r) violacoes.push(`${largura}px ${caminho}: ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target.join(' ')}`);
    }
    await p.close();
  }
  assert.deepEqual(violacoes, []);
});

test('teclado: link "Pular para o conteúdo" é o primeiro Tab e aparece', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/', { waitUntil: 'networkidle0' });
  await p.keyboard.press('Tab');
  const r = await p.evaluate(() => ({ texto: document.activeElement.textContent, topo: document.activeElement.getBoundingClientRect().top }));
  assert.equal(r.texto, 'Pular para o conteúdo');
  assert.ok(r.topo >= 0, 'visível ao receber foco');
  await p.close();
});

test('menu do celular: abre com foco no fechar, lista as páginas, Esc fecha e devolve o foco', async () => {
  const p = await amb.novaPagina({ largura: 375 });
  await p.goto(amb.url + '/', { waitUntil: 'networkidle0' });
  await esperarHidratacao(p);
  await p.focus('button[aria-label="Abrir menu"]');
  await p.keyboard.press('Enter');
  await esperar(250);
  const aberto = await p.evaluate(() => {
    const d = [...document.querySelectorAll('dialog')].find((x) => x.open);
    return d && { foco: document.activeElement.getAttribute('aria-label'), itens: [...d.querySelectorAll('nav a')].map((a) => a.textContent) };
  });
  assert.ok(aberto, 'menu aberto');
  assert.equal(aberto.foco, 'Fechar menu');
  assert.deepEqual(aberto.itens.slice(0, 9), ['Início', 'Instituto', 'Projetos', 'Impacto', 'Agenda', 'Notícias', 'Galeria', 'Apoie', 'Contato']);
  await p.keyboard.press('Escape');
  await esperar(250);
  const depois = await p.evaluate(() => ({ algumAberto: [...document.querySelectorAll('dialog')].some((d) => d.open), foco: document.activeElement.getAttribute('aria-label') }));
  assert.equal(depois.algumAberto, false);
  assert.equal(depois.foco, 'Abrir menu');
  await p.close();
});

test('busca: encontra projeto ignorando acentos e leva até a página', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/', { waitUntil: 'networkidle0' });
  await esperarHidratacao(p);
  await p.click('header button[aria-label="Buscar no site"]');
  await esperar(200);
  await p.keyboard.type('tranca amiga');
  await esperar(200);
  const link = await p.$('dialog[open] a[href$="/projetos/tranca-amiga/"]');
  assert.ok(link, 'resultado "Trança Amiga"');
  await Promise.all([p.waitForFunction(() => location.pathname.endsWith('/projetos/tranca-amiga/')), link.click()]);
  const h1 = await p.$eval('h1', (e) => e.textContent);
  assert.match(h1, /Trança Amiga/);
  await p.close();
});

test('galeria: filtro, ampliação pelo teclado, setas, Esc e retorno do foco', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(amb.url + '/galeria/', { waitUntil: 'networkidle0' });
  await esperarHidratacao(p);
  const total = await p.$$eval('[aria-label^="Ampliar foto"]', (b) => b.length);
  const [filtro] = await p.$$('[aria-label="Filtrar fotos"] button[aria-pressed="false"]');
  await filtro.click();
  await esperar(150);
  const filtradas = await p.$$eval('[aria-label^="Ampliar foto"]', (b) => b.length);
  assert.ok(filtradas > 0 && filtradas < total, 'o filtro reduz a lista');
  const primeira = await p.$('[aria-label^="Ampliar foto"]');
  const rotulo = await primeira.evaluate((b) => b.getAttribute('aria-label'));
  await primeira.focus();
  await p.keyboard.press('Enter');
  await esperar(250);
  const legenda = () => p.evaluate(() => document.querySelector('dialog[open] figcaption')?.textContent);
  const l1 = await legenda();
  assert.ok(l1, 'ampliação aberta');
  if (filtradas > 1) {
    await p.keyboard.press('ArrowRight');
    await esperar(200);
    assert.notEqual(await legenda(), l1, 'seta troca a foto');
  }
  await p.keyboard.press('Escape');
  await esperar(200);
  assert.equal(await p.evaluate(() => document.activeElement.getAttribute('aria-label')), rotulo, 'foco volta para a foto');
  await p.close();
});

test('navegação interna: cards levam às páginas dos projetos e a trilha volta', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/', { waitUntil: 'networkidle0' });
  await esperarHidratacao(p);
  await p.click('#projetos a[href$="/projetos/beco-da-mina/"]');
  await p.waitForFunction(() => document.querySelector('h1')?.textContent.includes('Beco da Mina'), { timeout: 15000 });
  await esperarHidratacao(p);
  await p.click('nav[aria-label="Você está em"] a[href$="/projetos/"]');
  await p.waitForFunction(() => document.querySelector('h1')?.textContent.includes('Iniciativas'), { timeout: 15000 });
  assert.ok((await p.evaluate(() => location.pathname)).endsWith('/projetos/'));
  assert.deepEqual(p.erros, []);
  await p.close();
});

test('módulo de cursos sem configuração: tudo oculto e avisos honestos', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  await p.goto(amb.url + '/', { waitUntil: 'networkidle0' });
  const linkCursosVisivel = await p.evaluate(() => [...document.querySelectorAll('a[href$="/cursos/"]')].some((a) => a.offsetParent !== null));
  assert.equal(linkCursosVisivel, false, 'nenhum link visível para /cursos/');
  await p.goto(amb.url + '/cursos/', { waitUntil: 'networkidle0' });
  assert.match(await p.$eval('[data-estado]', (e) => e.textContent), /Nenhuma inscrição aberta/);
  await p.goto(amb.url + '/presenca/', { waitUntil: 'networkidle0' });
  assert.match(await p.$eval('[data-estado]', (e) => e.textContent), /Não existe chamada disponível/);
  await p.close();
});

test('página inexistente mostra o 404 do site', async () => {
  const p = await amb.novaPagina({ largura: 1280 });
  const r = await p.goto(amb.url + '/nao-existe/', { waitUntil: 'networkidle0' });
  assert.equal(r.status(), 404);
  assert.match(await p.$eval('h1', (e) => e.textContent), /não existe/i);
  await p.close();
});

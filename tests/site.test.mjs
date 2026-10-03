// Verificações do site gerado. Rode depois do build: npm run build && npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
assert.ok(existsSync(dist), 'Rode `npm run build` antes dos testes.');

function htmls(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return htmls(caminho);
    return nome.endsWith('.html') ? [caminho] : [];
  });
}

const paginas = htmls(dist).map((caminho) => ({
  nome: relative(dist, caminho).replaceAll('\\', '/'),
  html: readFileSync(caminho, 'utf8'),
}));

test('gera todas as páginas previstas', () => {
  const nomes = paginas.map((p) => p.nome).sort();
  for (const esperado of [
    'index.html',
    'sobre/index.html',
    'projetos/index.html',
    'projetos/beco-da-mina/index.html',
    'projetos/trancando-o-futuro/index.html',
    'projetos/tranca-amiga/index.html',
    'projetos/sarau-trancado/index.html',
    'contribua/index.html',
    'contato/index.html',
    'privacidade/index.html',
    '404.html',
  ]) {
    assert.ok(nomes.includes(esperado), `faltou ${esperado}`);
  }
});

for (const { nome, html } of paginas) {
  test(`${nome}: estrutura e acessibilidade básicas`, () => {
    assert.match(html, /<html lang="pt-BR"/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, 'deve ter exatamente um h1');
    assert.match(html, /href="#conteudo"/, 'link para pular ao conteúdo');
    const imagens = html.match(/<img\b[^>]*>/g) ?? [];
    // alt vazio (imagem decorativa) sai como atributo sem valor
    for (const img of imagens) assert.match(img, /\salt(=|\s|>)/, `imagem sem alt: ${img.slice(0, 80)}`);
  });

  test(`${nome}: nenhuma pendência vaza para produção`, () => {
    assert.doesNotMatch(html, /data-pendente/);
    assert.doesNotMatch(html, /Pendente ·/);
  });

  test(`${nome}: não depende do WordPress antigo`, () => {
    assert.doesNotMatch(html, /wp-content|wp-json|elementor/i);
  });

  test(`${nome}: endereço temporário fica fora dos buscadores`, () => {
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  });

  test(`${nome}: contatos oficiais no rodapé`, () => {
    assert.match(html, /contato\.costadamina@gmail\.com/);
    assert.match(html, /wa\.me\/5511958581395/);
    assert.match(html, /62\.212\.632\/0001-76/);
    assert.match(html, /instagram\.com\/instituto\.costadamina/);
  });
}

test('links internos apontam para páginas que existem', () => {
  const base = (process.env.BASE_PATH ?? '/').replace(/\/$/, '');
  const quebrados = new Set();
  for (const { nome, html } of paginas) {
    for (const [, href] of html.matchAll(/href="([^"#?]+)[^"]*"/g)) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const semBase = href.slice(base.length) || '/';
      const alvo = join(dist, semBase.endsWith('/') ? `${semBase}index.html` : semBase);
      if (!existsSync(alvo)) quebrados.add(`${nome} → ${href}`);
    }
  }
  assert.deepEqual([...quebrados], []);
});

test('chave PIX e botão de copiar na página Contribua', () => {
  const pagina = paginas.find((p) => p.nome === 'contribua/index.html');
  assert.match(pagina.html, /data-copiar="62\.212\.632\/0001-76"/);
});

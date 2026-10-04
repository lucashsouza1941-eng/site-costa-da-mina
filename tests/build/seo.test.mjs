// SEO e metadados do site exportado (Fase 7).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../../out/', import.meta.url));
const paginas = [];
(function varrer(dir) {
  for (const nome of readdirSync(dir)) {
    const c = join(dir, nome);
    if (statSync(c).isDirectory()) varrer(c);
    else if (nome === 'index.html') paginas.push({ nome: relative(out, c).split(sep).join('/'), html: readFileSync(c, 'utf8') });
  }
})(out);
const publicas = paginas.filter((p) => !/^(404|_not-found|noticias\/em-breve)\//.test(p.nome));

const jsonLds = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

for (const { nome, html } of publicas) {
  test(`${nome}: metadados de busca e compartilhamento`, () => {
    assert.match(html, /<meta name="description" content="[^"]{40,}"/, 'descrição');
    assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+\/"/, 'canonical absoluto');
    assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+opengraph-image\.jpg"/, 'og:image em JPEG');
    assert.match(html, /<meta property="og:title" content="[^"]+"/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
    assert.match(html, /<link rel="icon" href="[^"]*favicon\.ico/);
    assert.match(html, /<link rel="manifest"/);
  });

  test(`${nome}: dados estruturados válidos`, () => {
    const dados = jsonLds(html);
    assert.ok(dados.some((d) => d['@type'] === 'NGO' && d.name === 'Instituto Costa da Mina'), 'Organization (NGO)');
    // o painel (área restrita) não tem trilha de navegação
    if (nome !== 'index.html' && nome !== 'painel/index.html') {
      const trilha = dados.find((d) => d['@type'] === 'BreadcrumbList');
      assert.ok(trilha, 'BreadcrumbList');
      assert.equal(trilha.itemListElement[0].name, 'Início');
    }
  });
}

test('a URL do site em canonical não duplica o caminho base', () => {
  for (const { nome, html } of publicas) {
    const url = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
    assert.doesNotMatch(url, /(\/[^/]+\/)\1/, `${nome}: ${url}`);
  }
});

test('títulos únicos e descritivos', () => {
  const titulos = publicas.map((p) => p.html.match(/<title>([^<]+)<\/title>/)[1]);
  const repetidos = titulos.filter((t, i) => titulos.indexOf(t) !== i);
  assert.deepEqual(repetidos, []);
});

test('arquivos de ícone, manifest e imagem de compartilhamento publicados', () => {
  for (const f of ['favicon.ico', 'icon.png', 'apple-icon.png', 'opengraph-image.jpg', 'manifest.webmanifest']) {
    assert.ok(existsSync(join(out, f)), f);
  }
  const manifest = JSON.parse(readFileSync(join(out, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.lang, 'pt-BR');
  assert.ok(manifest.icons.length > 0);
});

test('sitemap com URLs absolutas e só páginas públicas', () => {
  const xml = readFileSync(join(out, 'sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(urls.length >= 14, `poucas URLs: ${urls.length}`);
  for (const u of urls) {
    assert.match(u, /^https:\/\//);
    assert.doesNotMatch(u, /\/(cursos|presenca|painel|design-system)\/|em-breve/);
  }
});

test('segmentos de prefetch com o nome que o navegador pede', () => {
  const faltando = [];
  (function varrer(dir) {
    for (const nome of readdirSync(dir)) {
      const c = join(dir, nome);
      if (!statSync(c).isDirectory() || nome === '_next') continue;
      if (nome.startsWith('__next.')) {
        (function dentro(d) {
          for (const n of readdirSync(d)) {
            const a = join(d, n);
            if (statSync(a).isDirectory()) dentro(a);
            else if (!existsSync(join(dir, relative(dir, a).split(sep).join('.')))) faltando.push(relative(out, a));
          }
        })(c);
      } else varrer(c);
    }
  })(out);
  assert.deepEqual(faltando, []);
});

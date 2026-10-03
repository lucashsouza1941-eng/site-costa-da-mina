// Verifica o site exportado (out/). Rode depois de `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../../out/', import.meta.url));
assert.ok(existsSync(out), 'Rode `npm run build` antes.');

const arquivos = [];
(function varrer(dir) {
  for (const nome of readdirSync(dir)) {
    const c = join(dir, nome);
    if (statSync(c).isDirectory()) varrer(c);
    else arquivos.push(c);
  }
})(out);
const html = arquivos.filter((a) => a.endsWith('.html')).map((a) => ({ nome: relative(out, a).split(sep).join('/'), conteudo: readFileSync(a, 'utf8') }));
const textos = arquivos.filter((a) => /\.(html|js|css|txt|xml|json)$/.test(a));

for (const { nome, conteudo } of html) {
  test(`${nome}: idioma, título e noindex`, () => {
    assert.match(conteudo, /<html[^>]*lang="pt-BR"/);
    assert.match(conteudo, /<title>[^<]+<\/title>/);
    assert.match(conteudo, /<meta name="robots" content="noindex, nofollow"/);
  });

  test(`${nome}: nada de desenvolvimento em produção`, () => {
    assert.doesNotMatch(conteudo, /data-placeholder|data-pendente|\[Exemplo\]/);
  });
}

test('robots.txt bloqueia buscadores no endereço temporário', () => {
  assert.match(readFileSync(join(out, 'robots.txt'), 'utf8'), /Disallow: \//);
});

test('vitrine do design system não é publicada', () => {
  assert.ok(!existsSync(join(out, 'design-system')));
});

test('nenhum segredo e nenhuma imagem carregada do site antigo', () => {
  for (const arquivo of textos) {
    const c = readFileSync(arquivo, 'utf8');
    const nome = relative(out, arquivo);
    assert.doesNotMatch(c, /sb_secret_[A-Za-z0-9_-]{8,}|SUPABASE_SERVICE_ROLE_KEY|TURNSTILE_SECRET_KEY|SAL_TENTATIVAS/, nome);
    assert.doesNotMatch(c, /institutocostadamina\.com\.br\/wp-content/, `${nome}: hotlink do site antigo`);
  }
});

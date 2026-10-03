// Home exportada: cabeçalho e hero (Fase 3).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const html = readFileSync(fileURLToPath(new URL('../../out/index.html', import.meta.url)), 'utf8');
const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

test('cabeçalho: logo com nome acessível, menu completo e "Doe agora"', () => {
  assert.match(html, /<header[\s>]/);
  assert.match(html, /aria-label="Instituto Costa da Mina, página inicial"/);
  const nav = html.match(/<nav aria-label="Principal"[\s\S]*?<\/nav>/)?.[0] ?? '';
  const itens = [...nav.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map((m) => m[1]);
  assert.deepEqual(itens, ['Início', 'Instituto', 'Projetos', 'Impacto', 'Agenda', 'Notícias', 'Galeria', 'Apoie', 'Contato']);
  assert.match(nav, /aria-current="page"[^>]*>Início|>Início<\/a>/);
  assert.match(html, new RegExp(`href="${base}/apoie/"[^>]*>Doe agora`));
});

test('cabeçalho: busca e menu do celular acessíveis', () => {
  assert.match(html, /aria-label="Buscar no site"/);
  assert.match(html, /aria-label="Abrir menu"/);
  assert.match(html, /aria-haspopup="dialog"/);
});

test('hero: um único h1 com o título aprovado', () => {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(h1, 'Cultura, educação e oportunidades para um futuro mais justo.');
  assert.match(html, /Raízes que educam,/);
  assert.match(html, /cultura que transforma\./);
  assert.match(html, /Cidade Ademar/);
});

test('hero: botões levam ao Instituto e ao Apoie', () => {
  assert.match(html, new RegExp(`href="${base}/instituto/"[^>]*>Conheça o Instituto`));
  assert.match(html, new RegExp(`href="${base}/apoie/"[^>]*>Apoie essa causa`));
});

test('hero: foto oficial com texto alternativo e carregamento prioritário', () => {
  const img = html.match(/<img[^>]*oficina-casa-de-cultura[^>]*>/)?.[0] ?? '';
  assert.ok(img, 'foto da oficina no hero');
  assert.match(img, /alt="Oficina de tranças/);
  assert.match(img, /fetchPriority="high"|fetchpriority="high"/i);
});

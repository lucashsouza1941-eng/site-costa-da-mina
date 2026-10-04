// Páginas internas e módulo de cursos no site exportado (Fase 6).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../../out/', import.meta.url));
const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');
const ler = (caminho) => readFileSync(join(out, caminho), 'utf8');

const paginas = [];
(function varrer(dir) {
  for (const nome of readdirSync(dir)) {
    const c = join(dir, nome);
    if (statSync(c).isDirectory()) varrer(c);
    else if (nome.endsWith('.html')) paginas.push({ nome: relative(out, c).split(sep).join('/'), html: readFileSync(c, 'utf8') });
  }
})(out);

test('todas as páginas internas foram geradas', () => {
  for (const p of [
    'instituto', 'projetos', 'projetos/beco-da-mina', 'projetos/trancando-o-futuro', 'projetos/tranca-amiga', 'projetos/sarau-trancado',
    'agenda', 'noticias', 'galeria', 'apoie', 'contato', 'privacidade', 'termos', 'cursos', 'presenca', 'painel',
  ]) {
    assert.ok(existsSync(join(out, p, 'index.html')), `faltou /${p}/`);
  }
});

test('cada página tem um único h1 e título próprio', () => {
  const titulos = new Set();
  for (const { nome, html } of paginas.filter((p) => !p.nome.startsWith('404') && !p.nome.startsWith('_not-found'))) {
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${nome}: deve ter um h1`);
    const t = html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(t, `${nome}: sem título`);
    titulos.add(t);
  }
  assert.ok(titulos.size >= 15, 'títulos repetidos entre páginas');
});

test('links internos não levam a páginas inexistentes', () => {
  const quebrados = new Set();
  for (const { nome, html } of paginas) {
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const caminho = href.slice(base.length).split('#')[0].split('?')[0] || '/';
      if (/\.(webp|png|jpe?g|svg|ico|mp4|xml|txt|css|js|woff2?)$/.test(caminho) || caminho.startsWith('/_next/')) continue;
      const alvo = join(out, caminho.endsWith('/') ? `${caminho}index.html` : caminho);
      if (!existsSync(alvo)) quebrados.add(`${nome} → ${href}`);
    }
  }
  assert.deepEqual([...quebrados], []);
});

test('âncoras do rodapé existem nas páginas de destino', () => {
  const apoie = ler('apoie/index.html');
  for (const id of ['doe', 'voluntariado', 'parceria', 'projetos']) assert.match(apoie, new RegExp(`id="${id}"`), `apoie#${id}`);
  const contato = ler('contato/index.html');
  for (const id of ['trabalhe-conosco', 'imprensa']) assert.match(contato, new RegExp(`id="${id}"`), `contato#${id}`);
});

test('galeria: fotos oficiais, filtros e lightbox acessíveis', () => {
  const g = ler('galeria/index.html');
  assert.ok((g.match(/aria-label="Ampliar foto:/g) ?? []).length >= 10, 'fotos da galeria');
  assert.match(g, /role="group" aria-label="Filtrar fotos"/);
  assert.match(g, /aria-pressed="true"/);
  assert.match(g, /<dialog/);
});

test('instituto: textos oficiais, sem visão/valores/equipe inventados', () => {
  const i = ler('instituto/index.html');
  assert.match(i, /Golfo da Guiné/);
  assert.match(i, /Nossa missão é ampliar oportunidades/);
  assert.match(i, /62\.212\.632\/0001-76/, 'CNPJ nos dados institucionais');
  assert.doesNotMatch(i, />Visão<|>Valores<|Quem faz o Instituto/);
});

test('projetos: ficha, WhatsApp e outros projetos; vídeo só no Trançando o Futuro', () => {
  const t = ler('projetos/trancando-o-futuro/index.html');
  assert.match(t, /<video[^>]*controls/);
  assert.match(t, /Educar é a forma mais bonita/);
  assert.match(t, /wa\.me\/5511958581395\?text=/);
  assert.doesNotMatch(ler('projetos/beco-da-mina/index.html'), /<video/);
});

test('notícias sem conteúdo: página técnica fora do sitemap e sem link', () => {
  assert.ok(existsSync(join(out, 'noticias/em-breve/index.html')));
  const sitemap = ler('sitemap.xml');
  assert.ok(!sitemap.includes('em-breve'));
  for (const { nome, html } of paginas) assert.ok(!html.includes('/noticias/em-breve/"') || nome.startsWith('noticias/em-breve'), nome);
});

test('privacidade traz o texto oficial e a seção dos cursos', () => {
  const p = ler('privacidade/index.html');
  assert.match(p, /1\. Quem somos/);
  assert.match(p, /Inscrições nos cursos e lista de presença/);
  assert.match(p, /Não pedimos CPF, RG/);
});

// --------------------------------------------------- módulo de cursos

test('módulo de cursos fora da navegação, do sitemap e dos buscadores', () => {
  const sitemap = ler('sitemap.xml');
  for (const p of ['/cursos/', '/presenca/', '/painel/']) assert.ok(!sitemap.includes(p), p);
  for (const { nome, html } of paginas) {
    for (const li of html.match(/<li[^>]*data-link-cursos[^>]*>/g) ?? []) assert.match(li, /\shidden/, `${nome}: link de cursos visível`);
    const linksCursos = (html.match(/<a[^>]+href="[^"]*\/cursos\/"/g) ?? []).length;
    const itensOcultos = (html.match(/data-link-cursos/g) ?? []).length;
    assert.ok(linksCursos <= itensOcultos, `${nome}: link para /cursos/ fora do item oculto`);
    assert.doesNotMatch(html, /<a[^>]+href="[^"]*\/(presenca|painel)\/"/, `${nome} aponta para presença/painel`);
  }
});

test('formulário de inscrição: rótulos, erros ligados, consentimento, sem CPF/RG', () => {
  const c = ler('cursos/index.html');
  for (const id of ['nome', 'nascimento', 'whatsapp', 'email', 'bairro', 'disponibilidade', 'consentimento']) {
    assert.match(c, new RegExp(`<label[^>]*for="${id}"`), `rótulo de ${id}`);
    assert.match(c, new RegExp(`aria-describedby="[^"]*erro-${id}`), `erro ligado a ${id}`);
  }
  assert.match(c, /Para que usamos seus dados/);
  assert.match(c, /class="armadilha"/);
  assert.doesNotMatch(c.replace(/<script[\s\S]*?<\/script>/g, ''), /\bCPF\b|\bRG\b/);
});

test('presença: formulário começa oculto; painel tem QR Code da página de presença', () => {
  assert.match(ler('presenca/index.html'), /<form[^>]*data-form[^>]*hidden/);
  const painel = ler('painel/index.html');
  assert.match(painel, /<svg[^>]*>[\s\S]*<path/);
  assert.match(painel, /\/presenca\/<\/p>/);
});

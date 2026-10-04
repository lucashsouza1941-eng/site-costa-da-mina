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

// ------------------------------------------------------------ Fase 4

const textoPuro = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('home: seções na ordem do design aprovado', () => {
  const ordem = ['hero-titulo', 'Pilares de atuação', 'titulo-projetos', 'titulo-sobre', 'titulo-beco', 'titulo-impacto', 'titulo-agenda', 'titulo-apoie', 'titulo-parceiros', 'titulo-galeria'];
  const posicoes = ordem.map((m) => html.indexOf(m));
  posicoes.forEach((p, i) => assert.ok(p > 0, `faltou a seção ${ordem[i]}`));
  assert.deepEqual(posicoes, [...posicoes].sort((a, b) => a - b), 'ordem das seções');
});

test('home: cinco pilares e quatro projetos com links para as páginas', () => {
  for (const p of ['Cultura e Identidade', 'Educação e Formação', 'Arte e Território', 'Comunidade e Pertencimento', 'Geração de Renda']) {
    assert.ok(html.includes(p), p);
  }
  for (const slug of ['beco-da-mina', 'trancando-o-futuro', 'tranca-amiga', 'sarau-trancado']) {
    assert.match(html, new RegExp(`href="${base}/projetos/${slug}/"`), slug);
  }
});

test('home: nada inventado em produção (sem eventos, notícias, números ou logos fictícios)', () => {
  const texto = textoPuro(html);
  assert.doesNotMatch(texto, /\[Exemplo\]|Placeholder|LOGO PARCEIRO/i);
  assert.match(texto, /Nenhum evento agendado no momento/, 'agenda sem eventos mostra aviso honesto');
  assert.ok(!html.includes('titulo-noticias'), 'sem notícias reais, a seção de notícias não aparece');
  assert.doesNotMatch(texto, /\+\s?\d{2,}|\d+\s?(pessoas|participantes|oficinas|alunas)/i, 'nenhuma estatística');
});

test('home: chave PIX só aparece depois de validada', () => {
  assert.ok(!textoPuro(html).includes('62.212.632/0001-76'), 'PIX ainda não validado não pode aparecer');
  assert.match(html, /href="mailto:contato\.costadamina@gmail\.com"/);
});

test('rodapé: colunas, contatos, privacidade e termos', () => {
  const rodape = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
  for (const t of ['Institucional', 'Apoie', 'Contato', 'Seja voluntário', 'Seja parceiro', 'Fale conosco', 'Imprensa']) assert.ok(rodape.includes(t), t);
  assert.match(rodape, /R\. Osório de Castro, 109/);
  assert.match(rodape, /\(11\) 95858-1395/);
  assert.match(rodape, new RegExp(`href="${base}/privacidade/"`));
  assert.match(rodape, new RegExp(`href="${base}/termos/"`));
  assert.match(rodape, /aria-label="Instagram @instituto\.costadamina"/);
});

test('home: todas as imagens com atributo alt', () => {
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) assert.match(img, /\salt=/, img.slice(0, 120));
});

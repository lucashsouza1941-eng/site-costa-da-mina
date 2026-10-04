// Conteúdo e camada de acesso (src/lib/conteudo.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { semExemplos, listarProjetos, listarEventos } from '../src/lib/conteudo.ts';
import { agenda, noticias, parceiros, indicadores } from '../src/content/colecoes.ts';
import { menuPrincipal, pilares, impactoQualitativo } from '../src/content/home.ts';

test('itens de exemplo nunca saem em produção', () => {
  assert.equal(semExemplos(agenda, false).length, 0);
  assert.equal(semExemplos(noticias, false).length, 0);
  assert.equal(semExemplos(parceiros, false).length, 0);
  assert.ok(semExemplos(agenda, true).length > 0, 'em desenvolvimento os exemplos aparecem');
});

test('todo conteúdo de demonstração é identificável', () => {
  for (const item of [...agenda, ...noticias, ...parceiros]) {
    const titulo = item.nome ?? item.titulo;
    if (item.exemplo) assert.match(titulo, /^\[Exemplo\]/, titulo);
  }
});

test('nenhum indicador numérico sem fonte', () => {
  for (const i of indicadores) {
    assert.ok(i.fonte && i.referencia, `indicador "${i.rotulo}" sem fonte ou data de referência`);
  }
});

test('os quatro projetos, com slugs únicos e textos', () => {
  const p = listarProjetos();
  assert.deepEqual(
    p.map((x) => x.slug),
    ['beco-da-mina', 'trancando-o-futuro', 'tranca-amiga', 'sarau-trancado'],
  );
  for (const x of p) {
    assert.ok(x.resumoCard && x.paragrafos.length > 0, x.slug);
  }
});

test('agenda: só eventos futuros, em ordem de data', () => {
  const eventos = listarEventos({ aPartirDe: '2000-01-01' });
  const datas = eventos.map((e) => e.data);
  assert.deepEqual(datas, [...datas].sort());
  assert.equal(listarEventos({ aPartirDe: '2999-01-01' }).length, 0);
});

test('home: menu, pilares e impacto do design aprovado', () => {
  assert.deepEqual(
    menuPrincipal.map((m) => m.rotulo),
    ['Início', 'Instituto', 'Projetos', 'Impacto', 'Agenda', 'Notícias', 'Galeria', 'Apoie', 'Contato'],
  );
  assert.equal(pilares.length, 5);
  assert.deepEqual(
    impactoQualitativo.map((i) => i.titulo),
    ['Educação', 'Comunidade', 'Cultura', 'Oportunidades'],
  );
  // impacto é qualitativo: nenhum número nos textos
  for (const i of impactoQualitativo) assert.doesNotMatch(i.texto, /\d/);
});

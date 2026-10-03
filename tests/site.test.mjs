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
    'cursos/index.html',
    'presenca/index.html',
    'painel/index.html',
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

// ------------------------------------------------------------------
// Módulo de cursos

test('módulo de cursos fica fora da navegação pública', () => {
  for (const { nome, html } of paginas) {
    // todo link para /cursos/ precisa estar dentro de um item [data-link-cursos] escondido
    const itens = html.match(/<li[^>]*data-link-cursos[^>]*>/g) ?? [];
    for (const li of itens) assert.match(li, /\shidden/, `${nome}: link de cursos visível sem turma aberta`);
    const linksCursos = (html.match(/<a[^>]+href="[^"]*\/cursos\/"/g) ?? []).length;
    assert.ok(linksCursos <= itens.length, `${nome}: link para cursos fora do item condicional`);
    for (const pagina of ['presenca', 'painel']) {
      assert.doesNotMatch(html, new RegExp(`<a[^>]+href="[^"]*/${pagina}/"`), `${nome} aponta para /${pagina}/`);
    }
  }
});

test('páginas do módulo não entram no sitemap', () => {
  const sitemaps = readdirSync(dist).filter((n) => n.startsWith('sitemap') && n.endsWith('.xml'));
  const xml = sitemaps.map((n) => readFileSync(join(dist, n), 'utf8')).join('');
  for (const pagina of ['/cursos/', '/presenca/', '/painel/']) assert.ok(!xml.includes(pagina), pagina);
});

test('nenhuma chave administrativa ou segredo vai para o site', () => {
  // chaves reais (não os nomes que a biblioteca do Supabase cita internamente)
  const proibidos = [/sb_secret_[A-Za-z0-9_-]{8,}/, /SUPABASE_SERVICE_ROLE_KEY/, /TURNSTILE_SECRET_KEY/, /SAL_TENTATIVAS/];
  const arquivos = [];
  const varrer = (dir) => {
    for (const n of readdirSync(dir)) {
      const c = join(dir, n);
      if (statSync(c).isDirectory()) varrer(c);
      else if (/\.(html|js|css|json|xml|txt)$/.test(n)) arquivos.push(c);
    }
  };
  varrer(dist);
  for (const arquivo of arquivos) {
    const conteudo = readFileSync(arquivo, 'utf8');
    for (const padrao of proibidos) assert.doesNotMatch(conteudo, padrao, `${relative(dist, arquivo)} contém ${padrao}`);
    // JWT com papel de serviço (chave antiga do Supabase)
    for (const jwt of conteudo.match(/eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+/g) ?? []) {
      const carga = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
      assert.notEqual(carga.role, 'service_role', `${relative(dist, arquivo)} contém chave de serviço`);
    }
  }
});

test('formulário de inscrição: rótulos, consentimento e sem CPF/RG', () => {
  const { html } = paginas.find((p) => p.nome === 'cursos/index.html');
  for (const id of ['nome', 'nascimento', 'whatsapp', 'email', 'bairro', 'disponibilidade', 'consentimento']) {
    assert.match(html, new RegExp(`<label[^>]*for="${id}"`), `campo ${id} sem rótulo`);
    assert.match(html, new RegExp(`aria-describedby="[^"]*erro-${id}`), `campo ${id} sem ligação com a mensagem de erro`);
  }
  assert.match(html, /Para que usamos seus dados/);
  assert.match(html, /privacidade\//);
  assert.doesNotMatch(html, /\bCPF\b|\bRG\b/);
  assert.match(html, /class="armadilha"/, 'campo-armadilha contra robôs');
});

test('página de presença não registra nada sozinha', () => {
  const { html } = paginas.find((p) => p.nome === 'presenca/index.html');
  assert.match(html, /<form[^>]*data-form[^>]*hidden/, 'o formulário começa escondido até confirmar chamada aberta');
  assert.match(html, /<label[^>]*for="identificador"/);
});

test('painel: QR Code aponta para a página de presença', () => {
  const { html } = paginas.find((p) => p.nome === 'painel/index.html');
  assert.match(html, /<svg[^>]*>.*<path/s, 'QR Code em SVG');
  assert.match(html, /\/presenca\/<\/p>/);
});

test('política de privacidade explica os dados dos cursos', () => {
  const { html } = paginas.find((p) => p.nome === 'privacidade/index.html');
  assert.match(html, /Inscrições nos cursos/);
});

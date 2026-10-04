// Servidor estático do site exportado (out/), parecido com o GitHub Pages:
// gzip, respeita o BASE_PATH e devolve 404.html para caminhos inexistentes.
// Uso: npm start  (PORTA=4322 por padrão)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

export function iniciarServidor({ porta = 0, raiz = fileURLToPath(new URL('../out/', import.meta.url)), base = process.env.BASE_PATH ?? '' } = {}) {
  const prefixo = base.replace(/\/$/, '');
  const servidor = createServer(async (req, res) => {
    let caminho = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    if (prefixo) {
      if (!caminho.startsWith(prefixo)) return responder(res, 404, join(raiz, '404.html'));
      caminho = caminho.slice(prefixo.length) || '/';
    }
    let arquivo = normalize(join(raiz, caminho));
    if (!arquivo.startsWith(normalize(raiz))) return responder(res, 403);
    try {
      if ((await stat(arquivo)).isDirectory()) arquivo = join(arquivo, 'index.html');
      await responder(res, 200, arquivo);
    } catch {
      await responder(res, 404, join(raiz, '404.html'));
    }
  });
  return new Promise((resolver) => servidor.listen(porta, () => resolver({ servidor, url: `http://localhost:${servidor.address().port}${prefixo}` })));
}

async function responder(res, status, arquivo) {
  try {
    const dados = arquivo ? await readFile(arquivo) : Buffer.from('');
    const tipo = TIPOS[extname(arquivo ?? '')] ?? 'application/octet-stream';
    const comprimir = /text|javascript|json|xml|svg|manifest/.test(tipo);
    res.writeHead(status, { 'Content-Type': tipo, ...(comprimir ? { 'Content-Encoding': 'gzip' } : {}) });
    res.end(comprimir ? gzipSync(dados) : dados);
  } catch {
    res.writeHead(status);
    res.end();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { url } = await iniciarServidor({ porta: Number(process.env.PORTA ?? 4322) });
  console.log(`Site em ${url}/`);
}

// Navegador real para os testes de ponta a ponta. Usa o Chrome/Chromium/Edge
// já instalado (no GitHub Actions, o Chrome do runner). Defina CHROME_PATH
// para escolher outro executável.
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { iniciarServidor } from '../../scripts/servir.mjs';

const candidatos = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

export const executavel = candidatos.find((c) => existsSync(c));

export async function prepararAmbiente() {
  if (!executavel) throw new Error('Nenhum Chrome/Edge encontrado. Defina CHROME_PATH.');
  const { servidor, url } = await iniciarServidor();
  const navegador = await puppeteer.launch({ executablePath: executavel, headless: true, protocolTimeout: 120000, args: ['--no-sandbox'] });
  return {
    url,
    navegador,
    async novaPagina({ largura = 1280, altura = 900, celular = largura < 768 } = {}) {
      const pagina = await navegador.newPage();
      await pagina.setViewport({ width: largura, height: altura, isMobile: celular, hasTouch: celular });
      const erros = [];
      pagina.on('console', (m) => m.type() === 'error' && erros.push(m.text()));
      pagina.on('pageerror', (e) => erros.push(String(e)));
      // pré-carregamentos cancelados ao navegar ou fechar a aba (ERR_ABORTED) são normais
      pagina.on('requestfailed', (r) => {
        const motivo = r.failure()?.errorText ?? '';
        if (!motivo.includes('ERR_ABORTED')) erros.push(`falhou (${motivo}): ${r.url()}`);
      });
      pagina.on('response', (r) => r.status() >= 400 && erros.push(`${r.status()}: ${r.url()}`));
      pagina.erros = erros;
      return pagina;
    },
    async encerrar() {
      await navegador.close();
      servidor.close();
    },
  };
}

export const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Espera o React assumir a página (antes disso, cliques viram navegação completa). */
export async function esperarHidratacao(pagina) {
  await pagina.waitForFunction(
    () => {
      const el = document.querySelector('header button');
      return el && Object.keys(el).some((k) => k.startsWith('__react'));
    },
    { timeout: 15000 },
  );
}

/** Rola a página inteira para disparar o carregamento preguiçoso. */
export async function rolarTudo(pagina) {
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
}

export const PAGINAS = [
  '/', '/instituto/', '/projetos/', '/projetos/beco-da-mina/', '/projetos/trancando-o-futuro/', '/projetos/tranca-amiga/',
  '/projetos/sarau-trancado/', '/agenda/', '/noticias/', '/galeria/', '/apoie/', '/contato/', '/privacidade/', '/termos/',
  '/cursos/', '/presenca/', '/painel/',
];

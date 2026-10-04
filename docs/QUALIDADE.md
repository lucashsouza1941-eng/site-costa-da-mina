# SEO, performance e acessibilidade

Medições da Fase 7 (04/10/2026), no build de produção (`npm run build`).

## Acessibilidade

- **axe-core 4 (WCAG 2.0/2.1 A e AA + boas práticas):** nenhuma violação nas 15 páginas, em 1440 e 375 px. Para confirmar que a ferramenta estava funcionando, ela foi rodada numa página propositalmente errada e apontou os 8 problemas plantados.
- **Lighthouse, acessibilidade:** 100 em todas as páginas medidas (celular e desktop).
- **Teclado:**
  - link "Pular para o conteúdo" no primeiro Tab;
  - menu do celular e busca em `<dialog>` nativo: o foco entra, Esc fecha e o foco volta;
  - galeria: Tab até a foto, Enter amplia, setas trocam de foto, Esc fecha e devolve o foco.
- **Movimento:** com "reduzir movimento" ativado, as transições caem para ~0 s.
- **Contraste:** os tokens foram medidos (docs/DESIGN-SYSTEM.md). O laranja dos rótulos e do "Saiba mais" foi escurecido para 5:1.
- **Larguras:** nenhuma rolagem lateral em 15 páginas × 6 larguras (320, 375, 768, 1024, 1280 e 1440 px).

## Performance

Lighthouse 13, servidor local com gzip (como o GitHub Pages):

| Página | Celular (4G lento simulado) | Desktop |
| --- | --- | --- |
| Início | 86 · FCP 1,4 s · LCP 4,1 s | 91 · LCP 2,0 s |
| Instituto | 90 · FCP 1,2 s · LCP 3,6 s | 98 · LCP 1,1 s |
| Cursos | 92 · FCP 1,1 s · LCP 3,3 s | 98 · LCP 1,1 s |

CLS (estabilidade do layout) 0 a 0,04 e TBT (bloqueio) até 110 ms em todas.

**O que foi feito:**
- **Imagens:** variantes WebP por largura, carregamento preguiçoso fora da primeira dobra e `fetchPriority="high"` na foto principal.
- **Hero no celular:** a ilustração decorativa do fundo deixou de ser carregada; ela era o maior elemento da tela (LCP) e não aparece no design para telas pequenas.
- **Fontes:** servidas pelo próprio site, só os pesos usados. A letra manuscrita não é pré-carregada.
- **Navegação:** pós-build que corrige os nomes dos arquivos de prefetch do Next 16 na exportação estática. Eram 404 no console e prefetch desperdiçado.
- **Imagem de compartilhamento:** JPEG (60 KB) em vez de PNG (330 KB).

**O que ainda limita o LCP no celular:** no 4G lento simulado, o tempo é o download da foto principal e do JavaScript do Next/React (cerca de 160 KB comprimidos). As fotos do acervo já são pequenas. Uma foto horizontal original, bem enquadrada, permitiria entregar um arquivo menor para o mesmo espaço.

## SEO

- **Metadados por página:** título único, descrição, canonical absoluto e OpenGraph/Twitter com imagem JPEG 1200×630.
- **Dados estruturados (JSON-LD):** `NGO` (organização, endereço, contato, Instagram) em todas as páginas, `BreadcrumbList` nas páginas internas e `NewsArticle` nas notícias.
- **`sitemap.xml`:** só páginas públicas. Ficam de fora o módulo de cursos e a página técnica `/noticias/em-breve/`.
- **`robots.txt` e `noindex`:** enquanto o endereço for temporário, o site fica fora dos buscadores. Por isso o Lighthouse dá 69 em SEO: o único item reprovado é "página bloqueada para indexação", de propósito. Ao ligar o domínio oficial, basta `NEXT_PUBLIC_INDEXAVEL=sim`.
- **`manifest.webmanifest`, `favicon.ico`, ícone do app e da Apple:** gerados a partir do selo oficial (`scripts/gerar-icones.mjs`).
- **Caminho base:** funciona com `/site-costa-da-mina`, sem duplicar o caminho (há teste).

## Testes automáticos relacionados

`tests/build/seo.test.mjs` confere metadados, JSON-LD, sitemap, ícones e prefetch. `tests/build/paginas.test.mjs` confere links internos, um h1 por página e o módulo oculto.

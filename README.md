# Instituto Costa da Mina · site institucional

Novo site do Instituto Costa da Mina (Cidade Ademar, Zona Sul de São Paulo), escrito do zero. Não usa código, tema, plugin, banco de dados nem estrutura do WordPress anterior, que continua no ar sem alterações até a aprovação final.

- **Conteúdo de referência:** [docs/INVENTARIO.md](docs/INVENTARIO.md)
- **O que falta confirmar:** [docs/PENDENCIAS.md](docs/PENDENCIAS.md)
- **Módulo de cursos (inscrições e chamada):** [docs/CURSOS.md](docs/CURSOS.md)

## Como rodar

Requer Node 22 ou mais novo.

```bash
npm install
npm run dev        # http://localhost:4321, com os avisos de pendência visíveis
npm run build      # checa tipos e gera o site estático em dist/
npm test           # verifica o dist/ (rode depois do build)
npm run pendencias # lista as pendências e atualiza docs/PENDENCIAS.md
```

## Arquitetura

Site estático em [Astro](https://astro.build): HTML pronto, CSS próprio e quase nenhum JavaScript (só o botão de copiar a chave PIX). As imagens são convertidas para WebP em vários tamanhos no build.

```
src/
  data/
    instituto.ts    informações oficiais (contatos, endereço, CNPJ, metas)
    projetos.ts     textos, fotos e fichas de cada projeto
    pendencias.ts   o que ainda não foi confirmado (nunca vai ao público)
  components/       cabeçalho, rodapé, cartão de projeto, PIX, trança decorativa…
  layouts/Base.astro
  pages/            início, sobre, projetos/[slug], contribua, contato, privacidade, 404
  styles/global.css cores, tipografia e utilitários
  assets/           marca e fotos (originais vindos do site anterior)
public/             favicon, vídeo, imagem de compartilhamento, robots.txt
tests/              verificações do HTML gerado
```

### Editar conteúdo

- Contatos, endereço e metas: `src/data/instituto.ts`.
- Projetos: `src/data/projetos.ts`. Um projeto novo vira página em `/projetos/<slug>/` automaticamente.
- Fotos: coloque o arquivo em `src/assets/fotos/` e importe em `projetos.ts`. Sempre escreva um `alt` que descreva a imagem.

### Informação não confirmada

Regra do projeto: **nenhum número, parceiro, depoimento, data ou resultado inventado.** O que não está confirmado vai para `src/data/pendencias.ts` e é marcado na página com `<Pendente id="…" />`. Em `npm run dev` o marcador aparece como um aviso tracejado em vermelho; no build de produção ele não gera HTML algum (há um teste que garante isso).

Quando o Instituto confirmar uma informação: coloque-a em `instituto.ts` ou `projetos.ts`, apague o item de `pendencias.ts`, remova o `<Pendente>` correspondente e rode `npm run pendencias`.

## Módulo de cursos

Inscrições nos cursos de tranças, lista de espera, painel da equipe e lista de chamada com QR Code. Banco e login no **Supabase**; o site estático só recebe a chave pública. Fica invisível na navegação enquanto não houver turma com inscrições abertas. Arquitetura, custos e passo a passo de configuração em [docs/CURSOS.md](docs/CURSOS.md).

```
supabase/
  migrations/      tabelas, regras (funções SQL), RLS e auditoria
  functions/       Edge Functions públicas: inscricao e presenca
    _compartilhado/  validação e mensagens usadas também pelo formulário
src/pages/cursos.astro · presenca.astro · painel.astro
src/painel/        telas do painel da equipe
```

## Publicação

O workflow [.github/workflows/publicar.yml](.github/workflows/publicar.yml) faz build, testa e publica no **GitHub Pages** a cada push na `main`. O endereço temporário é definido pelo próprio GitHub (`https://<conta>.github.io/<repositório>/`); `SITE_URL` e `BASE_PATH` são preenchidos automaticamente.

Enquanto estiver no endereço temporário, todas as páginas levam `noindex` e o `robots.txt` bloqueia buscadores.

### Ligar o domínio oficial (só depois da aprovação final)

1. Remover a trava de indexação: definir `PUBLIC_INDEXAVEL=sim` no build e trocar `public/robots.txt` por um que permita a indexação e aponte o sitemap.
2. Configurar o domínio personalizado no GitHub Pages (ou na hospedagem escolhida) e ajustar o DNS de `institutocostadamina.com.br`.
3. Não mexer nos registros de e-mail (MX) do domínio.
4. Opcional: redirecionar os endereços antigos (`/sobre-o-instituto/` → `/sobre/`, `/beco-da-mina/` → `/projetos/beco-da-mina/`, `/trancando-o-futuro/` → `/projetos/trancando-o-futuro/`, `/privacy-policy/` → `/privacidade/`).

## Acessibilidade

- Pensado primeiro para celular; sem rolagem horizontal a partir de 320 px.
- Contraste alto (roxo profundo × papel, amarelo × roxo), foco visível em amarelo, link para pular ao conteúdo.
- Menu do celular com a API `popover` nativa (fecha com Esc e devolve o foco).
- Animações respeitam `prefers-reduced-motion`.
- Fontes servidas pelo próprio site (sem Google Fonts), sem cookies e sem rastreadores.

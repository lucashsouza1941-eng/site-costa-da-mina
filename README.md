# Instituto Costa da Mina · site institucional

Novo site oficial do Instituto Costa da Mina (Cidade Ademar, Zona Sul de São Paulo), escrito do zero em **Next.js, React, TypeScript e Tailwind CSS**. Segue a imagem de design aprovada pela equipe. Não usa código, tema, plugin nem banco do WordPress anterior, que continua no ar até a aprovação final.

> **Branch `next-js`:** reconstrução em andamento, por fases. A branch `main` ainda publica a versão anterior (Astro) no endereço temporário e só será substituída depois da aprovação.

- **Design system:** [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md)
- **Conteúdo de referência do site anterior:** [docs/INVENTARIO.md](docs/INVENTARIO.md)
- **O que falta confirmar:** [docs/PENDENCIAS.md](docs/PENDENCIAS.md)
- **Módulo de cursos (inscrições e chamada):** [docs/CURSOS.md](docs/CURSOS.md)

## Como rodar

Requer Node 20.9 ou mais novo.

```bash
npm install
```

```bash
npm run dev
```

Abre em http://localhost:3000, com a vitrine do design system em `/design-system/` e os avisos de pendência visíveis.

```bash
npm run verificar
```

Roda checagem de tipos, testes, build estático em `out/` e verificação do site gerado.

```bash
npm run pendencias
```

Lista as pendências e atualiza `docs/PENDENCIAS.md`.

## Arquitetura

```
src/
  app/              rotas (App Router), layout, globals.css (tokens)
  components/ui/    design system: Botao, Rotulo, TituloSecao, Card, Icone, ornamentos…
  content/          dados tipados: instituto, home, projetos, coleções, pendências
  lib/conteudo.ts   única porta de leitura do conteúdo (pronta para CMS ou /admin)
  lib/imagens/      loader de imagens para a exportação estática
  modulos/cursos/   código do módulo de inscrições e chamada (a migrar na Fase 6)
supabase/           banco, regras, RLS e Edge Functions do módulo de cursos
tests/              banco (PGlite), regras, conteúdo; tests/build verifica o out/
```

- **Exportação estática** (`output: 'export'`) para o GitHub Pages. As imagens otimizadas (AVIF/WebP) são geradas no build, porque o Pages não roda o otimizador do Next.
- **Server Components por padrão;** Client Components só onde há interação (menu do celular, galeria, módulo de cursos).
- **Conteúdo de demonstração** tem `exemplo: true` e nunca é publicado.
- **Marcadores `<Placeholder>` e `<Pendente>`** só existem em desenvolvimento.
- **Páginas `*.dev.tsx`** (como a vitrine do design system) não entram no build de produção.

## Publicação

O workflow [.github/workflows/publicar.yml](.github/workflows/publicar.yml) roda tipos, testes, build e verificação, e publica `out/` no GitHub Pages a cada push na `main`. Enquanto o endereço for temporário, todas as páginas levam `noindex` e o `robots.txt` bloqueia buscadores.

### Ligar o domínio oficial (só depois da aprovação final)

1. Definir `NEXT_PUBLIC_INDEXAVEL=sim` no build.
2. Configurar o domínio personalizado na hospedagem e o DNS de `institutocostadamina.com.br`, sem mexer nos registros de e-mail (MX).
3. Reimprimir o QR Code da chamada, que aponta para o endereço em uso no build.

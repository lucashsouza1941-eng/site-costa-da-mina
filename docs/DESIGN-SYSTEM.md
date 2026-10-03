# Design system

Base visual do site em Next.js, extraída da imagem aprovada pela equipe. Os tokens vivem em [`src/app/globals.css`](../src/app/globals.css) (Tailwind CSS v4, bloco `@theme`). Em desenvolvimento, a vitrine fica em `/design-system/`. Ela não é publicada.

## Cores

Valores medidos por região da imagem aprovada (cor dominante), não por pixel isolado.

| Token | Valor | Classe Tailwind | Uso no design |
| --- | --- | --- | --- |
| `--color-primary` | `#5f267d` | `bg-primary`, `text-primary` | Botão "Nossa história", ícones dos pilares |
| `--color-primary-dark` | `#2e113c` | `bg-primary-dark` | Faixas Beco da Mina e Apoie |
| `--color-primary-deep` | `#170927` | `bg-primary-deep` | Fundo do degradê roxo; texto sobre amarelo |
| `--color-accent` | `#f8b019` | `bg-accent` | Botões amarelos, selos de data, destaques |
| `--color-background` | `#fbf5ea` | `bg-background` | Fundo creme da página |
| `--color-surface` | `#fef8f1` | `bg-surface` | Cards |
| `--color-text` | `#161522` | `text-text` | Títulos e texto |
| `--color-muted` | `#625a65` | `text-muted` | Textos secundários |
| `--color-border` | `#e7ded2` | `border-border` | Bordas e divisórias |
| `--color-label-vinho` | `#9e4d6c` | `text-label-vinho` | Rótulo "Nossos projetos" |
| `--color-label-laranja` | `#a55405` | `text-label-laranja` | Rótulos "Sobre o Instituto" e "Nosso impacto" |
| `--color-graphite` | `#0a0d13` | `bg-graphite` | Rodapé |

**Ajuste de acessibilidade:** o laranja dos rótulos no design (cerca de `#e08a1e`) tem contraste de só 2,5:1 sobre o creme, abaixo do mínimo para texto pequeno. O token usa `#a55405`, com 5,0:1, mais fechado e no mesmo matiz. Contrastes medidos: vinho 5,2:1, texto secundário 6,1:1, branco sobre roxo 10,2:1, roxo profundo sobre amarelo 10,2:1 e amarelo sobre roxo escuro 8,9:1.

## Tipografia

Todas as fontes são servidas pelo próprio site via `next/font`: o build baixa os arquivos e nenhuma chamada sai para o Google.

| Papel | Fonte | Classe | Onde |
| --- | --- | --- | --- |
| Display | Barlow Condensed 800 | `font-display text-hero` | Título do hero, em caixa-alta |
| Títulos | Barlow 700/800 | `font-heading text-section` | Títulos de seção e de cards |
| Texto | Inter | `font-sans` (padrão) | Parágrafos, botões pequenos |
| Manuscrita | Caveat 600 | `font-script` | Notas ("Da nossa comunidade para o mundo.") |
| Rótulo | Barlow 700, caixa-alta, espaçado | `text-eyebrow` | "NOSSOS PROJETOS" |

O site antigo já usava Barlow, o que mantém a continuidade da identidade.

## Espaçamento, larguras e breakpoints

- **Container:** 1240 px de conteúdo (`container-site`), a mesma proporção da imagem, com respiro lateral de 16, 24 e 32 px (celular, tablet e desktop).
- **Seções:** `section-y` (48 a 88 px, fluido) e `section-y-sm`.
- **Breakpoints:** padrão do Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536) e `xs` 400 para celulares pequenos.

## Raios e sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-card` | 8 px | Cards e fotos |
| `rounded-panel` | 16 px | Painéis grandes |
| `rounded-pill` | 999 px | Botões |
| `shadow-card` | sombra curta e suave | Cards sobre o creme |
| `shadow-raised` | sombra longa | Cartão do PIX, elementos elevados |

## Componentes base (`src/components/ui`)

| Componente | O que é |
| --- | --- |
| `Container` | Largura do design e respiro lateral |
| `Botao` | Variantes `amarelo`, `roxo`, `contorno-claro`, `contorno-amarelo`, `link`; com `href` vira link; `seta` adiciona → |
| `Rotulo` | Eyebrow em caixa-alta (tons `vinho`, `laranja`, `amarelo`, `claro`) |
| `TituloSecao` | Rótulo, título, descrição e ação à direita |
| `Card` | Superfície clara com borda e sombra |
| `Icone` | 26 ícones de traço próprios (pilares, navegação, contato, redes) |
| `NotaManuscrita` | Frase cursiva inclinada, com sublinhado ou coroa |
| `Pincelada`, `PadraoGeometrico`, `Zigzag`, `Coroa`, `BordaOndulada` | Ornamentos em SVG próprio: tranças, padrão do Beco, faixa do rodapé |
| `Placeholder`, `Pendente` | Marcadores internos, **só em desenvolvimento** (não geram HTML em produção) |

## Regras

- **Nada de imagem da referência como fundo ou seção:** tudo é componente real.
- **Ornamentos:** são SVG desenhados para o site, nunca recortes da imagem de referência.
- **Conteúdo de demonstração:** leva `exemplo: true` e o prefixo "[Exemplo]"; `src/lib/conteudo.ts` remove esses itens em produção (há teste).
- **Números de impacto:** só entram com fonte e data de referência (`indicadores`).

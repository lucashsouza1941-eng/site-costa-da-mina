# Inventário do site anterior

Levantamento do conteúdo público de **institutocostadamina.com.br** feito em 03/10/2026, antes de começar o novo site. Serviu só como fonte de **conteúdo e identidade**: nenhum código, tema, plugin, banco de dados ou estrutura do WordPress foi reaproveitado. O site anterior não foi alterado.

## Páginas encontradas

| Página | Endereço | Observação |
| --- | --- | --- |
| Início | `/` | Projetos (só o Trança Amiga), feed do Instagram, contato |
| Sobre o Instituto | `/sobre-o-instituto/` | Nome, origem, missão, fundadora, metas, PIX |
| Beco da Mina | `/beco-da-mina/` | Texto do projeto, colagem de fotos, print do g1 |
| Trançando o Futuro | `/trancando-o-futuro/` | Texto, vídeo, citação da Helaine |
| Trança Amiga | `/tranca-amiga` | **Link quebrado (404)**; o texto só aparece na home |
| Política de Privacidade | `/privacy-policy/` | Texto completo, sem data de atualização |
| (post) | "Hello world!" | Post padrão do WordPress, nunca removido |

## Identidade visual

- **Logotipo horizontal:** "INSTITUTO" na vertical sobre faixa amarela + "COSTA DA MINA" em letras com recortes geométricos, roxo. → `src/assets/marca/logo-horizontal.png`
- **Símbolo:** cadeira de salão (de trancista) com raízes saindo da base, roxo e amarelo. → `simbolo-cadeira.png`
- **Selo:** símbolo roxo dentro de círculo amarelo. → `selo-amarelo.png`; o favicon usa a versão em círculo roxo.
- **Monograma "CDM"** em amarelo sobre roxo (não usado no novo site).
- **Marcas dos projetos:** Trança Amiga (coração de tranças, pêssego e lilás), Trançando o Futuro (nó de trança em infinito, branco sobre roxo), Beco da Mina (lata de spray com a cadeira), Sarau Trançado (microfone, tons de rosa e azul).
- **Padrão de cadeiras** coloridas com raízes (faixa decorativa).

## Paleta (extraída do CSS e das peças gráficas)

| Cor | Hex | Uso no novo site |
| --- | --- | --- |
| Roxo da marca | `#6A0D73` / `#6C0D75` | `--roxo-700`, cor principal |
| Roxo profundo | `#290B35` | `--roxo-900`, fundos escuros |
| Violeta | `#936EE4` | `--violeta`, brilhos do topo |
| Lilás | `#E1A8FF` | `--lilas`, destaques sobre roxo |
| Amarelo | `#F4CA50` | `--amarelo`, botões e destaques |
| Ouro | `#FFBE00` / `#F8CA16` | `--ouro`, foco do teclado |
| Laranja (cartaz do Beco) | — | `--laranja` |
| Pêssego (Trança Amiga) | — | `--pessego` |

Fontes no site anterior: Barriecito (títulos), Poppins e Roboto (texto), carregadas do Google Fonts. O novo site usa **Bricolage Grotesque** (títulos) e **Atkinson Hyperlegible** (texto, focada em legibilidade), servidas pelo próprio site, sem chamadas ao Google.

## Informações institucionais confirmadas

- **Nome:** Instituto Costa da Mina (as páginas de projeto também dizem "Associação Costa da Mina" → pendência)
- **Lema:** "Raízes que educam, cultura que transforma, futuro que floresce." / "Enraizar e florescer!"
- **Território:** Cidade Ademar, Zona Sul de São Paulo
- **Origem do nome:** Costa da Mina, região da África Ocidental no Golfo da Guiné
- **Missão:** ampliar oportunidades e garantir direitos fundamentais, fortalecendo vínculos, formação cidadã e pontes entre saberes tradicionais e contemporâneos
- **Fundadora:** Helaine Cristina, trancista com mais de 30 anos de experiência, empresária local, ativista social e presidente; salão Helaine Tranças
- **Metas:** eventos culturais e oficinas de arte; oficinas de música, dança, teatro, artes visuais e poesia; capacitação de trancistas
- **CNPJ / chave PIX:** 62.212.632/0001-76

## Projetos

| Projeto | O que o site anterior diz |
| --- | --- |
| Beco da Mina | Primeira ação: murais na Rua Osório de Castro (Vila Inglesa). Arte de Waldir Age e equipe (Age Ação Visual). |
| Trançando o Futuro | Oficinas gratuitas de tranças, em parceria com a Casa de Cultura Cidade Ademar. Citação da Helaine. |
| Trança Amiga | Trançado gratuito para entrevistas de emprego, eventos e momentos importantes. |
| Sarau Trançado | Só o nome, o cartaz e o perfil @sarau.trancado. |

## Contatos

- **Endereço:** R. Osório de Castro, 109 – Vila Inglesa – Cidade Ademar – São Paulo/SP
- **E-mail:** contato.costadamina@gmail.com
- **WhatsApp:** (11) 95858-1395
- **Instagram:** @instituto.costadamina e @sarau.trancado

## Mídias

Reaproveitadas (copiadas para `src/assets` e otimizadas no build):

- Logos e marcas listadas acima
- Retrato da Helaine (círculo)
- Colagem P&B da Cidade Ademar
- Colagem do Beco da Mina (1920×300), recortada em 7 fotos: antes, esboço, pintura, artistas, fachada, detalhe e mural das trancistas
- Quadro do GIF dos adesivos "Beco da Mina"
- Cartazes: Beco da Mina, Trançando o Futuro, Trança Amiga, Sarau Trançado
- Foto da oficina na Casa de Cultura
- Vídeo da oficina do Trançando o Futuro (reencodado: 11 MB → 6 MB) e dois quadros dele

Não reaproveitadas, de propósito:

- **Fotos históricas em P&B e mapa do tráfico atlântico** (faixa "charis"): origem e direitos desconhecidos.
- **Print da reportagem do g1:** imagem de terceiros; o ideal é citar com o link oficial (pendência).
- **QR Code:** destino desconhecido.
- **Vídeo de fundo do Beco** (`youtu.be/wCcsslSqkOE`): é um vídeo de grafite de outro artista ("Graffiti - Tesh | HELLO MY NAME IS"), não do Instituto.
- **Feed do Instagram (plugin):** trocado por links diretos aos perfis, sem rastreadores de terceiros.

## Problemas encontrados no site anterior

Registrados para o Instituto; nada foi alterado no WordPress.

1. **Links suspeitos no feed do Instagram.** Dois links de posts carregam um parâmetro `__d=` com texto em chinês e o domínio `dxs.bar`, padrão típico de spam de SEO injetado. Vale uma checagem de segurança no WordPress e no plugin do feed.
2. Link do menu **/tranca-amiga** quebrado (404).
3. Um dos botões de WhatsApp aponta para `55119585813950` (um dígito a mais).
4. "Trançando o Futuro" e "Trançando Futuros" usados para o mesmo projeto.
5. Erro de digitação "Transcista" na assinatura da Helaine.
6. Post "Hello world!" padrão ainda publicado.
7. Política de Privacidade promete data de atualização, mas não mostra.

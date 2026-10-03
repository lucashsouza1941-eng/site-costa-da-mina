# Pendências de conteúdo

Gerado por `npm run pendencias` a partir de `src/content/pendencias.ts`. Não edite à mão.

Nada desta lista aparece no site publicado. Em `npm run dev`, cada item aparece como um aviso tracejado em vermelho (componente `<Pendente>`) no ponto da página onde a informação entraria.

Total: **23**

## Nome jurídico da organização

- **id:** `nome-juridico`
- **Onde:** Rodapé, Contribua, Política de Privacidade
- **Situação:** O site anterior usa "Instituto Costa da Mina" e, nas páginas dos projetos, "Associação Costa da Mina". Confirmar a razão social do CNPJ 62.212.632/0001-76.

## Data ou ano de fundação

- **id:** `ano-fundacao`
- **Onde:** Sobre o Instituto (linha do tempo)
- **Situação:** Não informado. O rodapé antigo mostra "© 2025", o que não comprova a data de fundação.

## CEP do endereço

- **id:** `cep`
- **Onde:** Contato e rodapé
- **Situação:** O site anterior traz só "R. Osório de Castro, 109 – Vila Inglesa – Cidade Ademar".

## Horário de atendimento

- **id:** `horario`
- **Onde:** Contato
- **Situação:** Não informado no site anterior.

## Número de WhatsApp

- **id:** `whatsapp`
- **Onde:** Todo o site
- **Situação:** O site anterior exibe (11) 95858-1395, mas um dos botões apontava para 55119585813950 (um dígito a mais). O novo site usa 5511958581395; confirmar.

## Nome do projeto "Trançando o Futuro"

- **id:** `trancando-nome`
- **Onde:** Projetos
- **Situação:** O menu e a página usam "Trançando o Futuro"; a home e a Política de Privacidade antigas usam "Trançando Futuros". O novo site adota "Trançando o Futuro".

## Agenda atual das oficinas do Trançando o Futuro

- **id:** `trancando-agenda`
- **Onde:** Projeto Trançando o Futuro
- **Situação:** Um cartaz antigo cita domingos, 10h às 12h, +14 anos, na Casa de Cultura (Av. Durval Pinto Ferreira, 820 – Jd. Itacolomi). Não se sabe se a turma segue aberta; por isso o site não publica datas.

## Como pedir um atendimento do Trança Amiga

- **id:** `tranca-amiga-como-participar`
- **Onde:** Projeto Trança Amiga
- **Situação:** O site anterior descreve o projeto, mas não explica como a pessoa se inscreve (e o link /tranca-amiga estava quebrado). O novo site direciona para o WhatsApp.

## Descrição do Sarau Trançado

- **id:** `sarau-descricao`
- **Onde:** Projeto Sarau Trançado
- **Situação:** O site anterior só cita o nome, o perfil @sarau.trancado e um cartaz. Falta um texto oficial.

## Federação internacional citada na trajetória da Helaine

- **id:** `federacao`
- **Onde:** Sobre o Instituto
- **Situação:** O texto fala em "conexão com uma federação internacional da área", sem o nome. Mantido sem detalhes.

## Matérias na imprensa

- **id:** `imprensa`
- **Onde:** Projeto Beco da Mina
- **Situação:** O site anterior mostra um print do g1 ("Transformação pela comunidade": Rua da Vila Inglesa vira galeria de arte urbana), sem link. Falta o link oficial e a data para citar a matéria.

## Autorização de uso de imagem

- **id:** `autorizacao-imagens`
- **Onde:** Todo o site
- **Situação:** As fotos vieram do site anterior. Confirmar autorização das pessoas retratadas e a origem das fotos históricas em preto e branco (não usadas por enquanto).

## Fotos em alta resolução

- **id:** `fotos-alta-resolucao`
- **Onde:** Beco da Mina e página inicial
- **Situação:** Várias fotos do Beco da Mina só existiam no site anterior como uma colagem de 1920×300 px; os recortes ficam pequenos (cerca de 260 px de largura). Pedir os arquivos originais ao Instituto.

## QR Code da página "Sobre"

- **id:** `qr-code`
- **Onde:** Contribua
- **Situação:** O site anterior exibe um QR Code sem dizer para onde ele leva. Não foi reaproveitado.

## Data de atualização da Política de Privacidade

- **id:** `privacidade-data`
- **Onde:** Política de Privacidade
- **Situação:** A política anterior promete exibir a data de atualização, mas não exibe. Definir a data na aprovação.

## Chave PIX para doações

- **id:** `pix-validacao`
- **Onde:** Seção Apoie e página /apoie
- **Situação:** O site anterior publica o CNPJ 62.212.632/0001-76 como chave PIX. Na versão em Next.js a chave só aparece depois que o Instituto confirmar que ela está ativa e em nome da organização.

## Versão branca do logotipo

- **id:** `logo-branco`
- **Onde:** Header e rodapé
- **Situação:** O design aprovado usa um logo diferente do oficial. Será usada uma versão branca derivada do logotipo oficial (header escuro e rodapé). Confirmar com o Instituto se existe arquivo oficial dessa versão.

## Textos curtos vindos do design aprovado

- **id:** `textos-design`
- **Onde:** Home e cards de projetos
- **Situação:** Pilares, descrições curtas dos projetos (ex.: Sarau Trançado "Música, poesia e cultura da nossa comunidade") e frases da home vêm da imagem aprovada, não do site anterior. Confirmar que descrevem as atividades reais.

## Contas do módulo de cursos (Supabase e Cloudflare Turnstile)

- **id:** `contas-cursos`
- **Onde:** /cursos/, /presenca/ e /painel/
- **Situação:** O módulo de inscrições e presença está pronto, mas só funciona depois de criar o projeto no Supabase, aplicar a migração, publicar as Edge Functions, criar o site no Turnstile e o primeiro usuário administrador (passo a passo em docs/CURSOS.md). Até lá, as páginas mostram "nenhuma inscrição aberta".

## Prazo de guarda dos dados das inscrições

- **id:** `retencao-cursos`
- **Onde:** Política de Privacidade, seção 12
- **Situação:** A política diz apenas "pelo período necessário". Definir com o Instituto um prazo (por exemplo, até X meses após o fim da turma) e quem faz a exclusão.

## Região do banco de dados

- **id:** `regiao-dados`
- **Onde:** Política de Privacidade, seção 12
- **Situação:** Recomendado criar o projeto Supabase na região São Paulo (sa-east-1). Confirmar a região escolhida e citar na política, se o Instituto quiser.

## Inscrição de menores de idade

- **id:** `menores-cursos`
- **Onde:** Formulário de inscrição
- **Situação:** Um cartaz antigo cita "+14 anos". O sistema permite definir idade mínima por turma, mas o Instituto precisa decidir a idade e, para menores de 18, se exigirá autorização de responsável (a LGPD pede consentimento de responsável para crianças de até 12 anos).

## Outras redes sociais

- **id:** `outras-redes`
- **Onde:** Rodapé e Contato
- **Situação:** Só o Instagram (@instituto.costadamina e @sarau.trancado) aparece no site anterior. Confirmar se há Facebook, YouTube ou TikTok oficiais.

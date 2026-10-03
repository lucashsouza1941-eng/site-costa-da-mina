// Acervo oficial de imagens: única fonte da verdade.
// Cada item diz de onde a imagem vem no site atual, como é tratada
// (recorte, quadro de GIF ou vídeo, versão branca) e para onde vai.
//
// Regras (briefing e docs/IMAGENS.md):
// - só material institucional publicado no site atual;
// - nenhum nome associado a pessoas fotografadas sem confirmação;
// - nada de foto genérica de banco de imagens ou do tema WordPress;
// - nenhum hotlink: tudo é baixado e servido pelo próprio site.

const SITE = 'https://institutocostadamina.com.br/wp-content/uploads/';

/**
 * @typedef {{
 *   id: string,
 *   origem: string,
 *   destino: string,
 *   alt: string,
 *   categoria: 'marca' | 'instituto' | 'comunidade' | 'beco-da-mina' | 'trancando-o-futuro' | 'tranca-amiga' | 'sarau-trancado',
 *   tipo?: 'foto' | 'grafico' | 'marca',
 *   recorte?: [number, number, number, number],
 *   quadro?: number,
 *   segundo?: number,
 *   derivar?: 'branco',
 *   galeria?: boolean,
 *   nota?: string,
 * }} Fonte
 */

/** @type {Fonte[]} */
export const fontes = [
  // ------------------------------------------------------------- marca
  { id: 'logo-horizontal', origem: '2026/03/Ativo-6-8.png', destino: 'instituto/marca/logo-horizontal', tipo: 'marca', categoria: 'marca', alt: 'Instituto Costa da Mina' },
  {
    id: 'logo-horizontal-branco',
    origem: '2026/03/Ativo-6-8.png',
    destino: 'instituto/marca/logo-horizontal-branco',
    derivar: 'branco',
    tipo: 'marca',
    categoria: 'marca',
    alt: 'Instituto Costa da Mina',
    nota: 'Derivada do logotipo oficial: o roxo vira branco, o amarelo é mantido (para fundos escuros).',
  },
  { id: 'simbolo', origem: '2026/03/Ativo-1-8.png', destino: 'instituto/marca/simbolo', tipo: 'marca', categoria: 'marca', alt: 'Símbolo do Instituto: cadeira de salão com raízes' },
  {
    id: 'simbolo-branco',
    origem: '2026/03/Ativo-1-8.png',
    destino: 'instituto/marca/simbolo-branco',
    derivar: 'branco',
    tipo: 'marca',
    categoria: 'marca',
    alt: 'Símbolo do Instituto: cadeira de salão com raízes',
    nota: 'Derivada do símbolo oficial para fundos escuros.',
  },
  { id: 'selo-amarelo', origem: '2026/03/LOGOTIPO-COSTA-DA-MINA-06.png', destino: 'instituto/marca/selo-amarelo', tipo: 'marca', categoria: 'marca', alt: 'Selo do Instituto: cadeira com raízes em círculo amarelo' },
  { id: 'selo-roxo', origem: '2026/03/LOGOTIPO-COSTA-DA-MINA-07.png', destino: 'instituto/marca/selo-roxo', tipo: 'marca', categoria: 'marca', alt: 'Selo do Instituto: cadeira com raízes em círculo roxo' },
  { id: 'monograma-cdm', origem: '2026/05/cdm.png', destino: 'instituto/marca/monograma-cdm', tipo: 'marca', categoria: 'marca', alt: 'Monograma CDM' },
  { id: 'padrao-cadeiras', origem: '2026/03/charis.png', destino: 'instituto/marca/padrao-cadeiras', tipo: 'grafico', categoria: 'marca', alt: '' },

  // --------------------------------------------------------- instituto
  {
    id: 'ilustracao-brasil-africa',
    origem: '2026/03/bgbgbg.png',
    destino: 'instituto/ilustracao-brasil-africa',
    tipo: 'grafico',
    categoria: 'instituto',
    alt: 'Ilustração em tons de roxo com os mapas do Brasil e da África e símbolos culturais',
  },
  {
    id: 'retrato-trancista',
    origem: '2026/03/hee.png',
    destino: 'instituto/retrato-trancista',
    categoria: 'instituto',
    alt: 'Retrato de uma mulher negra sorrindo, de avental preto e blusa vermelha',
    nota: 'No site atual aparece ao lado da citação de Helaine Cristina; o nome só será usado depois de confirmação.',
  },

  // -------------------------------------------------------- comunidade
  {
    id: 'cidade-ademar',
    origem: '2026/03/IMSGS.png',
    destino: 'comunidade/cidade-ademar-colagem',
    categoria: 'comunidade',
    galeria: true,
    alt: 'Colagem em preto e branco da Cidade Ademar: letreiro do bairro, casas no morro e pessoas reunidas na rua',
  },
  {
    id: 'casa-de-cultura',
    origem: '2026/03/Instituto-Costa-da-Mina.png',
    recorte: [115, 100, 970, 640],
    destino: 'comunidade/casa-de-cultura-cidade-ademar',
    categoria: 'comunidade',
    galeria: true,
    alt: 'Mulher sorrindo ao lado do painel da Casa de Cultura Cidade Ademar',
  },

  // ------------------------------------------------------ Beco da Mina
  { id: 'beco-cartaz', origem: '2026/03/Instituto-Costa-da-Mina-2.png', destino: 'projetos/beco-da-mina/cartaz-lata-de-spray', tipo: 'grafico', categoria: 'beco-da-mina', alt: 'Cartaz do Beco da Mina: lata de spray com a cadeira de raízes do Instituto' },
  { id: 'beco-antes', origem: '2026/03/becco.png', recorte: [0, 0, 390, 300], destino: 'projetos/beco-da-mina/antes', categoria: 'beco-da-mina', galeria: true, alt: 'A rua antes dos murais, em preto e branco: muros cinzas e calçada vazia' },
  { id: 'beco-mural-trancistas', origem: '2026/03/becco.png', recorte: [392, 0, 658, 300], destino: 'projetos/beco-da-mina/mural-trancistas', categoria: 'beco-da-mina', galeria: true, alt: 'Fachada pintada de roxo com mural de três mulheres negras trançando os cabelos umas das outras' },
  { id: 'beco-esboco', origem: '2026/03/becco.png', recorte: [660, 0, 888, 300], destino: 'projetos/beco-da-mina/esboco', categoria: 'beco-da-mina', galeria: true, alt: 'Mulher diante de um muro com o esboço do mural e uma escada apoiada' },
  { id: 'beco-pintura', origem: '2026/03/becco.png', recorte: [890, 0, 1160, 300], destino: 'projetos/beco-da-mina/mural-em-pintura', categoria: 'beco-da-mina', galeria: true, alt: 'Mural em pintura: rosto de mulher cercado de flores e um beija-flor' },
  { id: 'beco-artistas', origem: '2026/03/becco.png', recorte: [1162, 0, 1388, 300], destino: 'projetos/beco-da-mina/artistas', categoria: 'beco-da-mina', galeria: true, alt: 'Três artistas sorrindo em frente ao mural colorido' },
  { id: 'beco-fachada', origem: '2026/03/becco.png', recorte: [1390, 0, 1618, 300], destino: 'projetos/beco-da-mina/fachada', categoria: 'beco-da-mina', galeria: true, alt: 'Mulher em frente à fachada roxa do Instituto' },
  { id: 'beco-mural-rosto', origem: '2026/03/becco.png', recorte: [1620, 0, 1920, 300], destino: 'projetos/beco-da-mina/mural-rosto', categoria: 'beco-da-mina', galeria: true, alt: 'Detalhe de mural: rosto de mulher de olhos fechados, cercado de flores' },
  { id: 'beco-adesivo-mural', origem: '2026/04/SARAU-TRANCADO.gif', quadro: 21, destino: 'projetos/beco-da-mina/adesivo-no-mural', categoria: 'beco-da-mina', galeria: true, alt: 'Mão segurando um adesivo "Beco da Mina" diante de um mural colorido' },
  { id: 'beco-adesivo-rua', origem: '2026/04/SARAU-TRANCADO.gif', quadro: 26, destino: 'projetos/beco-da-mina/adesivo-na-rua', categoria: 'beco-da-mina', galeria: true, alt: 'Adesivo "Beco da Mina" segurado diante da rua' },
  { id: 'beco-adesivo-muro', origem: '2026/04/SARAU-TRANCADO.gif', quadro: 31, destino: 'projetos/beco-da-mina/adesivo-no-muro', categoria: 'beco-da-mina', alt: 'Adesivo "Beco da Mina" colado em um muro laranja' },
  { id: 'beco-letreiro', origem: '2026/03/gif-beco.gif', quadro: 256, destino: 'projetos/beco-da-mina/letreiro', categoria: 'beco-da-mina', galeria: true, alt: 'Artista pintando com spray o letreiro "Beco da Mina" em um muro branco' },

  // ------------------------------------------------- Trançando o Futuro
  { id: 'trancando-marca', origem: '2026/05/1-POST-CDM.png', destino: 'projetos/trancando-o-futuro/marca', tipo: 'marca', categoria: 'trancando-o-futuro', alt: 'Marca do Trançando o Futuro: nó de trança em forma de infinito' },
  { id: 'trancando-cartaz', origem: '2026/03/Instituto-Costa-da-Mina-3.png', destino: 'projetos/trancando-o-futuro/cartaz', tipo: 'grafico', categoria: 'trancando-o-futuro', alt: 'Cartaz roxo e laranja do Trançando o Futuro com rostos de mulheres negras trançadas' },
  {
    id: 'trancando-oficina',
    origem: '2026/05/1-POST-CDM-1.jpg',
    destino: 'projetos/trancando-o-futuro/oficina-casa-de-cultura',
    categoria: 'trancando-o-futuro',
    galeria: true,
    alt: 'Oficina de tranças na Casa de Cultura: uma instrutora orienta uma aluna que trança o cabelo de outra pessoa',
  },
  { id: 'trancando-oficina-2', origem: '2026/03/tof.mp4', segundo: 24, recorte: [0, 60, 480, 700], destino: 'projetos/trancando-o-futuro/oficina-2', categoria: 'trancando-o-futuro', galeria: true, alt: 'Participantes trançando cabelos durante a oficina' },
  { id: 'trancando-oficina-3', origem: '2026/03/tof.mp4', segundo: 38, recorte: [0, 60, 480, 700], destino: 'projetos/trancando-o-futuro/oficina-3', categoria: 'trancando-o-futuro', galeria: true, alt: 'Duas participantes trabalham juntas em uma trança' },
  { id: 'casa-de-cultura-fachada', origem: '2026/03/tof.mp4', segundo: 44, recorte: [0, 60, 480, 700], destino: 'comunidade/casa-de-cultura-fachada', categoria: 'comunidade', alt: 'Fachada de prédio com faixas coloridas pintadas, no local da oficina' },
  { id: 'trancando-video-capa', origem: '2026/03/tof.mp4', segundo: 24, destino: 'projetos/trancando-o-futuro/video-capa', categoria: 'trancando-o-futuro', alt: '' },

  // ------------------------------------------------------- Trança Amiga
  { id: 'tranca-amiga-marca', origem: '2026/04/Ativo-1.png', destino: 'projetos/tranca-amiga/marca', tipo: 'marca', categoria: 'tranca-amiga', alt: 'Marca do Trança Amiga: coração desenhado por duas tranças' },
  { id: 'tranca-amiga-cartaz', origem: '2026/04/PROJETO_TRANCA_AMIGA.jpg', destino: 'projetos/tranca-amiga/cartaz', tipo: 'grafico', categoria: 'tranca-amiga', alt: 'Cartaz roxo do Trança Amiga com o coração de tranças' },
  { id: 'tranca-amiga-banner', origem: '2026/04/Ativo-2.png', destino: 'projetos/tranca-amiga/banner', tipo: 'grafico', categoria: 'tranca-amiga', alt: 'Marca do Trança Amiga sobre fundo roxo' },

  // ----------------------------------------------------- Sarau Trançado
  { id: 'sarau-cartaz', origem: '2026/03/SARAU-TRANCADO.png', destino: 'projetos/sarau-trancado/cartaz', tipo: 'grafico', categoria: 'sarau-trancado', alt: 'Cartaz do Sarau Trançado: microfone sobre fundo em tons de rosa, roxo e azul' },
];

/** Vídeo oficial (copiado e reencodado, não otimizado como imagem). */
export const videos = [
  { id: 'trancando-oficina-video', origem: '2026/03/tof.mp4', destino: 'videos/trancando-o-futuro-oficina.mp4', capa: 'trancando-video-capa', descricao: 'Vídeo de uma oficina do Trançando o Futuro na Casa de Cultura Cidade Ademar.' },
];

/** Encontradas no site atual e deixadas de fora, com o motivo. */
export const excluidas = [
  { origem: '2026/03/cdm.png', motivo: 'Fotos históricas em preto e branco e mapa: origem e direitos desconhecidos.' },
  { origem: '2026/04/Captura-de-tela-2026-04-24-170121.png', motivo: 'Print de reportagem do g1 (imagem de terceiros). Citar com link oficial.' },
  { origem: '2026/05/QR-COSTA-DA-MINA-1.jpg', motivo: 'QR Code com destino desconhecido.' },
  { origem: '2026/05/1-POST-CDM.jpg', motivo: 'Cartaz de divulgação de uma oficina com data e local antigos; pode induzir a erro como agenda.' },
  { origem: '2026/05/pix.png', motivo: 'Marca do Pix (Banco Central): usar apenas segundo o manual da marca, se necessário.' },
  { origem: '2026/03/placeholder*.png (62 arquivos)', motivo: 'Placeholders do tema WordPress.' },
  { origem: '2026/03/*unsplash*.png, smiley-woman, image-13, group-199/200/216/230', motivo: 'Fotos de banco de imagens e peças do tema (estrada, notebook, viajante, neve), sem relação com o Instituto.' },
  { origem: '2026/05/Logo*.png, Crypt-Logo*.png', motivo: 'Logos de outras marcas que vieram com o tema.' },
  { origem: 'youtu.be/wCcsslSqkOE', motivo: 'Vídeo de fundo do Beco no site atual é de outro artista.' },
  { origem: 'Feed do Instagram (20 posts)', motivo: 'Imagens servidas por links temporários do Instagram. Pedir os originais ao Instituto.' },
];

export const urlDe = (origem) => SITE + origem;

import type { ImageMetadata } from 'astro';
import type { IdPendencia } from './pendencias';

import becoCartaz from '../assets/projetos/beco-da-mina-cartaz.png';
import becoAntes from '../assets/fotos/beco-antes.jpg';
import becoMuralCasa from '../assets/fotos/beco-mural-casa-roxa.jpg';
import becoEsboco from '../assets/fotos/beco-helaine-esboco.jpg';
import becoPintura from '../assets/fotos/beco-mural-em-pintura.jpg';
import becoArtistas from '../assets/fotos/beco-artistas.jpg';
import becoFachada from '../assets/fotos/beco-helaine-fachada.jpg';
import becoRosto from '../assets/fotos/beco-mural-rosto.jpg';
import becoAdesivo from '../assets/fotos/beco-adesivo.jpg';

import trancandoCartaz from '../assets/projetos/trancando-o-futuro-cartaz.png';
import trancandoMarca from '../assets/marca/trancando-o-futuro.png';
import oficina1 from '../assets/fotos/oficina-casa-de-cultura.jpg';
import oficina2 from '../assets/fotos/oficina-trancas.jpg';
import oficina3 from '../assets/fotos/oficina-trancas-2.jpg';

import trancaAmigaCartaz from '../assets/projetos/tranca-amiga-cartaz.jpg';
import trancaAmigaMarca from '../assets/marca/tranca-amiga.png';

import sarauCartaz from '../assets/projetos/sarau-trancado.png';

export type Foto = { src: ImageMetadata; alt: string; legenda?: string };

export type Projeto = {
  slug: string;
  nome: string;
  /** Frase curta usada nos cartões. */
  chamada: string;
  resumo: string;
  paragrafos: string[];
  /** Tom do projeto, aplicado como variável CSS --tom. */
  tom: 'laranja' | 'roxo' | 'pessego' | 'magenta';
  capa: Foto;
  /** 'cartaz' mostra a imagem inteira, sem recorte. */
  capaFormato?: 'foto' | 'cartaz';
  marca?: Foto;
  fotos: Foto[];
  fichas: { rotulo: string; valor: string }[];
  citacao?: { texto: string; autoria: string; papel: string };
  video?: { src: string; capa: string; descricao: string };
  links?: { rotulo: string; url: string }[];
  pendencias: IdPendencia[];
};

export const projetos: Projeto[] = [
  {
    slug: 'beco-da-mina',
    nome: 'Beco da Mina',
    chamada: 'Cor e cultura: arte, identidade e futuro.',
    resumo:
      'A primeira ação do Instituto: murais na Rua Osório de Castro, na Vila Inglesa, que transformam um beco esquecido em território de arte e ancestralidade.',
    paragrafos: [
      'O Instituto Costa da Mina inicia suas atividades com uma ação simbólica e transformadora: a pintura dos murais da Rua Osório de Castro, na Vila Inglesa, dando vida ao projeto Beco da Mina.',
      'Com execução artística de Waldir Age e equipe (Age Ação Visual), o projeto marca o primeiro passo de um movimento que une arte, memória e pertencimento.',
      'A iniciativa busca fortalecer o sentimento de comunidade e promover a revitalização estética e urbana da região, marcada por descarte irregular de lixo e degradação visual. A proposta é transformar o espaço físico e simbólico da rua: de beco esquecido a território de arte, ancestralidade e transformação social.',
    ],
    tom: 'laranja',
    capa: {
      src: becoMuralCasa,
      alt: 'Fachada pintada de roxo com mural de três mulheres negras trançando os cabelos umas das outras.',
    },
    marca: { src: becoCartaz, alt: 'Cartaz do Beco da Mina: lata de spray com a cadeira de raízes do Instituto.' },
    fotos: [
      { src: becoAntes, alt: 'Fotos em preto e branco da rua antes dos murais: muros cinzas e calçada vazia.', legenda: 'Antes' },
      { src: becoEsboco, alt: 'Helaine diante de um muro com o esboço do mural e uma escada apoiada.', legenda: 'O esboço' },
      { src: becoPintura, alt: 'Mural em pintura com o rosto de uma mulher cercado de flores e um beija-flor.', legenda: 'Em pintura' },
      { src: becoArtistas, alt: 'Três artistas sorrindo em frente ao mural colorido.', legenda: 'Equipe de artistas' },
      { src: becoFachada, alt: 'Helaine em frente à fachada roxa do Instituto.', legenda: 'A fachada' },
      { src: becoRosto, alt: 'Detalhe de mural: rosto de mulher de olhos fechados, cercado de flores.', legenda: 'Detalhe' },
      { src: becoAdesivo, alt: 'Mão segurando um adesivo "Beco da Mina" diante de um mural.', legenda: 'Beco da Mina' },
    ],
    fichas: [
      { rotulo: 'Onde', valor: 'Rua Osório de Castro, Vila Inglesa' },
      { rotulo: 'Arte', valor: 'Waldir Age e equipe (Age Ação Visual)' },
      { rotulo: 'Linguagem', valor: 'Muralismo e arte urbana' },
    ],
    pendencias: ['imprensa', 'nome-juridico', 'fotos-alta-resolucao'],
  },
  {
    slug: 'trancando-o-futuro',
    nome: 'Trançando o Futuro',
    chamada: 'Oficinas gratuitas de tranças como caminho de autonomia.',
    resumo:
      'Oficinas gratuitas de tranças, em parceria com a Casa de Cultura Cidade Ademar, como ferramenta de desenvolvimento social, educacional, cultural e profissional.',
    paragrafos: [
      'O Trançando o Futuro nasce do propósito de transformar vidas por meio do conhecimento, da cultura e do cuidado coletivo. Idealizada pela trancista fundadora do Instituto, em parceria com a Casa de Cultura Cidade Ademar, a iniciativa oferece oficinas gratuitas de tranças como ferramenta de desenvolvimento social, educacional, cultural e profissional.',
      'Mais do que ensinar uma técnica, o projeto cria um espaço de acolhimento, troca e fortalecimento de identidade, especialmente para pessoas em situação de vulnerabilidade. A prática das tranças, profundamente conectada às raízes afro-brasileiras, é ressignificada como caminho de autonomia, geração de renda e valorização cultural.',
      'Ao integrar a comunidade local, o Trançando o Futuro contribui para garantir direitos fundamentais, ampliar oportunidades e construir redes de apoio que fortalecem o pertencimento e a dignidade.',
    ],
    tom: 'roxo',
    capa: {
      src: oficina1,
      alt: 'Oficina de tranças na Casa de Cultura: uma instrutora orienta uma aluna que trança o cabelo de outra pessoa.',
    },
    marca: { src: trancandoMarca, alt: 'Marca do Trançando o Futuro: um nó de trança em forma de infinito.' },
    fotos: [
      { src: oficina2, alt: 'Participantes trançando cabelos durante a oficina na Casa de Cultura.', legenda: 'Na oficina' },
      { src: oficina3, alt: 'Duas participantes trabalham juntas em uma trança.', legenda: 'Troca de saberes' },
      { src: trancandoCartaz, alt: 'Cartaz roxo e laranja do Trançando o Futuro com rostos de mulheres negras trançadas.' },
    ],
    fichas: [
      { rotulo: 'Formato', valor: 'Oficinas gratuitas de tranças' },
      { rotulo: 'Parceria', valor: 'Casa de Cultura Cidade Ademar' },
      { rotulo: 'Para quem', valor: 'Comunidade, com atenção a pessoas em situação de vulnerabilidade' },
    ],
    citacao: {
      texto:
        'Educar é a forma mais bonita de desenhar o amanhã. Que alegria ver o Trançando o Futuro ocupando espaços tão vitais como a Casa da Cultura. Vamos juntes construir caminhos de mais prazer, respeito e consciência!',
      autoria: 'Helaine Cristina',
      papel: 'Trancista e presidente do Instituto',
    },
    video: {
      src: 'trancando-o-futuro.mp4',
      capa: 'trancando-o-futuro-capa.jpg',
      descricao: 'Vídeo de uma oficina do Trançando o Futuro na Casa de Cultura Cidade Ademar.',
    },
    pendencias: ['trancando-nome', 'trancando-agenda'],
  },
  {
    slug: 'tranca-amiga',
    nome: 'Trança Amiga',
    chamada: 'Beleza como direito: tranças gratuitas para momentos importantes.',
    resumo:
      'Serviços gratuitos de trançado para pessoas da comunidade que precisam se preparar para momentos importantes, como entrevistas de emprego e eventos.',
    paragrafos: [
      'Trança Amiga é um projeto social do Instituto Costa da Mina voltado à promoção da autoestima, da inclusão e da valorização da identidade cultural por meio da estética afro. A iniciativa oferece, de forma gratuita, serviços de trançado capilar para pessoas da comunidade que precisam se preparar para momentos importantes, como entrevistas de emprego, eventos ou outras ocasiões que impactam diretamente sua autoconfiança e apresentação pessoal.',
      'Inserido em um ecossistema de ações comunitárias, ao lado do Sarau Trançado, do Beco da Mina e do Trançando o Futuro, o projeto atua como ferramenta de transformação social, ampliando o acesso a cuidados estéticos muitas vezes limitados por questões financeiras. Mais do que um serviço, fortalece vínculos comunitários, resgata a ancestralidade e reafirma a beleza como um direito, promovendo dignidade e pertencimento.',
      'É uma ação construída da comunidade para a comunidade, baseada em solidariedade, troca de saberes e valorização das raízes culturais.',
    ],
    tom: 'pessego',
    capaFormato: 'cartaz',
    capa: { src: trancaAmigaCartaz, alt: 'Cartaz roxo do Trança Amiga com o símbolo de um coração formado por tranças.' },
    marca: { src: trancaAmigaMarca, alt: 'Marca do Trança Amiga: coração desenhado por duas tranças.' },
    fotos: [],
    fichas: [
      { rotulo: 'Formato', valor: 'Trançado capilar gratuito' },
      { rotulo: 'Para quem', valor: 'Pessoas da comunidade com entrevistas de emprego, eventos e outros momentos importantes' },
      { rotulo: 'Quem conduz', valor: 'Trancista com mais de 30 anos de experiência' },
    ],
    pendencias: ['tranca-amiga-como-participar'],
  },
  {
    slug: 'sarau-trancado',
    nome: 'Sarau Trançado',
    chamada: 'Ação comunitária do ecossistema Costa da Mina.',
    resumo: 'Uma das ações comunitárias do ecossistema do Instituto Costa da Mina. Acompanhe a programação pelo Instagram.',
    paragrafos: [
      'O Sarau Trançado faz parte do ecossistema de ações comunitárias do Instituto Costa da Mina, ao lado do Beco da Mina, do Trançando o Futuro e do Trança Amiga.',
      'A programação e as novidades são divulgadas no perfil @sarau.trancado.',
    ],
    tom: 'magenta',
    capaFormato: 'cartaz',
    capa: { src: sarauCartaz, alt: 'Cartaz do Sarau Trançado: microfone sobre fundo em tons de rosa, roxo e azul.' },
    fotos: [],
    fichas: [{ rotulo: 'Instagram', valor: '@sarau.trancado' }],
    links: [{ rotulo: 'Seguir @sarau.trancado', url: 'https://www.instagram.com/sarau.trancado/' }],
    pendencias: ['sarau-descricao'],
  },
];

export const buscarProjeto = (slug: string) => projetos.find((p) => p.slug === slug);

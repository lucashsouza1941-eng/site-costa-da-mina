// Projetos do Instituto. Textos longos: site anterior (docs/INVENTARIO.md).
// Textos curtos dos cards: design aprovado pela equipe.
// Imagens: acervo oficial (docs/IMAGENS.md).
import type { Projeto } from './tipos.ts';
import { imagem } from './acervo.ts';

export const projetos: Projeto[] = [
  {
    slug: 'beco-da-mina',
    nome: 'Beco da Mina',
    resumoCard: 'Arte urbana que revitaliza territórios e transforma realidades.',
    chamada: 'Arte, ancestralidade e pertencimento.',
    paragrafos: [
      'O Instituto Costa da Mina inicia suas atividades com uma ação simbólica e transformadora: a pintura dos murais da Rua Osório de Castro, na Vila Inglesa, dando vida ao projeto Beco da Mina.',
      'Com execução artística de Waldir Age e equipe (Age Ação Visual), o projeto marca o primeiro passo de um movimento que une arte, memória e pertencimento.',
      'A iniciativa busca fortalecer o sentimento de comunidade e promover a revitalização estética e urbana da região, marcada por descarte irregular de lixo e degradação visual. A proposta é transformar o espaço físico e simbólico da rua: de beco esquecido a território de arte, ancestralidade e transformação social.',
    ],
    fichas: [
      { rotulo: 'Onde', valor: 'Rua Osório de Castro, Vila Inglesa' },
      { rotulo: 'Arte', valor: 'Waldir Age e equipe (Age Ação Visual)' },
      { rotulo: 'Linguagem', valor: 'Muralismo e arte urbana' },
    ],
    capa: imagem('beco-mural-trancistas'),
    marca: imagem('beco-cartaz'),
    fotos: [
      imagem('beco-antes'),
      imagem('beco-esboco'),
      imagem('beco-pintura'),
      imagem('beco-artistas'),
      imagem('beco-fachada'),
      imagem('beco-mural-rosto'),
      imagem('beco-letreiro'),
      imagem('beco-adesivo-mural'),
      imagem('beco-adesivo-rua'),
    ],
  },
  {
    slug: 'trancando-o-futuro',
    nome: 'Trançando o Futuro',
    resumoCard: 'Formação e geração de renda para novas histórias.',
    chamada: 'Oficinas gratuitas de tranças como caminho de autonomia.',
    paragrafos: [
      'O Trançando o Futuro nasce do propósito de transformar vidas por meio do conhecimento, da cultura e do cuidado coletivo. Idealizada pela trancista fundadora do Instituto, em parceria com a Casa de Cultura Cidade Ademar, a iniciativa oferece oficinas gratuitas de tranças como ferramenta de desenvolvimento social, educacional, cultural e profissional.',
      'Mais do que ensinar uma técnica, o projeto cria um espaço de acolhimento, troca e fortalecimento de identidade, especialmente para pessoas em situação de vulnerabilidade. A prática das tranças, profundamente conectada às raízes afro-brasileiras, é ressignificada como caminho de autonomia, geração de renda e valorização cultural.',
      'Ao integrar a comunidade local, o Trançando o Futuro contribui para garantir direitos fundamentais, ampliar oportunidades e construir redes de apoio que fortalecem o pertencimento e a dignidade.',
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
    capa: imagem('trancando-oficina'),
    marca: imagem('trancando-marca'),
    fotos: [imagem('trancando-oficina-2'), imagem('trancando-oficina-3'), imagem('trancando-cartaz')],
  },
  {
    slug: 'tranca-amiga',
    nome: 'Trança Amiga',
    resumoCard: 'Beleza, autoestima e inclusão na comunidade.',
    chamada: 'Beleza como direito: tranças gratuitas para momentos importantes.',
    paragrafos: [
      'Trança Amiga é um projeto social do Instituto Costa da Mina voltado à promoção da autoestima, da inclusão e da valorização da identidade cultural por meio da estética afro. A iniciativa oferece, de forma gratuita, serviços de trançado capilar para pessoas da comunidade que precisam se preparar para momentos importantes, como entrevistas de emprego, eventos ou outras ocasiões que impactam diretamente sua autoconfiança e apresentação pessoal.',
      'Inserido em um ecossistema de ações comunitárias, ao lado do Sarau Trançado, do Beco da Mina e do Trançando o Futuro, o projeto atua como ferramenta de transformação social, ampliando o acesso a cuidados estéticos muitas vezes limitados por questões financeiras. Mais do que um serviço, fortalece vínculos comunitários, resgata a ancestralidade e reafirma a beleza como um direito, promovendo dignidade e pertencimento.',
      'É uma ação construída da comunidade para a comunidade, baseada em solidariedade, troca de saberes e valorização das raízes culturais.',
    ],
    fichas: [
      { rotulo: 'Formato', valor: 'Trançado capilar gratuito' },
      { rotulo: 'Para quem', valor: 'Pessoas da comunidade com entrevistas de emprego, eventos e outros momentos importantes' },
      { rotulo: 'Quem conduz', valor: 'Trancista com mais de 30 anos de experiência' },
    ],
    capa: { ...imagem('tranca-amiga-banner'), foco: '50% 50%' },
    marca: imagem('tranca-amiga-marca'),
    fotos: [imagem('tranca-amiga-cartaz')],
  },
  {
    slug: 'sarau-trancado',
    nome: 'Sarau Trançado',
    resumoCard: 'Música, poesia e cultura da nossa comunidade.',
    chamada: 'Ação comunitária do ecossistema Costa da Mina.',
    paragrafos: [
      'O Sarau Trançado faz parte do ecossistema de ações comunitárias do Instituto Costa da Mina, ao lado do Beco da Mina, do Trançando o Futuro e do Trança Amiga.',
      'A programação e as novidades são divulgadas no perfil @sarau.trancado.',
    ],
    fichas: [{ rotulo: 'Instagram', valor: '@sarau.trancado' }],
    links: [{ rotulo: 'Seguir @sarau.trancado', url: 'https://www.instagram.com/sarau.trancado/' }],
    capa: imagem('sarau-cartaz'),
    fotos: [],
  },
];

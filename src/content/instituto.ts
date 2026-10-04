/**
 * Informações oficiais do Instituto Costa da Mina.
 *
 * Tudo aqui foi conferido no site anterior (inventário em docs/INVENTARIO.md).
 * O que ainda não foi confirmado NÃO entra neste arquivo: vai para
 * src/data/pendencias.ts e só aparece em desenvolvimento.
 */

export const instituto = {
  nome: 'Instituto Costa da Mina',
  nomeCurto: 'Costa da Mina',
  lema: ['Raízes que educam,', 'cultura que transforma,', 'futuro que floresce.'],
  chamado: 'Enraizar e florescer!',
  territorio: 'Cidade Ademar, Zona Sul de São Paulo',

  endereco: {
    logradouro: 'R. Osório de Castro, 109',
    bairro: 'Vila Inglesa',
    distrito: 'Cidade Ademar',
    cidade: 'São Paulo',
    uf: 'SP',
  },

  email: 'contato.costadamina@gmail.com',
  whatsapp: {
    exibicao: '(11) 95858-1395',
    numero: '5511958581395',
  },

  cnpj: '62.212.632/0001-76',
  /** A chave PIX só é exibida depois que o Instituto confirmar (pendência pix-validacao). */
  pixValidado: false,

  redes: {
    instagram: { usuario: 'instituto.costadamina', url: 'https://www.instagram.com/instituto.costadamina/' },
    sarau: { usuario: 'sarau.trancado', url: 'https://www.instagram.com/sarau.trancado/' },
  },

  fundadora: {
    nome: 'Helaine Cristina',
    papel: 'Trancista e presidente do Instituto',
    salao: 'Helaine Tranças',
  },
} as const;

export const enderecoCompleto = `${instituto.endereco.logradouro} – ${instituto.endereco.bairro} – ${instituto.endereco.distrito} – ${instituto.endereco.cidade}/${instituto.endereco.uf}`;

export const linkWhatsApp = (mensagem?: string) =>
  `https://wa.me/${instituto.whatsapp.numero}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ''}`;

export const linkMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${instituto.endereco.logradouro}, ${instituto.endereco.bairro}, ${instituto.endereco.cidade} - ${instituto.endereco.uf}`,
)}`;

/** Metas do instituto, como publicadas na página "Sobre". */
export const metas = [
  {
    titulo: 'Cultura e arte',
    texto: 'Promover eventos culturais e artísticos e projetos de oficinas de arte, gerando impacto cultural regional.',
  },
  {
    titulo: 'Oficinas',
    texto: 'Planejar e executar oficinas de música, dança, teatro, artes visuais, poesia e linguagens artísticas diversas.',
  },
  {
    titulo: 'Trança como profissão',
    texto: 'Capacitar a comunidade para se tornar profissional trancista, abrindo portas para uma nova fonte de renda, com flexibilidade.',
  },
] as const;

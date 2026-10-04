// Dados estruturados (schema.org) em JSON-LD.
import { instituto, linkWhatsApp } from '@/content/instituto';
import { urlAbsoluta } from './site';

export function organizacao() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: instituto.nome,
    url: urlAbsoluta('/'),
    logo: urlAbsoluta('/icon.png'),
    slogan: instituto.lema.join(' '),
    email: instituto.email,
    telephone: '+55 11 95858-1395',
    address: {
      '@type': 'PostalAddress',
      streetAddress: instituto.endereco.logradouro,
      addressLocality: `${instituto.endereco.bairro}, ${instituto.endereco.distrito}, ${instituto.endereco.cidade}`,
      addressRegion: instituto.endereco.uf,
      addressCountry: 'BR',
    },
    areaServed: instituto.territorio,
    sameAs: [instituto.redes.instagram.url],
    contactPoint: { '@type': 'ContactPoint', contactType: 'atendimento', url: linkWhatsApp(), availableLanguage: 'pt-BR' },
  };
}

/** Trilha de navegação; o último item (página atual) pode vir sem caminho. */
export function trilhaDeNavegacao(itens: { nome: string; caminho?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nome,
      ...(item.caminho ? { item: urlAbsoluta(item.caminho) } : {}),
    })),
  };
}

/** Serializa para <script type="application/ld+json"> sem permitir fechar a tag. */
export const jsonLd = (dados: unknown) => ({ __html: JSON.stringify(dados).replace(/</g, '\u003c') });

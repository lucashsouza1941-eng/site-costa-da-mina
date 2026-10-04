import type { MetadataRoute } from 'next';
import { listarNoticias, listarProjetos } from '@/lib/conteudo';
import { urlAbsoluta } from '@/lib/site';

export const dynamic = 'force-static';

// Só páginas públicas. O módulo de cursos (/cursos/, /presenca/, /painel/)
// fica fora de propósito, assim como a página técnica /noticias/em-breve/.
export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ['/', '/instituto/', '/projetos/', '/agenda/', '/noticias/', '/galeria/', '/apoie/', '/contato/', '/privacidade/', '/termos/'];
  return [
    ...fixas.map((caminho) => ({ url: urlAbsoluta(caminho), changeFrequency: 'monthly' as const, priority: caminho === '/' ? 1 : 0.7 })),
    ...listarProjetos().map((p) => ({ url: urlAbsoluta(`/projetos/${p.slug}/`), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...listarNoticias().map((n) => ({ url: urlAbsoluta(`/noticias/${n.slug}/`), lastModified: n.data, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ];
}

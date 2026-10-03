import type { MetadataRoute } from 'next';
import { urlAbsoluta } from '@/lib/site';

export const dynamic = 'force-static';

// Completado na Fase 7 com todas as páginas internas.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: urlAbsoluta('/'), changeFrequency: 'weekly', priority: 1 }];
}

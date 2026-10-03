import type { MetadataRoute } from 'next';
import { indexavel, urlAbsoluta } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (!indexavel) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: urlAbsoluta('/sitemap.xml') };
}

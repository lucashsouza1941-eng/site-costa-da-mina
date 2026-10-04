import type { MetadataRoute } from 'next';
import { basePath } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Instituto Costa da Mina',
    short_name: 'Costa da Mina',
    description: 'Raízes que educam, cultura que transforma, futuro que floresce.',
    lang: 'pt-BR',
    start_url: `${basePath}/`,
    display: 'browser',
    background_color: '#fbf5ea',
    theme_color: '#2e113c',
    icons: [{ src: `${basePath}/icon.png`, sizes: '512x512', type: 'image/png' }],
  };
}

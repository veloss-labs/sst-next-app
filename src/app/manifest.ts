import type { MetadataRoute } from 'next';
import { PAGE_ENDPOINTS } from '~/constants/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'barcelona_web',
    name: 'Threads',
    short_name: 'Threads',
    description:
      'Instagram의 새로운 텍스트 앱, Threads에서 더 많은 대화를 나누어보세요',
    start_url: PAGE_ENDPOINTS.ROOT,
    orientation: 'landscape-primary',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        purpose: 'any',
        src: '/icons/icon_192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        purpose: 'any',
        src: '/icons/icon_512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        src: '/icons/icon_maskable_192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        purpose: 'maskable',
        src: '/icons/icon_maskable_512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        purpose: 'any',
        src: '/icons/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
    ],
    lang: 'ko-KR',
  };
}

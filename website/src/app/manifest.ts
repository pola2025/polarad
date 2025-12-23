import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '폴라애드 - 온라인 영업 자동화 솔루션',
    short_name: '폴라애드',
    description: '중소기업을 위한 온라인 영업 자동화 솔루션. 홈페이지 제작, Meta 광고, 인쇄물을 한 번에.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#2563EB',
    orientation: 'portrait',
    scope: '/',
    lang: 'ko',
    categories: ['business', 'marketing', 'productivity'],
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

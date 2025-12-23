import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Yeti', // 네이버 봇
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // AI 크롤러 - 콘텐츠 수집 허용
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'ChatGPT-User', // OpenAI ChatGPT
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Claude-Web', // Anthropic Claude
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'anthropic-ai', // Anthropic
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Bytespider', // ByteDance AI
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'CCBot', // Common Crawl (AI 학습 데이터)
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
      {
        userAgent: 'Google-Extended', // Google AI (Bard/Gemini)
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: 'https://polarad.co.kr/sitemap.xml',
  }
}

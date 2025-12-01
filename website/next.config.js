/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'polaad.co.kr',
      },
    ],
  },

  // 압축 활성화
  compress: true,

  // 엄격 모드
  reactStrictMode: true,

  // 실험적 기능
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // 헤더 설정 (보안 + SEO)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },

  // 리다이렉트 (www 제거)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.polaad.co.kr',
          },
        ],
        destination: 'https://polaad.co.kr/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@polarad/ui', '@polarad/database'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  // 검색엔진 크롤링 차단
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet, noimageindex',
          },
        ],
      },
    ]
  },
}

export default nextConfig

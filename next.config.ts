import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverSourceMaps: true,
  },
  images: {
    remotePatterns: [
      // Only allow localhost in development
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              protocol: 'http' as const,
              hostname: 'localhost',
              port: '3000',
              pathname: '/uploads/**',
            },
            {
              protocol: 'https' as const,
              hostname: 'localhost',
              port: '3000',
              pathname: '/uploads/**',
            },
          ]
        : []),
      // For production - add your domain here
      // {
      //   protocol: 'https',
      //   hostname: 'your-domain.com',
      //   pathname: '/uploads/**',
      // },
    ],
  },
}

export default nextConfig

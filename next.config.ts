import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // Generowanie statycznej wersji
  images: {
    unoptimized: true, // Wymagane dla static export
    domains: [
      'static-cdn.jtvnw.net', // dla miniaturek Twitch
      'i.ytimg.com', // dla miniaturek YouTube
    ],
  },
  trailingSlash: true, // Dodaje slash na końcu URLi dla lepszej kompatybilności z hostingiem
}

export default nextConfig

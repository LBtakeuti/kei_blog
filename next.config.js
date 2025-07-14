/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    domains: ['localhost'],
    // ローカルの画像を許可
    unoptimized: true,
  },
}

module.exports = nextConfig
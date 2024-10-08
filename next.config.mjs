/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',
    images: {
      unoptimized: true,
    },
    assetPrefix: '/portfolio',
    basePath: '/portfolio',
  }

export default nextConfig;

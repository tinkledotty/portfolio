/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ['your-image-domain.com'], // Add any domains you're loading images from
    },
  }

export default nextConfig;

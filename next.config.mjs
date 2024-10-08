/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
          {
            source: '/:path*',
            destination: 'https://portfolio-slpp.vercel.app/:path*',
          },
        ]
      },

};

export default nextConfig;

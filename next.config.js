/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.communitydragon.org',
      },
      {
        protocol: 'https',
        hostname: 'wiki.leagueoflegends.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */

const nextConfig = {
  productionBrowserSourceMaps: true,

  // Configuration for handling remote images from various sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/redqteam.com/isomorphic-furyroad/public/**',
      },
      {
        protocol: 'https',
        hostname: 'isomorphic-furyroad.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'isomorphic-furyroad.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'partspluseg.com',
        pathname: '/**',
      },
    ],
  },

  // Enable React strict mode for identifying potential issues in the app

  // Allows you to transpile specific npm packages if required

  // ESLint configuration: This will ignore linting errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration: This will skip TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

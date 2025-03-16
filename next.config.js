/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable experimental features
  experimental: {
    // Enable server actions
    serverActions: true,
    // Enable partial prerendering (preview)
    partialPrerendering: true,
  },
  // Optimize production builds
  swcMinify: true,
  // Enable webpack 5
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = nextConfig;

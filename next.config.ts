/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Maximum body size for server actions
    },
  },
};

export const maxDuration = 60; // 60 seconds timeout for Vercel functions

export default nextConfig;

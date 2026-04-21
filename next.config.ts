/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // <--- This is the magic key!
    },
  },
};

export default nextConfig;

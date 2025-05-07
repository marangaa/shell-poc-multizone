import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*",
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/:path*' // Local development
          : 'https://flow-poc-multizone.vercel.app/:path*', // Production
      },
    ];
  },
};

export default nextConfig;

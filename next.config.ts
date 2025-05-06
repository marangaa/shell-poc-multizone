import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/dash',
        destination: 'http://localhost:3001/dash',
      },
      {
        source: '/dash/:path*',
        destination: 'http://localhost:3001/dash/:path*',
      },
      {
        source: '/dash-static/:path*',
        destination: 'http://localhost:3001/dash-static/:path*',
      },
    ];
  },
  experimental: {
    serverActions: {
      // Allow the user-facing origin since we're serving multiple applications
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
};

export default nextConfig;

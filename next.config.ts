import type { NextConfig } from "next";

// Get dash app URL from environment variable or use default values for dev/prod
const DASH_URL = process.env.NEXT_PUBLIC_DASH_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://dash-poc-multizone.vercel.app' 
    : 'http://localhost:3001');

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/dash',
        destination: `${DASH_URL}/dash`,
      },
      {
        source: '/dash/:path*',
        destination: `${DASH_URL}/dash/:path*`,
      },
      {
        source: '/dash-static/:path*',
        destination: `${DASH_URL}/dash-static/:path*`,
      },
    ];
  },
  experimental: {
    serverActions: {
      // Allow the user-facing origin since we're serving multiple applications
      allowedOrigins: [
        'localhost:3000', 
        'localhost:3001', 
        'shell-poc-multizone.vercel.app',
        'dash-poc-multizone.vercel.app'
      ],
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*",
        destination: "https://flow-poc-multizone.vercel.app/:path*"
      },
      {
        // Add rewrite for flow app's static assets
        source: "/flow-static/:path*",
        destination: "https://flow-poc-multizone.vercel.app/flow-static/:path*"
      }
    ];
  },
  serverActions: {
    // Allow Server Actions from the flow app domain
    allowedOrigins: [
      // Development
      "localhost:3001",
      // Production
      "flow-poc-multizone.vercel.app"
    ],
  },
};

export default nextConfig;

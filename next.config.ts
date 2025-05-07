import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*",
        destination: "https://flow-poc-multizone.vercel.app/flow/:path*"
      },
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

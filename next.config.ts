import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*",
        destination: "http://localhost:3001/flow/:path*", // Proxy to flow app
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// For local development, this should be the URL where your flow app is running,
// including its basePath if it has one (e.g., http://localhost:3001/flow).
// For production, this should be the deployed URL of your flow app,
// including its basePath (e.g., https://flow-poc-multizone.vercel.app/flow).
const flowAppRewriteDestination = process.env.FLOW_APP_REWRITE_DESTINATION || "http://localhost:3001/flow";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*",
        // The destination needs to correctly append the :path* from the source.
        // If flowAppRewriteDestination is "http://host/base", this becomes "http://host/base/:path*"
        destination: `${flowAppRewriteDestination}/:path*`,
      },
    ];
  },
};

export default nextConfig;

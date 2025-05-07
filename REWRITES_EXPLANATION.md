\
# Shell App: `next.config.ts` - Rewrites Explained

The `next.config.ts` file in the Shell application is configured to proxy requests intended for the Flow app using Next.js rewrites. The destination for these rewrites is made configurable via an environment variable, allowing for different URLs in development and production.

```typescript
// shell/next.config.ts
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
        source: "/flow/:path*", // Matches requests to /flow/...
        // The destination needs to correctly append the :path* from the source.
        // If flowAppRewriteDestination is "http://host/base", this becomes "http://host/base/:path*"
        destination: `${flowAppRewriteDestination}/:path*`, // Proxies to the flow app
      },
    ];
  },
};

export default nextConfig;
```

**Key Concepts:**

*   **`FLOW_APP_REWRITE_DESTINATION` Environment Variable**: This variable is used to define the base URL (including its own `basePath` like `/flow`) of the Flow application to which requests should be proxied. This allows you to set `http://localhost:3002/flow` (or similar, matching your Flow app's dev port and `basePath`) for local development in your `.env.local` file, and a different URL (e.g., `https://your-flow-app-prod-url.com/flow`) for production environments (typically set in your hosting provider's settings, like Vercel).

*   **`rewrites` function**: This function is used to set up a reverse proxy. It allows the Shell app to intercept requests matching a specific pattern and forward them to the destination defined by `flowAppRewriteDestination`.

*   **`source: "/flow/:path*"`**:
    *   This defines the pattern for incoming requests that the Shell app should intercept.
    *   Any request made to the Shell app's domain where the path starts with `/flow/` will be matched.
    *   The `:path*` part is a wildcard that captures any characters or segments that follow `/flow/`.

*   **`destination: \`${flowAppRewriteDestination}/:path*\``**:
    *   This specifies where the intercepted request should be forwarded. The actual URL is constructed by taking the `flowAppRewriteDestination` environment variable and appending `/:path*` to it. This ensures that the full path from the original request is passed to the Flow app.
    *   **During Development**: If `FLOW_APP_REWRITE_DESTINATION` is set to `http://localhost:3002/flow` in `.env.local`, a request to `/flow/some/page` on the shell app will be proxied to `http://localhost:3002/flow/some/page`.
    *   **For Production**: If `FLOW_APP_REWRITE_DESTINATION` is set to `https://<your-flow-app-domain>/flow` in your Vercel environment variables, a request to `/flow/some/page` on the shell app will be proxied to `https://<your-flow-app-domain>/flow/some/page`.

This dynamic rewrite configuration is essential for the multi-zone setup, enabling the Shell app to act as the primary entry point and seamlessly integrate the Flow app under a unified domain across different deployment environments.

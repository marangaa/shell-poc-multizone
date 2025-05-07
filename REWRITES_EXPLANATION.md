\
# Shell App: `next.config.ts` - Rewrites Explained

The `next.config.ts` file in the Shell application is configured to proxy requests intended for the Flow app using Next.js rewrites.

```typescript
// shell/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*", // Matches requests to /flow/...
        destination: "http://localhost:3001/flow/:path*", // Proxies to the flow app
      },
    ];
  },
};

export default nextConfig;
```

**Key Concepts:**

*   **`rewrites` function**: This function is used to set up a reverse proxy within the Next.js application. It allows the Shell app to intercept requests matching a specific pattern and forward them to a different destination, such as another running application (the Flow app in this case).

*   **`source: "/flow/:path*"`**:
    *   This defines the pattern for incoming requests that the Shell app should intercept.
    *   Any request made to the Shell app's domain where the path starts with `/flow/` will be matched by this rule.
    *   The `:path*` part is a wildcard that captures any characters or segments that follow `/flow/` in the URL. For example, it would match `/flow/some-page` or `/flow/items/details?id=123`.

*   **`destination: "http://localhost:3001/flow/:path*"`**:
    *   This specifies where the intercepted request should be forwarded.
    *   **During Development**: It's assumed the Flow app is running on `http://localhost:3001`. The request is sent to this address, maintaining the `/flow/` prefix and any subsequent path segments (due to `:path*`). This ensures the Flow app receives the request with the path structure it expects (as defined by its own `basePath: "/flow"` configuration).
    *   **For Production**: This destination URL must be updated to point to the actual deployed URL of the Flow application (e.g., `https://<your-flow-app-domain>/flow/:path*`).

This rewrite configuration is essential for the multi-zone setup, enabling the Shell app to act as the primary entry point and seamlessly integrate the Flow app under a unified domain, while still allowing them to be developed and deployed as separate applications.

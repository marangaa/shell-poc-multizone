# Multi-Zone Next.js Application Setup (Shell & Flow Apps)

This document outlines the setup for the multi-zone Next.js application within this repository, consisting of a `shell` application and a `flow` application. The `shell` app acts as the primary entry point and handles authentication, while the `flow` app is a separate zone served under a subpath of the `shell` app's domain.

## Concept

The multi-zone architecture allows for breaking down a large application into smaller, independently deployable units. In this specific setup:
- The **Shell App** (located in the `shell/` directory, typically runs on `http://localhost:3000`) is the main application. It manages user authentication (using NextAuth.js as configured in `shell/src/auth.ts`) and proxies requests to other zones.
- The **Flow App** (located in the `flow/` directory, typically runs on `http://localhost:3001` during development) is a distinct zone that operates under the `/flow` path of the shell application (e.g., `http://localhost:3000/flow`).

This setup enables shared authentication and a unified user experience under a single domain, even though the applications can be developed and deployed separately.

## 1. Shell Application Setup (`shell/`)

The shell application is responsible for routing requests to the `flow` app and managing authentication.

### `next.config.ts` (Shell App)

The `next.config.ts` file in the `shell` app is configured to proxy requests intended for the `flow` app.

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
- **`rewrites`**: This function sets up a reverse proxy.
  - `source: "/flow/:path*"`: Any request to the shell app that starts with `/flow/` will be matched.
  - `destination: "http://localhost:3001/flow/:path*"`: The matched request is forwarded to the `flow` app, which is assumed to be running on `http://localhost:3001` during development. The `/flow` prefix is maintained in the destination URL to align with the `flow` app's `basePath`. For production, this destination URL would point to the deployed `flow` application's address.

### Authentication (`shell/src/auth.ts` & API Route)

The `shell` app handles user authentication using NextAuth.js (configured in `shell/src/auth.ts` and `shell/src/app/api/auth/[...nextauth]/route.ts`). Upon successful login, NextAuth.js sets an HTTP-only session cookie scoped to the `shell` app's domain (e.g., `localhost` during development).

## 2. Flow Application Setup (`flow/`)

The `flow` application is configured to be served under a specific base path.

### `next.config.ts` (Flow App)

The `next.config.ts` file in the `flow` app specifies its `basePath`.

```typescript
// flow/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/flow", // Serve the flow app under the /flow path
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-cdn.com/flow' : undefined,
};

export default nextConfig;
```
- **`basePath: "/flow"`**: This tells Next.js that all assets and pages for the `flow` app should be prefixed with `/flow`. This ensures that links within the `flow` app work correctly and that it integrates seamlessly with the `shell` app's proxy setup.
- **`assetPrefix` (Optional)**: For production, you might uncomment and configure `assetPrefix` if you serve static assets from a CDN. The value should also include the `basePath` (e.g., `https://your-cdn.com/flow`).

### Cookie Usage for Authentication

Since the `flow` app is accessed via the `shell` app's domain (e.g., `http://localhost:3000/flow`), the browser automatically sends the authentication cookies (set by the `shell` app) with every request to the `flow` app.

The `flow` app can then:
- **Server-Side**: Access these cookies in Server Components, API routes, or Route Handlers to verify the user's session or retrieve session data. The example `flow/src/app/page.tsx` demonstrates reading cookies server-side using `next/headers`.
- **Client-Side**: While the session cookie is typically `HttpOnly` and not directly accessible via JavaScript (`document.cookie`), client-side components in the `flow` app can make API calls to:
    - Its own backend (e.g., `/flow/api/some-data`), which will receive the cookie.
    - The `shell` app's backend (e.g., `/api/user-info`) to get user-specific data.

## 3. Running the Applications Locally

To run the multi-zone setup:

1.  **Start the Shell App**:
    Open a terminal, navigate to the `shell/` directory, and run:
    ```bash
    npm run dev
    # Or yarn dev / pnpm dev
    ```
    The shell app will typically start on `http://localhost:3000`.

2.  **Start the Flow App**:
    Open a *new* terminal, navigate to the `flow/` directory, and run:
    ```bash
    npm run dev
    # Or yarn dev / pnpm dev
    ```
    The flow app will typically start on the next available port, usually `http://localhost:3001` (as configured in the shell app's rewrite rule). The terminal output will confirm the port.

## 4. Accessing the Applications

-   **Shell App**: Navigate to `http://localhost:3000` in your browser.
-   **Flow App**: Navigate to `http://localhost:3000/flow` in your browser. You will be accessing the `flow` app's content, served via the `shell` app.

## 5. Token and Data Sharing

The primary method for sharing authentication status and tokens is through **cookies**:
1.  The `shell` app authenticates the user and sets a session cookie.
2.  When the user navigates to a `/flow/*` path, the browser sends this cookie along with the request to the `shell` app.
3.  The `shell` app's rewrite rule proxies the request (including cookies) to the `flow` app.
4.  The `flow` app's backend (Server Components, API routes) can then read this cookie to determine the user's authentication state and access session information.

This setup ensures that the `flow` app can operate with the user context established by the `shell` app without needing its own separate authentication mechanism.

## 6. Linking Between Zones

-   **From `shell` to `flow`**: Use a regular `<a>` tag to ensure a full page navigation to the other zone.
    ```html
    <a href="/flow/some-page">Go to Flow App Page</a>
    ```
-   **From `flow` to `shell`**: Use a regular `<a>` tag with the absolute path from the root of the domain.
    ```html
    <a href="/dashboard">Go to Shell App Dashboard</a>
    ```
-   **Within the `flow` app**: Use the Next.js `<Link>` component. `basePath` is handled automatically.
    ```tsx
    import Link from 'next/link';
    // Navigates to /flow/another-page
    <Link href="/another-page">Another Page in Flow</Link>
    ```

## 7. Production Deployment Considerations

-   **Rewrite Destination**: Update the `destination` URL in the `shell` app's `next.config.js` to point to the production URL of the deployed `flow` application.
-   **`assetPrefix`**: If using a CDN for the `flow` app's assets, configure `assetPrefix` in `flow/next.config.ts`.
-   **Environment Variables**: Ensure both applications have the necessary environment variables for their respective configurations and any shared services.
-   **Reverse Proxy (Alternative to Rewrites)**: For more complex setups or if you prefer to manage routing at the infrastructure level, a dedicated reverse proxy (like Nginx or a cloud load balancer) can be configured to route requests to the appropriate application based on the path. This can sometimes offer more flexibility and performance benefits over Next.js rewrites for multi-zone routing.

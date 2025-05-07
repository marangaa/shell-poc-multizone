# 🏗️ Next.js Multi-Zone Setup for Pluto Client Portal

This document outlines how to implement a Next.js Multi-Zone architecture for the Pluto client partners portal. This approach allows us to split our application into independent Next.js applications that share the same domain.

## 🔍 Overview

We will have two separate Next.js applications:

1. **Main Application** (current repo: `pluto-client-partners`)
   - 🏠 Serves most of the portal functionality
   - 🌐 Hosted at: `https://app.gopluto.co/`

2. **Flows Application** (new repo to be created)
   - 📊 Serves the flows dashboard functionality
   - 🔄 Will handle routes under: `https://app.gopluto.co/portal/dashboard/flows`

## 1️⃣ Configuring the Main Application (pluto-client-partners)

### 🛠️ Update next.config.js

Add the following configuration to your `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/portal/dashboard/flows/:path*',
        destination: 'https://flows.app.gopluto.co/:path*', // This will be the internal URL where we deploy the Flows app
      },
    ];
  },
};

module.exports = nextConfig;
```

### 🔗 Linking Between Zones

For navigation between different zones, you should use regular HTML anchor tags (`<a>`) instead of Next.js `<Link>` components:

```tsx
// Link to the flows application - use anchor tag for cross-zone navigation
<a href="/portal/dashboard/flows">Go to Flows Dashboard</a>
```

#### ⚠️ Why Use Regular Anchor Tags Instead of Next.js Link Components for Cross-Zone Navigation

When linking between different zones in a multi-zone architecture, you should use regular HTML anchor tags (`<a>`) rather than the Next.js `<Link>` component for the following reasons:

1. **Prefetching Limitations**: The `Link` component attempts to prefetch and perform client-side navigation, which doesn't work properly across zone boundaries since each zone is a separate Next.js application.

2. **Full Page Load Requirement**: Navigation between different zones requires a full page load to properly initialize the target application's context, state, and JavaScript bundles.

3. **Preventing Application State Confusion**: Using `Link` for cross-zone navigation can cause the router to attempt to load a non-existent page within the current zone, resulting in errors.

4. **Proper Zone Initialization**: A full page navigation ensures that the target zone's application initializes correctly with all its providers, context, and state management.

5. **Avoiding Hydration Errors**: Cross-zone client-side navigation can lead to hydration mismatches when the target zone has a different component tree or server-rendered content.

Within the same zone (within a single Next.js application), you should continue to use the Next.js `<Link>` component as it provides benefits like prefetching and client-side navigation:

```tsx
import Link from 'next/link';

// Within the same zone, use Link for better performance
<Link href="/some-page-in-same-zone">Go to Another Page</Link>
```

## 2️⃣ Setting Up the Flows Application (New Repository)

### 📦 Create a New Next.js Application

```bash
npx create-next-app@latest pluto-client-flows
```

### ⚙️ Configure the Base Path

In the new application's `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/portal/dashboard/flows',
  assetPrefix: '/portal/dashboard/flows',
};

module.exports = nextConfig;
```

### 🔗 Configure Links in the Flows Application

When creating links within the Flows application:

```tsx
import Link from 'next/link';

// Link to a page within the Flows app
// Note: Next.js will automatically add the basePath
<Link href="/some-flow-page">Go to Flow Page</Link>

// Link back to the main application
<a href="/">Back to Home</a>
```

Notice that when linking to pages within the same zone (the Flows app), you can use relative paths, and Next.js will automatically add the configured `basePath`. However, when linking to the main application or other zones, you'll need to use anchor tags with absolute paths.

## 3️⃣ Deployment Setup

### 🌟 Option 1: Using a Reverse Proxy (Recommended)

Set up a reverse proxy (e.g., Nginx, AWS CloudFront) that:
- Routes requests to `/portal/dashboard/flows/*` to the Flows application
- Routes all other requests to the main application

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name app.gopluto.co;

    location /portal/dashboard/flows/ {
        proxy_pass http://flows-app-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://main-app-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### ⚡ Option 2: Using Next.js Rewrites (As Shown in Step 1)

This approach is simpler but may introduce additional latency as requests go through the main application first.

## 4️⃣ Shared Resources

### 🎨 Styling

To maintain consistent styling:
- Consider using a shared component library
- Deploy shared styles to NPM or use a monorepo
- Use CSS variables for theming

### 🔐 Authentication

- Implement a shared authentication system (cookies are preferred as they work across subdomains)
- Use a strategy like JWT that can be verified independently by each application

### 🔧 Environment Variables

Each application needs its own environment variables, but consider:
- Naming conventions for shared services
- Documentation for required variables in each app

## 5️⃣ Communication Between Zones

For communication between zones:
1. **📝 URL Parameters**: Pass data through URL parameters when navigating
2. **💾 Local Storage**: For non-sensitive data (remember same-origin policy)
3. **🔄 Shared Backend APIs**: Both applications can call the same backend services
4. **📢 Custom Events**: For real-time communication when both apps are loaded

## 6️⃣ Monitoring and Debugging

- 📊 Set up distributed tracing across both applications
- 🆔 Use consistent request IDs that flow between applications
- 🐛 Consider implementing cross-application error tracking

## 7️⃣ Testing Strategy

- ✅ Test each application independently
- 🔄 Implement integration tests that verify correct routing between applications
- 🧪 Test the proxy configuration in a staging environment
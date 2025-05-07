# 🚀 Deployment Guide for Shell & Dash Multi-Zone Application

This document provides detailed instructions for deploying the Shell and Dash applications as a multi-zone Next.js architecture.

## 🌐 Production URLs

- **Shell App (Main Application)**: https://shell-poc-multizone.vercel.app/dashboard
- **Dash App**: https://dash-poc-multizone.vercel.app/dash

## 🏗️ Application Architecture

Our multi-zone architecture consists of two Next.js applications:

1. **Shell Application** (`/shell`): 
   - 🛡️ Acts as the primary application
   - 🔐 Handles user authentication through NextAuth.js
   - 📊 Provides the main dashboard interface
   - 🔄 Routes requests to the Dash application

2. **Dash Application** (`/dash`):
   - 📈 Functions as a secondary zone within the Shell app
   - 🔑 Shares authentication with the Shell app
   - 🧩 Displays specialized functionality
   - 🔒 Accesses the bearer token from shared cookies

## 🔗 Cross-Zone Navigation

### ⚠️ Important: Use Anchor Tags for Cross-Zone Links

When linking between zones, **always use standard HTML anchor tags (`<a>`) instead of Next.js `<Link>` components**. This is because:

1. Next.js will try to prefetch and soft navigate to any relative path in the `<Link>` component, which will not work across zones
2. Cross-zone navigation requires a full page load to properly initialize the target zone's application

Example of correct cross-zone navigation from Shell app to Dash app:

```tsx
// In Shell app - Correct way to link to Dash app
<a 
  href={`${process.env.NEXT_PUBLIC_DASH_URL}/dash`}
  className="button-styles"
>
  Go to Dash App
</a>

// INCORRECT - Do not use Link for cross-zone navigation
<Link href="/dash">Go to Dash App</Link>
```

Example of correct cross-zone navigation from Dash app to Shell app:

```tsx
// In Dash app - Correct way to link back to Shell app
<a 
  href={`${process.env.NEXT_PUBLIC_SHELL_URL}/dashboard`}
  className="button-styles"
>
  Return to Shell Dashboard
</a>

// INCORRECT - Do not use Link for cross-zone navigation
<Link href="/dashboard">Return to Shell Dashboard</Link>
```

## 📋 Deployment Steps

### 1️⃣ Configure Environment Variables

Create `.env.production` files for both applications with the following values:

#### Shell App `.env.production`

```
NEXTAUTH_URL=https://shell-poc-multizone.vercel.app
NEXTAUTH_SECRET=your_production_secret_here
NEXT_PUBLIC_SHELL_URL=https://shell-poc-multizone.vercel.app
NEXT_PUBLIC_DASH_URL=https://dash-poc-multizone.vercel.app
```

#### Dash App `.env.production`

```
NEXTAUTH_URL=https://shell-poc-multizone.vercel.app
NEXT_PUBLIC_SHELL_URL=https://shell-poc-multizone.vercel.app
NEXT_PUBLIC_DASH_URL=https://dash-poc-multizone.vercel.app
```

### 2️⃣ Configure Next.js Applications

#### Shell App Configuration

Update `/shell/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/dash',
        destination: 'https://dash-poc-multizone.vercel.app/dash',
      },
      {
        source: '/dash/:path*',
        destination: 'https://dash-poc-multizone.vercel.app/dash/:path*',
      },
      {
        source: '/dash-static/:path*',
        destination: 'https://dash-poc-multizone.vercel.app/dash-static/:path*',
      },
    ];
  },
};

export default nextConfig;
```

#### Dash App Configuration

Update `/dash/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: '/dash-static',
  basePath: '/dash',
};

export default nextConfig;
```

### 3️⃣ Authentication Sharing Configuration

Ensure both applications can share authentication state by configuring cookies properly:

1. Set domain cookies to be accessible across both applications
2. Use SameSite=None and Secure attributes in production environment

Example middleware to configure cookies properly:

```typescript
// shell/src/middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Set cookie options for cross-domain sharing
  const cookieOptions = {
    sameSite: 'none',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  };
  
  // Get auth cookies and set them for cross-domain access
  const authCookies = ['auth_token', 'user_id', 'user_email', 'bearer_token']
    .map(name => ({ name, value: request.cookies.get(name)?.value }))
    .filter(({ value }) => value);
  
  // Set all cookies with proper attributes
  authCookies.forEach(({ name, value }) => {
    response.cookies.set(name, value, cookieOptions);
  });
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|favicon.ico).*)',
};
```

### 4️⃣ Build the Applications

```bash
# Build Shell app
cd shell
npm run build

# Build Dash app
cd ../dash
npm run build
```

### 5️⃣ Deploy Both Applications

Deploy each application separately to your hosting provider (such as Vercel):

1. Deploy the Shell app to https://shell-poc-multizone.vercel.app
2. Deploy the Dash app to https://dash-poc-multizone.vercel.app

Configure the following environment variables in your hosting provider's dashboard:

For Shell app:
- `NEXTAUTH_URL`=https://shell-poc-multizone.vercel.app
- `NEXTAUTH_SECRET`=your_production_secret_here
- `NEXT_PUBLIC_SHELL_URL`=https://shell-poc-multizone.vercel.app
- `NEXT_PUBLIC_DASH_URL`=https://dash-poc-multizone.vercel.app

For Dash app:
- `NEXTAUTH_URL`=https://shell-poc-multizone.vercel.app
- `NEXT_PUBLIC_SHELL_URL`=https://shell-poc-multizone.vercel.app
- `NEXT_PUBLIC_DASH_URL`=https://dash-poc-multizone.vercel.app

## 🧪 Verifying the Deployment

After deployment, test the integration:

1. Navigate to https://shell-poc-multizone.vercel.app/dashboard
2. Log in with valid credentials
3. Verify that your user information appears in the Shell dashboard
4. Click on "Go to Dash App" to navigate to https://dash-poc-multizone.vercel.app/dash
5. Confirm that authentication persists in the Dash app (you should not need to log in again)
6. Check that the bearer token is accessible in the Dash app for API calls

## 🔍 Troubleshooting Common Issues

### Authentication Not Persisting

**Problem**: Users need to log in again when navigating between applications.

**Solution**: 
- Check that cookies are configured with the correct domain and SameSite attributes
- Verify that both applications are using compatible NextAuth.js configurations
- Ensure the NEXTAUTH_URL environment variable is set correctly in both apps

### Missing Assets in Dash App

**Problem**: Styles or images aren't loading correctly in the Dash app.

**Solution**:
- Verify that `assetPrefix` is correctly set in the Dash app's next.config.ts
- Check that the rewrite rules in the Shell app are working correctly
- Inspect network requests to ensure assets are being served from the correct path

### Navigation Between Zones Not Working

**Problem**: Navigation between zones fails or results in 404 errors.

**Solution**:
- Ensure you're using HTML anchor (`<a>`) tags instead of Next.js `<Link>` components for cross-zone navigation
- Verify that environment variables are correctly set and used in the navigation links
- Check that the URLs include the correct base paths

## 🔒 Security Considerations

- Always use HTTPS in production
- Set secure and httpOnly flags on authentication cookies
- Implement proper Content Security Policy headers
- Regularly rotate the NEXTAUTH_SECRET value
- Apply the principle of least privilege for API access
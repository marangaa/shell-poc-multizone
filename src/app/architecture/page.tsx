import Link from 'next/link';

export const metadata = {
  title: 'Multi-Zone Architecture | Shell App',
  description: 'Documentation on the multi-zone Next.js architecture implementation',
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-white py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Multi-Zone Architecture
          </h1>
          <p className="mt-2 text-gray-600">
            Next.js multi-zone setup overview
          </p>
        </div>

        <nav className="mb-6 border border-gray-200 rounded-md">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium">Contents</h2>
          </div>
          <div className="px-6 py-4">
            <ul className="space-y-2">
              <li>
                <a href="#concept" className="text-blue-600 hover:text-blue-800">1. Multi-Zone Concept</a>
              </li>
              <li>
                <a href="#architecture" className="text-blue-600 hover:text-blue-800">2. Architecture Overview</a>
              </li>
              <li>
                <a href="#authentication" className="text-blue-600 hover:text-blue-800">3. Authentication Sharing</a>
              </li>
              <li>
                <a href="#routing" className="text-blue-600 hover:text-blue-800">4. Routing Configuration</a>
              </li>
              <li>
                <a href="#assets" className="text-blue-600 hover:text-blue-800">5. Static Assets Handling</a>
              </li>
              <li>
                <a href="#cookies" className="text-blue-600 hover:text-blue-800">6. Authentication Data Sharing</a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
          {/* Multi-Zone Concept */}
          <section id="concept" className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Multi-Zone Concept</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Multi-zone architecture in Next.js allows for breaking down a large monolithic application into smaller,
                independently deployable units while maintaining a unified user experience under a single domain. This approach
                offers several advantages:
              </p>
              
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>
                  <strong>Independent Deployment:</strong> Each zone can be developed, tested, and deployed independently,
                  reducing the risk associated with large deployments.
                </li>
                <li>
                  <strong>Team Autonomy:</strong> Different teams can own and operate different zones, enabling parallel development.
                </li>
                <li>
                  <strong>Technology Flexibility:</strong> Each zone can potentially use different technology stacks or Next.js versions.
                </li>
                <li>
                  <strong>Performance Optimization:</strong> Smaller bundles and better caching opportunities improve load times.
                </li>
              </ul>

              <p className="mt-4">
                In our implementation, we've created two zones:
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <h3 className="font-bold text-lg text-blue-800">Shell App</h3>
                  <p className="text-gray-700 mt-2">
                    The main application responsible for authentication and routing. Acts as the primary entry point and
                    controls navigation to other zones.
                  </p>
                </div>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <h3 className="font-bold text-lg text-blue-800">Flow App</h3>
                  <p className="text-gray-700 mt-2">
                    A separate application that provides specific functionality. Accessed through the Shell app while
                    maintaining consistent authentication and user experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture Overview */}
          <section id="architecture" className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Architecture Overview</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Our multi-zone architecture consists of two Next.js applications working together:
              </p>

              <h3 className="text-xl font-semibold mt-6">Shell App</h3>
              <p className="mt-2">
                The Shell app serves as the primary entry point for users and handles:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>User authentication and session management (using NextAuth.js)</li>
                <li>Global navigation and layout</li>
                <li>Routing requests to the Flow app via rewrites</li>
                <li>Maintaining the unified user experience</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Flow App</h3>
              <p className="mt-2">
                The Flow app is a separate Next.js application that:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provides specific functionality or domain features</li>
                <li>Leverages authentication data from the Shell app</li>
                <li>Maintains its own codebase, dependencies, and deployment pipeline</li>
                <li>Is accessible at the /flow path through the Shell app</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Request Flow</h3>
              <p className="mt-2">
                A typical request through our multi-zone architecture follows this path:
              </p>

              <div className="mt-4 border border-gray-300 rounded-md p-4 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`User Request → Shell App (shell-poc-multizone.vercel.app/flow)
  │
  ├─ Authentication Check (NextAuth.js)
  │
  ├─ Apply Rewrite Rule: /flow/:path* → flow-poc-multizone.vercel.app/:path*
  │
  └─ Flow App
      │
      ├─ Receive Authentication Cookies
      │
      └─ Serve Requested Content`}
                </code>
              </div>
            </div>
          </section>

          {/* Authentication Sharing */}
          <section id="authentication" className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Authentication Sharing</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Authentication sharing between zones is a critical aspect of our multi-zone architecture. We use NextAuth.js
                in the Shell app to handle authentication and share the authentication state with the Flow app.
              </p>

              <h3 className="text-xl font-semibold mt-6">Implementation</h3>
              <p className="mt-2">
                The authentication flow works as follows:
              </p>

              <ol className="list-decimal pl-5 mt-4 space-y-2">
                <li>
                  <strong>User Authentication:</strong> Users authenticate in the Shell app through NextAuth.js.
                </li>
                <li>
                  <strong>Session Creation:</strong> Upon successful authentication, NextAuth.js creates a session and sets
                  standard JWT session cookies.
                </li>
                <li>
                  <strong>Access via Shell App:</strong> Users access the Flow app through the Shell app's domain at <code>/flow</code> path.
                </li>
                <li>
                  <strong>Request Forwarding:</strong> The Shell app forwards requests to the Flow app while preserving the user's cookies.
                </li>
                <li>
                  <strong>Cookie Access:</strong> Since both apps are accessed through the same domain, cookies are automatically available
                  to the Flow app without any special configuration.
                </li>
              </ol>

              <h3 className="text-xl font-semibold mt-6">Authentication Data Access</h3>
              <p className="mt-2">
                In the Flow app, authentication data is accessed through:
              </p>

              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Server-side access in the Flow app
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token");
  
  // Use the session token to validate authentication
  // or retrieve user data
}`}
                </code>
              </div>
            </div>
          </section>

          {/* Routing Configuration */}
          <section id="routing" className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Routing Configuration</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Proper routing configuration is essential for a multi-zone architecture to function correctly. We've
                implemented routing between zones using Next.js rewrites.
              </p>

              <h3 className="text-xl font-semibold mt-6">Shell App Routing</h3>
              <p className="mt-2">
                In the Shell app's <code>next.config.ts</code>, we define rewrites to route specific paths to the Flow app:
              </p>
              
              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Shell App: next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/flow/:path*",
        destination: "https://flow-poc-multizone.vercel.app/:path*"
      },
      {
        // Rewrite for flow app's static assets
        source: "/flow-static/:path*",
        destination: "https://flow-poc-multizone.vercel.app/flow-static/:path*"
      }
    ];
  },
  // ...other configuration
};`}
                </code>
              </div>

              <p className="mt-4">
                This configuration routes all requests to <code>/flow/*</code> paths to the Flow app, while keeping users
                on the Shell app's domain. This allows for a seamless user experience with consistent authentication.
              </p>

              <h3 className="text-xl font-semibold mt-6">Flow App Configuration</h3>
              <p className="mt-2">
                In our Flow app configuration, we've deliberately set up the app to work both independently and as part of the multi-zone setup:
              </p>

              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Flow App: next.config.ts
const nextConfig: NextConfig = {
  // No basePath - let the shell app handle the /flow prefix
  assetPrefix: "/flow-static", // Asset prefix to avoid conflicts with other zones
  // ...other configuration
};`}
                </code>
              </div>

              <h3 className="text-xl font-semibold mt-6">Cross-Zone Navigation</h3>
              <p className="mt-2">
                When navigating between zones, we use standard <code>&lt;a&gt;</code> tags rather than Next.js <code>&lt;Link&gt;</code> components:
              </p>

              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Shell App: Navigating to the Flow App
<a href="/flow" className="...">
  Go to Flow App
</a>

// Flow App: Navigating back to the Shell App
<a href="/" className="...">
  Back to Shell App
</a>`}
                </code>
              </div>
            </div>
          </section>

          {/* Static Assets Handling */}
          <section id="assets" className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Static Assets Handling</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Proper static asset handling is crucial for a multi-zone setup to avoid path conflicts and ensure
                assets load correctly regardless of how the application is accessed.
              </p>

              <h3 className="text-xl font-semibold mt-6">Asset Prefix Configuration</h3>
              <p className="mt-2">
                We use <code>assetPrefix</code> in the Flow app to ensure its static assets don't conflict with those of the Shell app:
              </p>

              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Flow App: next.config.ts
const nextConfig: NextConfig = {
  assetPrefix: "/flow-static",
  // ...other configuration
};`}
                </code>
              </div>

              <p className="mt-4">
                With this configuration, all static assets (JavaScript, CSS, images) from the Flow app will be served
                with a prefix of <code>/flow-static</code>. This prevents conflicts with assets from the Shell app.
              </p>

              <h3 className="text-xl font-semibold mt-6">Asset Rewrites</h3>
              <p className="mt-2">
                In the Shell app, we add a rewrite rule to handle requests for the Flow app's static assets:
              </p>

              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Shell App: next.config.ts
{
  source: "/flow-static/:path*",
  destination: "https://flow-poc-multizone.vercel.app/flow-static/:path*"
}`}
                </code>
              </div>

              <p className="mt-4">
                This ensures that when the Flow app is accessed through the Shell app, its static assets are correctly
                loaded from the Flow app's domain with the proper prefix.
              </p>

              <h3 className="text-xl font-semibold mt-6">Image and Public Assets</h3>
              <p className="mt-2">
                For public assets and images, we follow these practices:
              </p>

              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>
                  <strong>Next.js Image Component:</strong> When using the <code>next/image</code> component in the Flow app, 
                  the asset prefix is automatically applied.
                </li>
                <li>
                  <strong>Public Assets:</strong> Assets placed in the <code>public</code> directory need to be referenced
                  with the asset prefix in mind.
                </li>
              </ul>
            </div>
          </section>

          {/* Authentication Data Sharing */}
          <section id="cookies" className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Authentication Data Sharing</h2>
            <div className="prose max-w-none text-gray-700">
              <p>
                Authentication data sharing between zones is implemented using the "Same Domain with Different Paths" approach.
              </p>

              <h3 className="text-xl font-semibold mt-6">Same Domain with Different Paths</h3>
              <p className="mt-2">
                Our implementation serves all zones from a single domain with different paths:
              </p>

              <ul className="list-disc pl-5 mt-4">
                <li><code>shell-poc-multizone.vercel.app/</code> - Shell app</li>
                <li><code>shell-poc-multizone.vercel.app/flow</code> - Flow app</li>
              </ul>

              <p className="mt-4">
                This approach provides these technical benefits:
              </p>

              <ul className="list-disc pl-5 mt-2">
                <li>Automatic cookie sharing without domain configuration</li>
                <li>No CORS issues since all requests are same-origin</li>
                <li>JWT tokens from NextAuth.js are accessible to all zones</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">Implementation Details</h3>

              <ol className="list-decimal pl-5 mt-4">
                <li>
                  User authentication in Shell app through NextAuth.js
                </li>
                <li>
                  JWT session token stored in HTTP-only cookie on the domain
                </li>
                <li>
                  Shell app rewrites <code>/flow/*</code> requests to Flow app while preserving cookies
                </li>
                <li>
                  Flow app reads session data from cookies available at the same domain
                </li>
              </ol>

              <div className="mt-4 border border-gray-300 rounded-md p-3 bg-gray-50 text-sm">
                <code className="block whitespace-pre overflow-x-auto">
{`// Flow App: Reading session data from cookies
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("next-auth.session-token");
  
  // Process session token to verify authentication
}`}
                </code>
              </div>

              <h3 className="text-xl font-semibold mt-6">Alternative Multi-Zone Domain Strategies</h3>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <h4 className="font-bold text-blue-800">Subdomains Approach</h4>
                  <div className="text-gray-700 mt-2">
                    <p className="mb-2">
                      Using <code>app.domain.com</code> and <code>flows.domain.com</code> with shared cookie domain configuration.
                    </p>
                    <p>
                      <span className="font-semibold">Implementation:</span> Requires setting <code>domain: ".domain.com"</code> in NextAuth.js cookie configuration.
                    </p>
                  </div>
                </div>
                
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <h4 className="font-bold text-blue-800">Different Domains</h4>
                  <div className="text-gray-700 mt-2">
                    <p className="mb-2">
                      Using completely separate domains requires explicit authentication state transfer.
                    </p>
                    <p>
                      <span className="font-semibold">Implementation:</span> Requires token exchange, URL parameters, or backend session verification between domains.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Dashboard
          </Link>
        </div>

        <footer className="mt-16 text-center text-sm text-gray-600">
          <p>Multi-Zone Architecture Documentation | Last Updated: May 8, 2025</p>
          <p className="mt-2">Shell Application - Next.js Multi-Zone Implementation</p>
        </footer>
      </div>
    </div>
  );
}
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  // Get dashboard URL from environment variable or use fallback
  const dashUrl = process.env.NEXT_PUBLIC_DASH_URL || 'https://dash-poc-multizone.vercel.app';
  
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-800 font-medium">Loading session data...</p>
        </div>
      </div>
    );
  }

  // Extract user data from session
  const user = session?.user || {};
  const expires = session?.expires || "";

  // Format expiration date for better readability
  const expiryDate = expires ? new Date(expires).toLocaleString() : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">User Dashboard</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">Name</h3>
                <p className="text-lg text-gray-900">{user.name || "Not available"}</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">Email</h3>
                <p className="text-lg text-gray-900">{user.email || "Not available"}</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">User ID</h3>
                <p className="text-base text-gray-900 font-mono bg-gray-100 p-2 rounded">{user.id || "Not available"}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Session Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">Session Expires</h3>
                <p className="text-lg text-gray-900">{expiryDate}</p>
              </div>
            </div>
          </section>
          
          {/* Link to the Dash App - Using <a> tag instead of Link for cross-zone navigation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Microfrontend Integration</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 flex flex-col">
              <p className="text-base text-gray-700 mb-4">Access the Dash app which shares authentication with this shell app.</p>
              <a 
                href={`${dashUrl}/dash`}
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors font-medium text-center inline-block max-w-xs"
              >
                Go to Dash App
              </a>
            </div>
          </section>
          
          {/* Raw session data for debugging */}
          <div className="border-t border-gray-300 pt-6 mt-8">
            <details className="text-base">
              <summary className="text-gray-800 font-medium cursor-pointer hover:text-blue-700 p-2 rounded-md hover:bg-gray-100 inline-block">Debug: Raw Session Data</summary>
              <pre className="mt-3 p-4 bg-gray-100 rounded-lg border border-gray-300 text-sm text-gray-900 overflow-auto max-h-64 font-mono">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-600">
          Shell Application - Multi-zone Next.js Demo
        </p>
      </footer>
    </div>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to sign in with:", username);
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        setError("Authentication failed. Please check your credentials and try again.");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 lg:w-1/2 xl:w-2/5">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-10">
            <div className="relative h-12 w-12">
              <Image
                src="/globe.svg"
                alt="Logo"
                fill
                className="rounded-full object-cover"
                priority
              />
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 text-center">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-base text-gray-600 mb-10">
            Enter your credentials to access the dashboard
          </p>
          
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}
          
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username or Email
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right side - Decorative section */}
      <div className="hidden lg:block lg:w-1/2 xl:w-3/5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-l-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('/window.svg')] bg-center opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 p-12 flex flex-col items-start">
            <h2 className="text-3xl font-bold text-white mb-4">Multi-Zone Microfrontend Demo</h2>
            <p className="text-blue-100 mb-6 max-w-md">
              A demonstration of Next.js multi-zone architecture with authentication sharing between independent applications.
            </p>
            <div className="flex space-x-2 text-sm">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full">Shell App</span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full">Dash App</span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full">Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

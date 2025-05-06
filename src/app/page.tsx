"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router, status]);

  // This will only be shown briefly before redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-semibold mb-2">Loading...</div>
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}

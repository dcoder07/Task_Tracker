"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleStop = () => {
      setIsLoading(false);
    };

    // Listen for route changes
    window.addEventListener("beforeunload", handleStart);

    // Since Next.js App Router doesn't have built-in route change events,
    // we'll use a custom approach with a small delay on navigation
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = function (...args) {
      handleStart();
      setTimeout(() => handleStop(), 300);
      return originalPush.apply(this, args);
    };

    router.replace = function (...args) {
      handleStart();
      setTimeout(() => handleStop(), 300);
      return originalReplace.apply(this, args);
    };

    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400 animate-spin"></div>
        </div>
        <p className="text-white text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className='min-h-[calc(100vh-80px)] flex items-center justify-center text-white'>
        Loading authentication...
      </div>
    );
  }

  return <>{children}</>;
}

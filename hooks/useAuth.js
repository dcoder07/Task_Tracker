"use client";

import { useEffect, useState, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
      if (response.ok) {
        const result = await response.json();
        setUser(result.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch current user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (res.ok && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || "Login failed" };
  };

  const register = async (email, password, first_name, last_name) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
    const result = await res.json();
    if (res.ok && result.user) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error || "Registration failed" };
  };

  const logout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      setUser(null);
      return true;
    }
    return false;
  };

  return { user, loading, login, register, logout, refresh, isAuthenticated: !!user };
}

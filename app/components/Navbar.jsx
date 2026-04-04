"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { MdOutlineSpaceDashboard as DashboardIcon, MdAdminPanelSettings, MdPerson } from "react-icons/md";
import { FaTasks as TicketsIcon } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { getUserByEmail, hasPermission } from "@/db/actions";

export default function Navbar() {
  const date = new Date();
  const router = useRouter();
  const path = usePathname();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  const displayName = (userData?.first_name || user?.first_name || user?.name || user?.email || "User").toString().trim();
  const displayLastName = userData?.last_name || user?.last_name || "";
  const profileName = [displayName, displayLastName].filter(Boolean).join(" ") || "User";
  const profileInitial = profileName.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const checkPermissions = async () => {
      if (user?.email) {
        try {
          const data = await getUserByEmail(user.email);
          if (data) {
            setUserData(data);
            const adminAccess = (await hasPermission(data.id, "manage_users")) || data.role === "admin";
            setHasAdminAccess(adminAccess);
          }
        } catch (error) {
          console.error("Failed to check permissions:", error);
        }
      } else {
        setUserData(null);
        setHasAdminAccess(false);
      }
    };

    checkPermissions();
  }, [user]);

  return (
    <nav className='sticky top-0 z-50 border-b border-white/10 backdrop-blur-md glass-card py-4'>
      <div className='max-w-screen-xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl md:text-3xl font-black tracking-tight text-white'>
            Task
            <span className='bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'>Tracker</span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => router.push("/")}
            className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${
              path === "/" ? "bg-cyan-500 text-slate-900 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <DashboardIcon className='inline-block mr-1 text-base' />
            <span className='hidden sm:inline'>Dashboard</span>
          </button>
          <button
            onClick={() => router.push("/tickets")}
            className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${
              path === "/tickets" ? "bg-cyan-500 text-slate-900 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <TicketsIcon className='inline-block mr-1 text-base' />
            <span className='hidden sm:inline'>Issues</span>
          </button>
          {hasAdminAccess && (
            <button
              onClick={() => router.push("/admin")}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${
                path === "/admin" ? "bg-cyan-500 text-slate-900 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <MdAdminPanelSettings className='inline-block mr-1 text-base' />
              <span className='hidden sm:inline'>Admin</span>
            </button>
          )}
          <button
            onClick={() => router.push("/profile")}
            className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${
              path === "/profile" ? "bg-cyan-500 text-slate-900 shadow-lg" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <MdPerson className='inline-block mr-1 text-base' />
            <span className='hidden sm:inline'>Profile</span>
          </button>
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden md:block text-lg text-slate-300 font-medium'>{date.toUTCString().slice(0, -12)}</div>
          {user ? (
            <div className='flex items-center gap-3'>
              {/* Profile Badge */}
              <div className='flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full border border-white/20'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-slate-900 font-bold text-sm'>
                  {profileInitial}
                </div>
                <div className='hidden sm:flex flex-col'>
                  <span className='text-xs text-slate-300'>Logged in as</span>
                  <span className='text-sm font-semibold text-white truncate max-w-[140px]'>{profileName}</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  router.push("/auth/login");
                }}
                className='bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 text-sm font-semibold transition-all duration-300'
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <button onClick={() => router.push("/auth/login")} className='text-slate-100 px-3 py-2 rounded-lg hover:bg-white/10 text-sm'>Sign In</button>
              <button onClick={() => router.push("/auth/register")} className='text-cyan-300 px-3 py-2 rounded-lg hover:bg-cyan-400/20 text-sm'>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

//  {date.toUTCString().slice(0, -12)}

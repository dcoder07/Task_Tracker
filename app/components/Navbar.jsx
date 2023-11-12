"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { MdOutlineSpaceDashboard as DashboardIcon } from "react-icons/md";
import { FaTasks as TicketsIcon } from "react-icons/fa";

export default function Navbar() {
  const date = new Date();
  const router = useRouter();
  const path = usePathname();
  return (
    <nav className='max-w-screen-xl sm:px-0 mx-auto py-6'>
      <div className='bg-blue-200 p-4 px-8 rounded-full flex flex-row items-center justify-between'>
        <div className='font-bold text-black text-2xl'>
          Task<span className='text-[#013FCB]'>Tracker</span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <div
            className={`flex flex-row items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
              path === "/" ? "bg-[#013FCB] text-white" : ""
            }`}
            onClick={() => router.push("/")}
          >
            <DashboardIcon size={18} />
            <div className='max-sm:hidden'>Dashboard</div>
          </div>
          <div
            className={`flex flex-row items-center gap-1 px-3 py-1 rounded-full cursor-pointer pnm ${
              path === "/tickets" ? "bg-[#013FCB] text-white" : ""
            }`}
            onClick={() => router.push("/tickets")}
          >
            <TicketsIcon size={16} />
            <div className='max-sm:hidden'>Tickets</div>
          </div>
        </div>
        <div className='text-md text-black font-semibold px-2 py-1 rounded-full max-sm:hidden'>
          {date.toUTCString().slice(0, -12)}
        </div>
      </div>
    </nav>
  );
}

//  {date.toUTCString().slice(0, -12)}

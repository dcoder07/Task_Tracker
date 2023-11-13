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
    <nav className='max-w-screen-xl sm:px-0 mx-auto py-6 max-xl:mx-2'>
      <div className='bg-blue-200 py-5 px-8 max-sm:py-3 rounded-full  flex flex-row items-center justify-between'>
        <div className='font-bold text-black text-2xl sm:text-3xl '>
          Task<span className='text-[#013FCB]'>Tracker</span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <div
            className={`flex flex-row items-center gap-2 px-3 py-1 rounded-full cursor-pointer ${
              path === "/" ? "bg-[#013FCB] text-white" : ""
            }`}
            onClick={() => router.push("/")}
          >
            <DashboardIcon size={22} />
            <div className='max-sm:hidden font-bold'>Dashboard</div>
          </div>
          <div
            className={`flex flex-row items-center gap-2 px-3 py-1 rounded-full cursor-pointer pnm ${
              path === "/tickets" ? "bg-[#013FCB] text-white" : ""
            }`}
            onClick={() => router.push("/tickets")}
          >
            <TicketsIcon size={18} />
            <div className='max-sm:hidden font-bold'>Tickets</div>
          </div>
        </div>
        <div className='text-[25px] font-thin text-black   px-2 py-1 rounded-full max-sm:hidden font-script'>
          {date.toUTCString().slice(0, -12)}
        </div>
      </div>
    </nav>
  );
}

//  {date.toUTCString().slice(0, -12)}

import React from "react";
import dashboard from "./dashboard.svg";
import ticket from "./list.png";
import Image from "next/image";
import Link from "next/link";

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const d = new Date();
const year = d.getFullYear();
const date = d.getDate();
const month = months[d.getMonth()];
const day = weekday[d.getDay()];
export default function Navbar() {
  return (
    <nav className='flex justify-evenly max-sm:justify-between items-center w-full max-container py-5 px-4'>
      <h1 className='text-[#013ecb] font-bold max-sm:text-lg text-4xl '>
        Task<span className='text-black'>Tracker</span>
      </h1>
      <div className='flex gap-2 sm:gap-5 max-sm:text-sm '>
        <Link href='/' className=' flex items-center'>
          <Image src={dashboard} alt='dashboard-icon' width={30} />
          <span className='btn-hover'>Dashboard</span>
        </Link>
        <Link href='/tickets' className=' flex items-center'>
          <Image src={ticket} alt='ticket-icon' width={30} />
          <span className='btn-hover'>Tickets</span>
        </Link>
      </div>
      <div className='max-sm:hidden '>
        <span className='whitespace-nowrap font-semibold text-gray-600'>
          {day}, <br />
          {date} {month} {year}
        </span>
      </div>
    </nav>
  );
}

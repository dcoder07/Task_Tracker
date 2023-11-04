import React from "react";

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
    <nav className='flex bg-slate-200 rounded-full justify-evenly max-sm:justify-between items-center w-full max-container py-5 px-4'>
      <h1 className='text-[#013FCB] font-bold max-sm:text-xl text-4xl '>
        Task<span className='text-black'>Tracker</span>
      </h1>
      <div className='flex gap-2 sm:gap-5 sm:text-lg '>
        <a href='/' className='btn-hover'>
          Dashboard
        </a>
        <a href='/tickets' className='btn-hover'>
          Tickets
        </a>
      </div>
      <div className='max-sm:hidden '>
        <span className='whitespace-nowrap font-semibold text-gray-600'>
          {day}, {date} {month} {year}
        </span>
      </div>
    </nav>
  );
}

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
    <nav className='flex items-center mx-10 bg-[#F3F3F3] rounded-full pl-5 pr-24 w-fit max-container'>
      <h1 className='text-[#013FCB] font-bold max-sm:text-6xl text-4xl m-5'>
        Task<span className='text-black'>Tracker</span>
      </h1>
      <div className='flex justify-start gap-16 max-sm:text-2xl text-lg px-32 items-center font-semibold m-2'>
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

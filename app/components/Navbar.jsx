import React from "react";

export default function Navbar() {
  return (
    <nav>
      <h1>TaskTracker</h1>
      <div className='bg-slate-200 flex gap-4 items-center w-fit px-2 rounded-full m-2'>
        <a className='hover:border-2 border-red-900 rounded-2xl px-2' href='/'>
          Dashboard
        </a>
        <a
          className='hover:border-2 border-red-900 rounded-2xl px-2'
          href='/tickets'
        >
          Tickets
        </a>
      </div>
    </nav>
  );
}

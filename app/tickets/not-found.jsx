import React from "react";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-[50vh] leading-8'>
      <h1 className='text-3xl font-bold text-[#cb010eb4]'>
        There was an error!
      </h1>
      <p className='text-slate-500 font-semibold'>
        We could not find the page you were looking for.
      </p>
      <p className='text-slate-500 font-semibold'>
        Go back to see the
        <Link href='/tickets' className='underline text-[#013FCB]'>
          Tickets
        </Link>
      </p>
    </div>
  );
}

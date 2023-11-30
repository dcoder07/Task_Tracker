import React, { Suspense } from "react";
import TicketList from "./TicketList";
import Loading from "../loading";
export default function page() {
  return (
    <div className='flex flex-col max-w-screen-xl mx-auto w-full my-10 max-sm:my-2 border-2 gap-8 '>
      <div className='flex flex-col gap-2 mx-4'>
        <h1 className='font-bold text-2xl text-[#013FCB] '>Tickets Page</h1>
        <p className='text-gray-500 text-[12px]'>Currenty open tickets</p>
      </div>
      <div className='mx-5'>
        <Suspense fallback={<Loading />}>
          <TicketList />
        </Suspense>
      </div>
    </div>
  );
}

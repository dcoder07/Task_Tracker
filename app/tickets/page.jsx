import React from "react";
import TicketList from "./TicketList";
export default function page() {
  return (
    <div className='max-w-[1440px] flex flex-col w-full sm:m-10 border-2 px-5 sm:px-16'>
     <div className="mb-16"><h1 className='font-bold text-2xl text-[#013FCB] '>Tickets Page</h1>
      <p className="text-gray-500 text-[12px]">Currenty open tickets</p></div> 
    <div className="sm:ml-2"><TicketList/></div>
    </div>
  );
}

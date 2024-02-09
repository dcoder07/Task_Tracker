import React, { Suspense } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import TicketList from "./TicketList";
import Loading from "../loading";
export default function page() {
  return (
    <div className='flex flex-col max-w-screen-xl mx-auto w-full my-10 max-sm:my-2 border-2 gap-8 '>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-2 mx-4'>
          <h1 className='font-bold text-2xl text-[#013FCB] '>Issues Page</h1>
          <p className='text-gray-500 text-[12px]'>Currenty open issues</p>
        </div>
        <div className='bg-[#013FCB] font-semibold text-white px-2 py-1 mr-1 rounded-full'>
          <Link className='flex items-center gap-2' href={"/tickets/create"}>
            <IoMdAddCircleOutline />
            <span className='max-sm:hidden'>Create Issue</span>
          </Link>
        </div>
      </div>
      <div className='mx-5'>
        <Suspense fallback={<Loading />}>
          <TicketList />
        </Suspense>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Image from "next/image";
import React from "react";
export const dynamicParams = true;
//Static rendering : readying pages at the initial render making it faster
export async function generateStaticParam() {
  const data = await fetch("https://testapi-ouv6.onrender.com/api/tickets");

  const tickets = await data.json();

  return tickets.map((ticket) => {
    id: ticket.id;
  });
}

async function getDetails(id) {
  //imitate delay for loader
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(
    "https://testapi-ouv6.onrender.com/api/tickets/" + id,
    {
      next: {
        revalidate: 0,
      },
    }
  );

  if (!res.ok) {
    notFound();
  }

  return res.json();
}
export default async function TicketDetails({ params }) {
  const ticket = await getDetails(params.id);
  return (
    <main className='flex flex-col max-w-screen-xl  xl:mx-auto mx-8 gap-64 my-10 max-sm:my-2 relative'>
      <nav>
        <h1 className='font-bold text-2xl text-[#013FCB] '>Ticket Details</h1>
      </nav>
      <div className='bg-white absolute top-20 w-full rounded-t-2xl h-[32vh] z-[-2]'>
        <Image
          src={ticket.imgSrc}
          fill
          objectFit='cover'
          className='rounded-t-2xl z-[-1]'
        />
        <div className='bg-gray-100 max-sm:text-xs font-bold text-slate-700 w-fit rounded-full p-1 px-2 absolute top-4 left-4'>
          Work Assigned to :
        </div>
        <div className='bg-gray-100 max-sm:text-xs font-bold text-slate-700 w-fit rounded-full p-1 px-2 absolute max-sm:top-12 max-sm:left-4 top-4 right-4'>
          Due Date : {ticket.due_date}
        </div>
      </div>
      <div className='bg-white max-w-screen-xl px-5 pt-5 rounded-2xl shadow-lg break-words relative '>
        <div className='flex flex-col mb-8'>
          <h3 className='text-lg font-bold text-slate-700 rounded-full bg-gray-100 p-1 px-2 '>
            {ticket.title}
          </h3>
          <small className='text-gray-500 font-semibold ml-2'>
            Admin : 
            <span className='text-green-600'> {ticket.user_email}</span>
          </small>
        </div>
        <p className='mb-10 ml-2 text-gray-500 leading-7'>{ticket.body}</p>
        <div
          className={`pill-${ticket.priority} absolute right-0 bottom-0 rounded-tl-2xl rounded-br-2xl px-2 py-1 font-semibold`}
        >
          {ticket.priority} priority
        </div>
      </div>
    </main>
  );
}

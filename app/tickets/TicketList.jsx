"use client";
import next from "next";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MdAirlineSeatReclineExtra, MdDelete } from "react-icons/md";
async function getTickets() {
  //imitate delay for the loader
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch("https://testapi-ouv6.onrender.com/api/tickets", {
    next: {
      revalidate: 0,
    },
  });
  return res.json();
}
export default async function TicketList() {
  const tickets = await getTickets();
  return (
    <>
      <div className='max-container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5'>
        {tickets.reverse().map((ticket) => (
          <div
            key={ticket.id}
            className='bg-white px-5 pt-5 rounded-2xl relative shadow-lg break-words'
          >
            <Link href={`/tickets/${ticket.id}`}>
              <h3 className='text-xl font-bold text-slate-700 mb-4 rounded-full bg-gray-100 p-1 px-2 '>
                {ticket.title}
              </h3>
              <div className='flex justify-between items-center my-2 '>
                <div className='rounded-full'>
                  <Image
                    src={ticket.imgSrc}
                    width={10}
                    height={10}
                    alt='Picture of the employee'
                  />
                </div>
                <div className='text-lg text-slate-500 font-thin'>
                  <span>due date: </span>
                  {ticket.due_date}
                </div>
              </div>
              <p className='mb-10 text-gray-500 '>
                {ticket.body.slice(0, 200)}...
              </p>
              <div
                className={`pill-${ticket.priority} absolute right-0 bottom-0 rounded-tl-2xl rounded-br-2xl px-2 py-1 font-semibold`}
              >
                {ticket.priority} priority
              </div>
            </Link>
            <button
              className='text-white p-1 rounded-full bg-[#013FCB] w-fit absolute bottom-2'
              onClick={(e) => {
                fetch(
                  "https://testapi-ouv6.onrender.com/api/tickets/" + ticket.id,
                  {
                    method: "DELETE",
                  }
                )
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Something went wrong!!!");
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
                document.location.reload();
              }}
            >
              <MdDelete />
            </button>
          </div>
        ))}
        {tickets.length === 0 && (
          <p className='font-bold text-center whitespace-nowrap text-4xl text-gray-500'>
            There are no tickets open 😁!!!
          </p>
        )}
      </div>
    </>
  );
}

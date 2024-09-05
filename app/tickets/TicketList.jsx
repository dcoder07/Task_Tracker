"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MdDelete } from "react-icons/md";
import { deleteTicket } from "@/db/actions";

import dayjs from "dayjs";

export function TicketList({ tickets }) {
  return (
    <div className='max-container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5'>
      {tickets.reverse().map((ticket) => {
        const isDued = dayjs(ticket.due_date).isBefore(dayjs(Date.now()));
        return (
          <div
            key={ticket.id}
            className='bg-white px-5 pt-5 rounded-2xl relative shadow-lg break-words'
          >
            <Link href={`/tickets/${ticket.id}`}>
              <h3
                className='text-xl font-bold text-slate-700 mb-4 rounded-full p-1 px-2'
                style={{
                  backgroundColor: isDued ? "#fee2e2" : "#f3f4f6",
                }}
              >
                {ticket.title}
              </h3>
              <div className='flex justify-between items-center my-2 '>
                <div>
                  <Image
                    src={ticket.imgSrc}
                    width={50}
                    height={50}
                    alt='Picture of the employee'
                    className='rounded-full'
                  />
                </div>
                <div className='text-lg text-slate-500 font-thin'>
                  <span>due date: </span>
                  {dayjs(ticket.due_date).format("DD/MM/YYYY")}
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
              onClick={async () => {
                try {
                  console.log(ticket.id);
                  await deleteTicket(ticket.id);
                } catch (err) {
                  console.log(error);
                }
              }}
            >
              <MdDelete />
            </button>
          </div>
        );
      })}
      {tickets.length === 0 && (
        <p className='font-bold text-center whitespace-nowrap text-4xl text-gray-500'>
          There are no tickets open 😁!!!
        </p>
      )}
    </div>
  );
}

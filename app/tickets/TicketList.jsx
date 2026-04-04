"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MdDelete } from "react-icons/md";
import { deleteTicket } from "@/db/actions";

import dayjs from "dayjs";

export function TicketList({ tickets }) {
  const reversedTickets = [...tickets].reverse();

  return (
    <div className='max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 select-none'>
      {reversedTickets.map((ticket) => {
        const isDued = dayjs(ticket.due_date).isBefore(dayjs(Date.now()));
        return (
          <div
            key={ticket.id}
            className='glass-card card-hover p-5 rounded-3xl relative overflow-hidden transition-all duration-300 select-none'
          >
            <Link href={`/tickets/${ticket.id}`}>
              <div className='flex justify-start items-center mb-4'>
                <h3 className='text-lg font-bold text-cyan-100'>{ticket.title}</h3>
              </div>

              <div className='flex items-center gap-3 mb-3'>  
                <Image
                  src={ticket.imgSrc}
                  width={50}
                  height={50}
                  alt='Assigned user'
                  className='rounded-full ring-2 ring-cyan-300/40'
                />
                <div className='text-sm text-slate-300'>
                  due {dayjs(ticket.due_date).format("DD MMM YYYY")}
                </div>
              </div>

              <p className='mb-10 text-slate-300 text-sm leading-relaxed'>
                {ticket.body}
              </p>

              <div
                className={`pill-${ticket.priority} absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs font-semibold`}
              >
                {ticket.priority} priority
              </div>
            </Link>

            <button
              className='absolute top-4 right-4 bg-gradient-to-tr from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white p-2 rounded-full shadow-lg transition-transform duration-300'
              onClick={async () => {
                try {
                  await deleteTicket(ticket.id);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <MdDelete />
            </button>
          </div>
        );
      })}

      {tickets.length === 0 && (
        <p className='col-span-full text-center text-2xl font-bold text-cyan-200'>
          No open tickets yet — create one to get started.
        </p>
      )}
    </div>
  );
}

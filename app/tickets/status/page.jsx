import Link from "next/link";
import React from "react";
import { getTickets } from "@/db/actions";
import { TicketList } from "../TicketList";
import dayjs from "dayjs";

const STATUSES = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "done", label: "Done" },
];

export default async function StatusPage() {
  const tickets = await getTickets();
  const counts = {
    backlog: tickets.filter((ticket) => ticket.status === "backlog").length,
    in_progress: tickets.filter((ticket) => ticket.status === "in_progress").length,
    in_review: tickets.filter((ticket) => ticket.status === "in_review").length,
    done: tickets.filter((ticket) => ticket.status === "done").length,
  };

  return (
    <div className='flex flex-col max-w-screen-2xl mx-auto w-full py-8 px-4 gap-8 select-none'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-bold text-3xl md:text-4xl text-white'>
              Ticket Sections
            </h1>
            <p className='text-slate-400 text-sm'>Browse all status sections and open the detail page for any workflow stage.</p>
          </div>
          <Link href='/tickets' className='inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>
            Back to board
          </Link>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {STATUSES.map((status) => (
            <Link
              key={status.id}
              href={`/tickets/status/${status.id}`}
              className='glass-card p-5 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
            >
              <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>{status.label}</p>
              <p className='mt-4 text-4xl font-bold text-white'>{counts[status.id]}</p>
              <p className='mt-2 text-sm text-slate-400'>tickets in this section</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

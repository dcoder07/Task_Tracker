import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { getTickets } from "@/db/actions";
import { TicketList } from "../../TicketList";

const STATUSES = [
  { id: "backlog", label: "Backlog", description: "Tickets ready to be triaged and planned." },
  { id: "in_progress", label: "In Progress", description: "Work currently being executed." },
  { id: "in_review", label: "In Review", description: "Tickets waiting for approval or feedback." },
  { id: "done", label: "Done", description: "Completed work and closed tasks." },
];

export default async function StatusDetailPage({ params }) {
  const status = STATUSES.find((item) => item.id === params.status);
  if (!status) {
    notFound();
  }

  const tickets = (await getTickets()).filter((ticket) => ticket.status === status.id);
  const overdueCount = tickets.filter((ticket) => dayjs(ticket.due_date).isBefore(dayjs())).length;
  const dueSoonCount = tickets.filter((ticket) => {
    const due = dayjs(ticket.due_date);
    return due.isAfter(dayjs()) && due.diff(dayjs(), "day") <= 3;
  }).length;

  return (
    <div className='flex flex-col max-w-screen-2xl mx-auto w-full py-8 px-4 gap-8 select-none'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.24em] text-cyan-300'>Section details</p>
          <h1 className='text-4xl font-bold text-white'>{status.label}</h1>
          <p className='max-w-2xl text-slate-400'>{status.description}</p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Link href='/tickets/status' className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10'>All sections</Link>
          <Link href='/tickets' className='rounded-full border border-cyan-400 bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Back to board</Link>
        </div>
      </div>

      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='glass-card p-5 rounded-3xl border border-white/10'>
          <p className='text-xs uppercase tracking-[0.24em] text-slate-500'>Tasks in section</p>
          <p className='mt-3 text-4xl font-bold text-white'>{tickets.length}</p>
        </div>
        <div className='glass-card p-5 rounded-3xl border border-white/10'>
          <p className='text-xs uppercase tracking-[0.24em] text-slate-500'>Overdue</p>
          <p className='mt-3 text-4xl font-bold text-rose-300'>{overdueCount}</p>
        </div>
        <div className='glass-card p-5 rounded-3xl border border-white/10'>
          <p className='text-xs uppercase tracking-[0.24em] text-slate-500'>Due soon</p>
          <p className='mt-3 text-4xl font-bold text-amber-300'>{dueSoonCount}</p>
        </div>
      </div>

      <div className='glass-card p-5 rounded-3xl border border-white/10'>
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
}

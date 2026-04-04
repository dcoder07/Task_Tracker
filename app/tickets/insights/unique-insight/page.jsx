import Link from "next/link";
import React from "react";
import { getTickets, getUsers } from "@/db/actions";
import { UniqueInsightDetail } from "../../../components/AssigneeSummaryBoard";

export default async function UniqueInsightPage() {
  const tickets = await getTickets();
  const users = await getUsers();

  return (
    <div className='flex flex-col max-w-screen-2xl mx-auto w-full py-8 px-4 gap-8 select-none'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.24em] text-cyan-300'>Unique insight</p>
          <h1 className='text-4xl font-bold text-white'>Actionable assignment guidance</h1>
          <p className='max-w-2xl text-slate-400'>Use current team load to make better decisions about task balance and overdue assignments.</p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Link href='/tickets/insights' className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10'>Back to insights</Link>
          <Link href='/tickets' className='rounded-full border border-cyan-400 bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Back to board</Link>
        </div>
      </div>

      <UniqueInsightDetail tickets={tickets} users={users} />
    </div>
  );
}

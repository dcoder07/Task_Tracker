import Link from "next/link";
import React from "react";
import { getTickets } from "@/db/actions";

const INSIGHTS = [
  { id: "assignee-workload", label: "Assignee Workload", description: "View assignment counts, overdue tasks, and task distribution per teammate." },
  { id: "team-summary", label: "Team Summary", description: "See which team members are most loaded and who has the most overdue work." },
  { id: "unique-insight", label: "Unique Insight", description: "Get an actionable assignment recommendation to balance work across the team." },
];

export default async function InsightsPage() {
  const tickets = await getTickets();
  const totalTickets = tickets.length;

  return (
    <div className='flex flex-col max-w-screen-2xl mx-auto w-full py-8 px-4 gap-8 select-none'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='space-y-2'>
          <p className='text-sm uppercase tracking-[0.24em] text-cyan-300'>Insight hub</p>
          <h1 className='text-4xl font-bold text-white'>Ticket intelligence</h1>
          <p className='max-w-2xl text-slate-400'>Explore each insight in a dedicated page for assignment load, team health, and smart workload guidance.</p>
        </div>
        <Link href='/tickets' className='inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>
          Back to board
        </Link>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <div className='glass-card p-5 rounded-3xl border border-white/10'>
          <p className='text-xs uppercase tracking-[0.24em] text-slate-500'>Total tickets</p>
          <p className='mt-3 text-4xl font-bold text-white'>{totalTickets}</p>
          <p className='mt-2 text-sm text-slate-400'>All tickets across the system.</p>
        </div>
        {INSIGHTS.map((insight) => (
          <Link
            key={insight.id}
            href={`/tickets/insights/${insight.id}`}
            className='glass-card p-5 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
          >
            <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>{insight.label}</p>
            <p className='mt-3 text-lg font-semibold text-white'>{insight.description}</p>
            <p className='mt-4 text-xs text-slate-500'>Open full insight</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

import React, { Suspense } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Link from "next/link";
import { KanbanBoard } from "../components/KanbanBoard";
import Loading from "../loading";
import { getTickets, getUsers } from "@/db/actions";

const STATUSES = [
  { id: "backlog", label: "Backlog" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "done", label: "Done" },
];

export default async function page() {
  const tickets = await getTickets();
  const users = await getUsers();

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
            <h1 className='font-bold text-3xl md:text-4xl bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent'>
              Workflow Board
            </h1>
            <p className='text-slate-400 text-sm'>Drag & drop tickets between columns to manage workflow and see active assignment load across the team.</p>
          </div>
          <Link
            href={"/tickets/create"}
            className='primary-btn px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-transform duration-300'
          >
            <IoMdAddCircleOutline size={18} />
            <span className='hidden sm:inline'>Create Issue</span>
          </Link>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {STATUSES.map((status) => (
            <Link
              key={status.id}
              href={`/tickets/status/${status.id}`}
              className='glass-card p-4 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
            >
              <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>{status.label}</p>
              <div className='mt-3 flex items-end justify-between gap-2'>
                <p className='text-3xl font-bold text-white'>{counts[status.id]}</p>
                <span className='text-xs font-semibold text-cyan-300'>View section</span>
              </div>
            </Link>
          ))}
        </div>

        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          <Link
            href='/tickets/insights/assignee-workload'
            className='glass-card p-4 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
          >
            <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>Assignee Workload</p>
            <p className='mt-3 text-2xl font-semibold text-white'>Detailed task assignment</p>
          </Link>
          <Link
            href='/tickets/insights/team-summary'
            className='glass-card p-4 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
          >
            <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>Team Summary</p>
            <p className='mt-3 text-2xl font-semibold text-white'>Workload health metrics</p>
          </Link>
          <Link
            href='/tickets/insights/unique-insight'
            className='glass-card p-4 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
          >
            <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>Unique Insight</p>
            <p className='mt-3 text-2xl font-semibold text-white'>Actionable assignment tips</p>
          </Link>
          <Link
            href='/tickets/insights'
            className='glass-card p-4 rounded-3xl border border-white/10 transition hover:border-cyan-400/40 hover:bg-slate-950/90'
          >
            <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>All Insights</p>
            <p className='mt-3 text-2xl font-semibold text-white'>Open the full insight hub</p>
          </Link>
        </div>
      </div>

      <Suspense fallback={<Loading />}>
        <div className='mx-0'>
          <KanbanBoard allTickets={tickets} />
        </div>
      </Suspense>
    </div>
  );
}

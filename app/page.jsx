import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import { getTickets } from "@/db/actions";
import { getUserFromSession } from "@/lib/betterauth";

export default async function Home() {
  const tickets = await getTickets();
  const token = cookies().get("tasktracker_session")?.value;
  const user = token ? await getUserFromSession(token) : null;
  const totalTickets = tickets.length;
  const openIssues = tickets.filter((ticket) => ticket.status !== "done").length;
  const overdue = tickets.filter((ticket) => dayjs(ticket.due_date).isBefore(dayjs())).length;
  const highPriority = tickets.filter((ticket) => ticket.priority === "high").length;
  const dueSoon = tickets.filter((ticket) => {
    const due = dayjs(ticket.due_date);
    return due.isAfter(dayjs()) && due.diff(dayjs(), "day") <= 3;
  }).length;
  const nextDeadline = tickets
    .filter((ticket) => dayjs(ticket.due_date).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.due_date).valueOf() - dayjs(b.due_date).valueOf())[0];

  return (
    <main className='max-w-screen-xl mx-auto px-4 py-10 sm:px-8'>
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
        <div className='glass-card p-8 rounded-3xl border border-white/10'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-white'>
            Modern Task Tracker
          </h1>
          <p className='mt-4 text-slate-200 text-lg md:text-xl leading-relaxed'>
            Task management with live insight cards, team workload intelligence, and a faster issue board.
          </p>

          <div className='mt-6 space-y-3'>
            <p className='text-cyan-300 font-semibold'>• Dashboard analytics for overdue and urgent tickets</p>
            <p className='text-cyan-300 font-semibold'>• Searchable issue board with priority and status filters</p>
            <p className='text-cyan-300 font-semibold'>• Clear next-deadline visibility and healthy workload signal</p>
          </div>

          <div className='mt-6 flex flex-wrap gap-3'>
            <Link href="/tickets" className='primary-btn px-5 py-3 rounded-full text-sm font-bold transition-transform duration-300 inline-flex items-center justify-center'>
              View Issues
            </Link>
            <Link href="/tickets/create" className='bg-white/15 hover:bg-white/30 text-white px-5 py-3 rounded-full text-sm font-semibold border border-cyan-400/30 transition inline-flex items-center justify-center'>
              Create Issue
            </Link>
          </div>
        </div>

        <div className='glass-card p-4 rounded-3xl overflow-hidden border border-white/10'>
          <img
            src='https://cdni.iconscout.com/illustration/premium/thumb/dashboard-analysis-data-5624576-4685125.png?f=webp'
            alt='dashboard illustration'
            className='w-full h-80 object-contain'
          />
        </div>
      </section>

      {user ? (
        <>
          <section className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <div className='glass-card p-6 rounded-3xl border border-white/10'>
              <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>Total tasks</p>
              <p className='mt-3 text-4xl font-bold text-white'>{totalTickets}</p>
              <p className='mt-2 text-sm text-slate-400'>All tickets currently in the system.</p>
            </div>

            <div className='glass-card p-6 rounded-3xl border border-white/10'>
              <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>Open issues</p>
              <p className='mt-3 text-4xl font-bold text-cyan-300'>{openIssues}</p>
              <p className='mt-2 text-sm text-slate-400'>Work still requiring action.</p>
            </div>

            <div className='glass-card p-6 rounded-3xl border border-white/10'>
              <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>Urgent priority</p>
              <p className='mt-3 text-4xl font-bold text-amber-300'>{highPriority}</p>
              <p className='mt-2 text-sm text-slate-400'>High-priority tasks currently open.</p>
            </div>

            <div className='glass-card p-6 rounded-3xl border border-white/10'>
              <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>Due soon</p>
              <p className='mt-3 text-4xl font-bold text-rose-300'>{dueSoon}</p>
              <p className='mt-2 text-sm text-slate-400'>Tasks due within the next 3 days.</p>
            </div>
          </section>

          <section className='mt-10 grid gap-4 lg:grid-cols-3'>
            <div className='glass-card p-6 rounded-3xl border border-white/10 col-span-full lg:col-span-2'>
              <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>Next deadline</p>
              <h2 className='mt-4 text-2xl font-semibold text-white'>{nextDeadline ? nextDeadline.title : "No upcoming deadlines"}</h2>
              <p className='mt-2 text-sm text-slate-400'>{nextDeadline ? `Due ${dayjs(nextDeadline.due_date).format("DD MMM YYYY")}` : "All tasks are up to date."}</p>
            </div>

            <div className='glass-card p-6 rounded-3xl border border-white/10'>
              <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>Overdue warning</p>
              <h2 className='mt-4 text-2xl font-semibold text-white'>{overdue}</h2>
              <p className='mt-2 text-sm text-slate-400'>{overdue > 0 ? "These tasks need your immediate attention." : "No overdue tasks right now."}</p>
            </div>
          </section>
        </>
      ) : (
        <section className='mt-10 glass-card p-6 rounded-3xl border border-white/10'>
          <h2 className='text-2xl font-semibold text-white'>Sign in for dashboard insights</h2>
          <p className='mt-3 text-slate-400'>You need to be signed in to see task analytics and next-deadline insights.</p>
          <div className='mt-5'>
            <Link href='/auth/login' className='inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>
              Sign In
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

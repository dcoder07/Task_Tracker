import { FiBarChart2 } from "react-icons/fi";
import { MdPeople } from "react-icons/md";
import dayjs from "dayjs";

function calculateInsightData(tickets, users) {
  const now = dayjs();
  const totals = tickets.reduce((acc, ticket) => {
    const key = ticket.user_email || "Unassigned";
    const item = acc[key] || { count: 0, overdue: 0, high: 0, medium: 0, low: 0 };
    item.count += 1;
    item.overdue += now.isAfter(dayjs(ticket.due_date)) ? 1 : 0;
    item.high += ticket.priority === "high" ? 1 : 0;
    item.medium += ticket.priority === "medium" ? 1 : 0;
    item.low += ticket.priority === "low" ? 1 : 0;
    acc[key] = item;
    return acc;
  }, {});

  const assigneeRows = Object.entries(totals)
    .map(([email, value]) => {
      const user = users.find((u) => u.email === email);
      const label = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email : email;
      return {
        email,
        label,
        count: value.count,
        overdue: value.overdue,
        high: value.high,
        medium: value.medium,
        low: value.low,
      };
    })
    .sort((a, b) => b.count - a.count);

  const totalTickets = tickets.length;
  const totalOverdue = assigneeRows.reduce((sum, row) => sum + row.overdue, 0);
  const busiest = assigneeRows[0];
  const mostOverdue = [...assigneeRows].sort((a, b) => b.overdue - a.overdue)[0];
  const tip = busiest?.count > totalTickets * 0.4
    ? `Workload is concentrated on ${busiest.label}. Consider rebalancing assignments.`
    : "Assignment load looks balanced across the team.";

  return { assigneeRows, totalTickets, totalOverdue, busiest, mostOverdue, tip };
}

export function AssigneeWorkloadDetail({ tickets, users }) {
  const { assigneeRows, totalTickets } = calculateInsightData(tickets, users);

  return (
    <div className='glass-card p-6 rounded-3xl border border-white/10 shadow-xl shadow-cyan-500/5'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-white'>Assignee Workload</h2>
          <p className='mt-2 text-slate-400 text-sm max-w-xl'>See how many tickets are assigned to each teammate, with overdue and priority signals to keep sprint load visible.</p>
        </div>
        <div className='rounded-3xl bg-slate-950/60 px-4 py-3 text-right'>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>Total Tasks</p>
          <p className='mt-2 text-3xl font-semibold text-cyan-300'>{totalTickets}</p>
        </div>
      </div>

      <div className='mt-6 space-y-4'>
        {assigneeRows.map((person) => {
          const progress = Math.round((person.count / Math.max(totalTickets, 1)) * 100);
          return (
            <div key={person.email} className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm text-slate-400'>Assignee</p>
                  <p className='text-base font-semibold text-white truncate max-w-[220px]'>{person.label}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-cyan-300'>{person.count} tasks</p>
                  <p className='text-xs text-slate-500'>{person.overdue} overdue</p>
                </div>
              </div>
              <div className='mt-3 h-2 rounded-full bg-white/10 overflow-hidden'>
                <div className='h-full rounded-full bg-cyan-400 transition-all duration-300' style={{ width: `${progress}%` }} />
              </div>
              <div className='mt-3 flex items-center justify-between text-xs text-slate-400 gap-3'>
                <span>High {person.high}</span>
                <span>Medium {person.medium}</span>
                <span>Low {person.low}</span>
              </div>
            </div>
          );
        })}
        {assigneeRows.length === 0 && <p className='text-slate-400'>No active assignments yet.</p>}
      </div>
    </div>
  );
}

export function TeamSummaryDetail({ tickets, users }) {
  const { assigneeRows, totalOverdue, busiest, mostOverdue } = calculateInsightData(tickets, users);

  return (
    <div className='space-y-5'>
      <div className='glass-card p-6 rounded-3xl border border-white/10 shadow-xl shadow-cyan-400/5'>
        <div className='flex items-center gap-3 text-cyan-300'>
          <MdPeople size={24} />
          <div>
            <p className='text-sm uppercase tracking-[0.2em]'>Team Summary</p>
            <p className='text-xl font-semibold text-white'>Assignment health</p>
          </div>
        </div>
        <div className='mt-6 grid gap-4 sm:grid-cols-2'>
          <div className='rounded-3xl bg-slate-950/70 p-4 border border-white/10'>
            <p className='text-xs text-slate-400'>Most loaded teammate</p>
            <p className='mt-2 text-lg font-semibold text-white'>{busiest?.label || "—"}</p>
            <p className='text-sm text-slate-500'>{busiest ? `${busiest.count} tasks assigned` : "No assignment data"}</p>
          </div>
          <div className='rounded-3xl bg-slate-950/70 p-4 border border-white/10'>
            <p className='text-xs text-slate-400'>Overdue tasks</p>
            <p className='mt-2 text-lg font-semibold text-white'>{totalOverdue}</p>
            <p className='text-sm text-slate-500'>{mostOverdue?.overdue ? `${mostOverdue.label} has the most overdue work` : "No overdue tasks"}</p>
          </div>
        </div>
      </div>

      <div className='glass-card p-6 rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl shadow-blue-500/10'>
        <div className='text-sm text-slate-300'>Team assignment breakdown</div>
        <div className='mt-4 space-y-3'>
          {assigneeRows.map((person) => (
            <div key={person.email} className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm text-slate-400'>{person.label}</p>
                  <p className='text-xs text-slate-500'>{person.count} tasks, {person.overdue} overdue</p>
                </div>
                <div className='text-xs text-slate-500'>High {person.high} • Medium {person.medium} • Low {person.low}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UniqueInsightDetail({ tickets, users }) {
  const { assigneeRows, totalTickets, tip } = calculateInsightData(tickets, users);

  return (
    <div className='glass-card p-6 rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl shadow-blue-500/10'>
      <div className='flex items-center gap-3 text-blue-300'>
        <FiBarChart2 size={24} />
        <div>
          <p className='text-sm uppercase tracking-[0.2em]'>Unique insight</p>
          <p className='text-xl font-semibold text-white'>Smart Assignment Tip</p>
        </div>
      </div>
      <div className='mt-5 space-y-5 text-slate-300'>
        <p>{tip}</p>
        <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
          <div className='flex items-center justify-between gap-4'>
            <div>
              <p className='text-xs text-slate-500 uppercase tracking-[0.18em]'>Task balance</p>
              <p className='mt-2 text-lg font-semibold text-white'>{assigneeRows.length ? `${Math.round(totalTickets / assigneeRows.length)} avg tasks/person` : "—"}</p>
            </div>
            <div className='rounded-full bg-cyan-500/15 px-3 py-2 text-xs font-semibold text-cyan-200'>Smart load</div>
          </div>
        </div>
        <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
          <p className='text-xs text-slate-400 uppercase tracking-[0.18em]'>Recommendation</p>
          <p className='mt-3 text-sm text-slate-300'>Use this page to decide whether to rebalance tasks, focus on overdue owners, or smooth team load before the next sprint.</p>
        </div>
      </div>
    </div>
  );
}

export function AssigneeSummaryBoard({ tickets, users }) {
  return (
    <div className='grid gap-5 lg:grid-cols-[1.35fr_0.85fr]'>
      <AssigneeWorkloadDetail tickets={tickets} users={users} />
      <div className='space-y-5'>
        <TeamSummaryDetail tickets={tickets} users={users} />
        <UniqueInsightDetail tickets={tickets} users={users} />
      </div>
    </div>
  );
}

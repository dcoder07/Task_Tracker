"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { MdDelete, MdVisibility } from "react-icons/md";
import { FiBarChart2, FiFilter } from "react-icons/fi";
import { deleteTicket, updateTicketStatus } from "@/db/actions";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const STATUSES = [
  { id: "backlog", label: "Backlog", color: "from-slate-500 to-slate-600" },
  { id: "in_progress", label: "In Progress", color: "from-blue-500 to-blue-600" },
  { id: "in_review", label: "In Review", color: "from-amber-500 to-amber-600" },
  { id: "done", label: "Done", color: "from-emerald-500 to-emerald-600" },
];

const priorityOrder = { high: 3, medium: 2, low: 1 };

function DraggableTicketCard({ ticket, users }) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDued = dayjs(ticket.due_date).isBefore(dayjs(Date.now()));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='glass-card p-4 rounded-2xl border border-white/10 cursor-grab active:cursor-grabbing select-none'
      {...attributes}
      {...listeners}
    >
      <div className='block group'>
        <div className='flex justify-between items-start gap-2 mb-2'>
          <h3 className='text-sm font-bold text-cyan-100 group-hover:text-cyan-300 transition line-clamp-2'>
            {ticket.title}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
            ticket.priority === "high" ? "pill-high" : ticket.priority === "medium" ? "pill-medium" : "pill-low"
          }`}>
            {ticket.priority}
          </span>
        </div>

        <div className='flex items-center gap-2 mb-3'>
          <Image
            src={ticket.imgSrc}
            width={32}
            height={32}
            alt='Assigned user'
            className='rounded-full ring-1 ring-cyan-300/40'
          />
          <div className='flex-1'>
            <p className='text-xs text-slate-400'>Assigned: <span className='text-cyan-200'>{users.find(u => u.email === ticket.user_email)?.first_name || ticket.user_email.split("@")[0]}</span></p>
            <p className='text-xs text-slate-400'>By: <span className='text-cyan-200'>{users.find(u => u.email === ticket.reported_by)?.first_name || ticket.reported_by.split("@")[0]}</span></p>
          </div>
        </div>

        <div className='flex justify-between items-center text-xs mb-2'>
          <span className={isDued ? "text-red-300" : "text-slate-400"}>
            {dayjs(ticket.due_date).format("DD MMM")}
          </span>
        </div>

        <p className='text-xs text-slate-300 line-clamp-2 mb-3'>{ticket.body}</p>

        <button
          className='w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-semibold rounded-lg transition-colors'
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/tickets/${ticket.id}`);
          }}
        >
          <MdVisibility className='inline mr-1' size={14} />
          View Details
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ status, tickets, users }) {
  const { setNodeRef } = useSortable({
    id: status.id,
    data: { type: "Column", statusId: status.id },
  });

  return (
    <div
      ref={setNodeRef}
      className='glass-panel p-5 rounded-2xl border border-white/10 min-h-[600px] flex flex-col'
    >
      <div className={`bg-gradient-to-r ${status.color} p-3 rounded-xl mb-4 text-white font-bold`}>
        {status.label}
        <span className='ml-2 text-sm opacity-90'>({tickets.length})</span>
      </div>

      <SortableContext
        items={tickets.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-3 flex-1 overflow-y-auto'>
          {tickets.map((ticket) => (
            <div key={ticket.id} className='relative group'>
              <DraggableTicketCard ticket={ticket} users={users} />
            </div>
          ))}
          {tickets.length === 0 && (
            <div className='flex items-center justify-center h-32 text-slate-400 text-sm'>
              No tickets yet
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ allTickets }) {
  const [tickets, setTickets] = useState(allTickets || []);
  const [activeId, setActiveId] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  useEffect(() => {
    setTickets(allTickets || []);
  }, [allTickets]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("/api/users", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const userList = await response.json();
        setUsers(userList);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };
    loadUsers();
  }, []);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
      const isOverdue = dayjs(ticket.due_date).isBefore(dayjs());
      const matchesOverdue = !showOverdueOnly || isOverdue;
      const matchesSearch =
        !query ||
        [ticket.title, ticket.body, ticket.user_email, ticket.reported_by]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesPriority && matchesOverdue && matchesSearch;
    });
  }, [tickets, search, statusFilter, priorityFilter, showOverdueOnly]);

  const stats = useMemo(() => {
    const counts = {
      total: filteredTickets.length,
      backlog: 0,
      in_progress: 0,
      in_review: 0,
      done: 0,
      overdue: 0,
      dueSoon: 0,
    };

    filteredTickets.forEach((ticket) => {
      counts[ticket.status] += 1;
      if (dayjs(ticket.due_date).isBefore(dayjs())) {
        counts.overdue += 1;
      }
      const due = dayjs(ticket.due_date);
      if (due.isAfter(dayjs()) && due.diff(dayjs(), "day") <= 3) {
        counts.dueSoon += 1;
      }
    });

    return counts;
  }, [filteredTickets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const movedTicket = tickets.find((t) => t.id === active.id);
    if (!movedTicket) return;

    let newStatus;
    if (over.data.current?.type === "Column") {
      newStatus = over.data.current.statusId;
    } else {
      // Dropped on a ticket
      const overTicket = tickets.find((t) => t.id === over.id);
      if (overTicket) {
        newStatus = overTicket.status;
      } else {
        return;
      }
    }

    if (movedTicket.status === newStatus) return;

    setTickets(
      tickets.map((t) =>
        t.id === active.id ? { ...t, status: newStatus } : t
      )
    );

    try {
      await updateTicketStatus(active.id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      setTickets(allTickets);
    }
  };

  const ticketsByStatus = {
    backlog: filteredTickets.filter((t) => t.status === "backlog").sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]),
    in_progress: filteredTickets.filter((t) => t.status === "in_progress").sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]),
    in_review: filteredTickets.filter((t) => t.status === "in_review").sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]),
    done: filteredTickets.filter((t) => t.status === "done").sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]),
  };

  return (
    <>
      <div className='glass-card p-5 rounded-3xl border border-white/10 mb-6'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='rounded-2xl bg-cyan-500/10 p-3 text-cyan-300'>
                <FiBarChart2 size={24} />
              </div>
              <div>
                <p className='text-sm text-slate-400 uppercase tracking-[0.24em]'>Issue intelligence</p>
                <h2 className='text-2xl font-semibold text-white'>Search, filter, and focus your board</h2>
              </div>
            </div>
            <p className='max-w-2xl text-slate-300 text-sm'>Use live search, status and priority filters, or show only overdue tickets to keep your workflow aligned and easy to manage.</p>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
              <p className='text-xs text-slate-500 uppercase tracking-[0.24em]'>Active</p>
              <p className='mt-2 text-2xl font-semibold text-cyan-300'>{stats.total}</p>
              <p className='text-xs text-slate-500'>Filtered results</p>
            </div>
            <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
              <p className='text-xs text-slate-500 uppercase tracking-[0.24em]'>Overdue</p>
              <p className='mt-2 text-2xl font-semibold text-rose-300'>{stats.overdue}</p>
              <p className='text-xs text-slate-500'>Needs attention</p>
            </div>
            <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
              <p className='text-xs text-slate-500 uppercase tracking-[0.24em]'>Due soon</p>
              <p className='mt-2 text-2xl font-semibold text-amber-300'>{stats.dueSoon}</p>
              <p className='text-xs text-slate-500'>Next 3 days</p>
            </div>
            <div className='rounded-3xl border border-white/10 bg-slate-950/70 p-4'>
              <p className='text-xs text-slate-500 uppercase tracking-[0.24em]'>In progress</p>
              <p className='mt-2 text-2xl font-semibold text-blue-300'>{stats.in_progress}</p>
              <p className='text-xs text-slate-500'>Currently active</p>
            </div>
          </div>
        </div>

        <div className='mt-6 grid gap-3 xl:grid-cols-[1.8fr_1fr]'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
              <div className='flex-1'>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search title, description, assignee or reporter...'
                  className='w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/80'
                />
              </div>
              <button
                type='button'
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setShowOverdueOnly(false);
                }}
                className='inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 transition'
              >
                <FiFilter />
                Reset filters
              </button>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <label className='rounded-3xl border border-white/10 bg-slate-950/80 p-3'>
                <span className='text-xs text-slate-500 uppercase tracking-[0.24em]'>Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className='mt-2 w-full rounded-2xl bg-slate-900/90 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400'
                >
                  <option value='all'>All</option>
                  {STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>{status.label}</option>
                  ))}
                </select>
              </label>

              <label className='rounded-3xl border border-white/10 bg-slate-950/80 p-3'>
                <span className='text-xs text-slate-500 uppercase tracking-[0.24em]'>Priority</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className='mt-2 w-full rounded-2xl bg-slate-900/90 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-amber-400'
                >
                  <option value='all'>All</option>
                  <option value='high'>High</option>
                  <option value='medium'>Medium</option>
                  <option value='low'>Low</option>
                </select>
              </label>

              <button
                type='button'
                onClick={() => setShowOverdueOnly((current) => !current)}
                className={`rounded-3xl border px-3 py-3 text-sm font-semibold transition ${showOverdueOnly ? "border-rose-300 bg-rose-500/10 text-rose-200" : "border-white/10 bg-white/5 text-slate-200"}`}
              >
                {showOverdueOnly ? "Showing overdue only" : "Show overdue only"}
              </button>
            </div>
          </div>

        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status.id}
              status={status}
              tickets={ticketsByStatus[status.id]}
              users={users}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId && (
            <div className='glass-card p-4 rounded-2xl border border-white/10 shadow-2xl opacity-75'>
              <p className='text-sm font-bold text-cyan-100'>
                {tickets.find((t) => t.id === activeId)?.title}
              </p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}

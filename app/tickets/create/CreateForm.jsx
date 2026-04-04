"use client";

import React from "react";
import { useState, useEffect } from "react";
import Dropdown from "/app/components/Dropdown";
import DateComp from "/app/components/DateComp";
import { createTicket, getUserByEmail } from "@/db/actions";
import { useAuth } from "@/hooks/useAuth";

export default function CreateForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [assignee_id, setAssigneeId] = useState("");
  const [reporter_id, setReporterId] = useState("");
  const [priority, setPriority] = useState("low");
  const [due_date, setDueDate] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    "https://img.freepik.com/premium-photo/vector-illustration-about-art-people_975572-12153.jpg"
  );
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch("/api/users", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const userList = await response.json();
        setUsers(userList);

        // Set current user as reporter by default (using email from auth)
        if (user?.email) {
          const currentUserData = userList.find((u) => u.email === user.email);
          if (currentUserData) {
            setCurrentUser(currentUserData);
            setReporterId(currentUserData.id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    loadUsers();
  }, [user]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (Date.now() / 1000 > due_date) {
        throw new Error("Due Date is in past");
      }

      if (!assignee_id) {
        throw new Error("Please select an assignee");
      }

      if (!reporter_id) {
        throw new Error("Please select a reporter");
      }

      const ticketData = {
        title,
        body,
        priority,
        user_email: users.find(u => u.id === parseInt(assignee_id))?.email || "",
        reported_by: users.find(u => u.id === parseInt(reporter_id))?.email || "",
        reporter_id: parseInt(reporter_id),
        assignee_id: parseInt(assignee_id),
        due_date,
        imgSrc,
      };

      console.log(ticketData);

      await createTicket(ticketData);
    } catch (error) {
      console.log(error);
      alert(String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='min-h-screen flex flex-col items-center justify-center py-10 px-4'>
      <div className='glass-card w-full max-w-3xl p-8 rounded-3xl border border-white/10'>
        <h2 className='text-3xl font-bold text-white mb-2'>Add New Issue</h2>
        <p className='text-sm text-slate-300 mb-6'>Submit a ticket with details, priority and assignee to start tracking.</p>

        <form className='space-y-5' onSubmit={handleSubmit}>
          <label className='block'>
            <span className='block text-sm text-slate-300 mb-2 font-medium'>Title</span>
            <input
              className='w-full rounded-xl border border-cyan-400/30 bg-slate-900 px-4 py-2 text-white focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type='text'
            />
          </label>

          <label className='block'>
            <span className='block text-sm text-slate-300 mb-2 font-medium'>Body</span>
            <textarea
              className='w-full rounded-xl border border-cyan-400/30 bg-slate-900 px-4 py-2 text-white focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
              required
              rows={4}
              onChange={(e) => setBody(e.target.value)}
              value={body}
            />
          </label>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <label className='block'>
              <span className='block text-sm text-slate-300 mb-2 font-medium'>Priority</span>
              <select
                className='w-full rounded-xl border border-cyan-400/30 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
                onChange={(e) => setPriority(e.target.value)}
                value={priority}
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </label>

            <label className='block'>
              <span className='block text-sm text-slate-300 mb-2 font-medium'>Reporter</span>
              <select
                className='w-full rounded-xl border border-cyan-400/30 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
                onChange={(e) => setReporterId(e.target.value)}
                value={reporter_id}
                required
              >
                <option value=''>Select Reporter</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <label className='block'>
              <span className='block text-sm text-slate-300 mb-2 font-medium'>Assignee</span>
              <select
                className='w-full rounded-xl border border-cyan-400/30 bg-slate-900 px-3 py-2 text-white focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30'
                onChange={(e) => setAssigneeId(e.target.value)}
                value={assignee_id}
                required
              >
                <option value=''>Select Assignee</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </label>

            <label className='block'>
              <span className='block text-sm text-slate-300 mb-2 font-medium'>Due Date</span>
              <div className='rounded-xl border border-cyan-400/30 bg-slate-900 p-2'>
                <DateComp
                  handleChange={(dateString) => {
                    setDueDate(dateString);
                  }}
                />
              </div>
            </label>
          </div>

          <button
            className='primary-btn w-full py-3 rounded-full font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed'
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Issue"}
          </button>
        </form>
      </div>
    </section>
  );
}

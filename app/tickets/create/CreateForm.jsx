"use client";
import { DatePicker } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";
export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [priority, setPriority] = useState("low");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ticket = {
      title,
      body,
      priority,
      user_email,
    };
    const res = await fetch("https://testapi-ouv6.onrender.com/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });
    if (res.status === 201) {
      router.refresh(); //To refetch the new data
      router.push("/tickets");
    }
  };
  return (
    <section>
      <span className='flex justify-center w-full my-10 font-bold text-[#013FCB] text-3xl'>
        Add New Ticket
      </span>
      <form
        className='shadow-2xl md:w-[50%] w-[75%] gap-5 bg-blue-200 border-2 border-blue-600 rounded-sm h-auto flex flex-col p-5 mx-auto'
        onSubmit={handleSubmit}
      >
        <label className='flex flex-col gap-3'>
          <span className='font-semibold'>Title:</span>
          <input
            className='p-2'
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type='text'
          />
        </label>
        <label className='flex flex-col gap-3'>
          <span className='font-semibold'>Body:</span>
          <input
            className='p-2'
            required
            onChange={(e) => setBody(e.target.value)}
            value={body}
            type='text'
          />
        </label>
        <label className='flex flex-col gap-3'>
          <span className='font-semibold'>Priority:</span>
          <select
            onChange={(e) => setPriority(e.target.value)}
            value={priority}
          >
            <option value='low'>Low Priority</option>
            <option value='medium'>Medium Priority</option>
            <option value='high'>High Priority</option>
          </select>
        </label>
        <label className='flex flex-col gap-3'>
          <span className='font-semibold'>User Email:</span>
          <input
            className='p-2'
            required
            onChange={(e) => setUserEmail(e.target.value)}
            value={user_email}
            type='text'
          />
        </label>
        <label>
        <span className='font-semibold'>Pick a Date:</span>
          <DatePicker/>
        </label>
        <button
          className='bg-[#013FCB] font-semibold hover:scale-110 transition delay-300 duration-500 text-white px-2 py-1 mx-auto mt-2 rounded-full'
          disabled={isLoading}
        >
          {isLoading && <span>Adding...</span>}
          {!isLoading && <span>Add Tickets</span>}
        </button>
      </form>
    </section>
  );
}

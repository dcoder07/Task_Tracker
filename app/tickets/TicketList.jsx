import React from "react";
import { tickets } from "../index.js";
export default function TicketList() {
  return (
    <>
    <div className="max-container grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5 sm:m-10">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white px-5 pt-5 rounded-2xl relative">
          <h3 className="text-lg font-bold text-slate-700 mb-4">{ticket.title}</h3>
          <p className="mb-10 text-gray-500 ">{ticket.body.slice(0, 200)}...</p>
          <div className={`pill ${ticket.priority} absolute right-0 translate-y-[-24px] rounded-tl-2xl rounded-br-2xl px-2`}>
            {ticket.priority} priority
          </div>
        </div>
      ))}
      {tickets.length === 0 && <p>There are no tickets open 😁!!!</p>}</div>
    </>
  );
}

import { notFound } from "next/navigation";
import React from "react";
import { getTicket, getComments } from "@/db/actions";
import { TicketDetailClient } from "./TicketDetailClient";
import { cookies } from "next/headers";
import { getUserFromSession } from "@/lib/betterauth";

export default async function TicketDetails({ params }) {
  const ticket = await getTicket(params.id);

  if (!ticket) {
    notFound();
  }

  const comments = await getComments(params.id);
  const token = cookies().get("tasktracker_session")?.value;
  const currentUserData = token ? await getUserFromSession(token) : null;
  const currentUser = currentUserData?.email || "Anonymous";

  return (
    <TicketDetailClient 
      ticket={ticket} 
      initialComments={comments}
      currentUser={currentUser}
    />
  );
}

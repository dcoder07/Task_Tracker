"use server";

import { revalidatePath } from "next/cache";
import { db } from ".";
import { ticketsTable } from "./schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export const createTicket = async (data) => {
  const res = await db.insert(ticketsTable).values(data);
  revalidatePath("/tickets", "page");
  redirect("/tickets");
};

export const getTickets = async () => {
  return await db.select().from(ticketsTable);
};

export const deleteTicket = async (id) => {
  const res = await db.delete(ticketsTable).where(eq(ticketsTable.id, id));
  revalidatePath("/tickets", "page");
};

export const getTicket = async (id) => {
  const ticket =  (
    await db.select().from(ticketsTable).where(eq(ticketsTable.id, id))
  )[0]

  return ticket
};

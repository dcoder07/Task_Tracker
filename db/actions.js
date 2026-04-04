"use server";

import { revalidatePath } from "next/cache";
import { db } from ".";
import { ticketsTable, commentsTable, usersTable, permissionsTable, rolePermissionsTable } from "./schema";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { cache } from "react";
import crypto from "crypto";

export const getTickets = cache(async () => {
  return await db.select().from(ticketsTable);
});

export const getTicket = cache(async (id) => {
  const ticket = (
    await db.select().from(ticketsTable).where(eq(ticketsTable.id, parseInt(id)))
  )[0];
  return ticket;
});

export const deleteTicket = async (id) => {
  const res = await db.delete(ticketsTable).where(eq(ticketsTable.id, id));
  revalidatePath("/tickets", "page");
};

export const updateTicketStatus = async (id, status) => {
  await db
    .update(ticketsTable)
    .set({ status, updated_at: new Date() })
    .where(eq(ticketsTable.id, parseInt(id)));
  revalidatePath("/tickets", "page");
  revalidatePath(`/tickets/${id}`, "page");
};

export const updateTicketDetails = async (id, data) => {
  await db
    .update(ticketsTable)
    .set({ ...data, updated_at: new Date() })
    .where(eq(ticketsTable.id, parseInt(id)));
  revalidatePath(`/tickets/${id}`, "page");
};

// Comments Functions
export const getComments = cache(async (ticketId) => {
  return await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.ticket_id, parseInt(ticketId)));
});

export const addComment = async (ticketId, author, content) => {
  await db.insert(commentsTable).values({
    ticket_id: parseInt(ticketId),
    author,
    content,
    created_at: new Date(),
  });
  revalidatePath(`/tickets/${ticketId}`, "page");
};

export const deleteComment = async (commentId, ticketId) => {
  await db.delete(commentsTable).where(eq(commentsTable.id, parseInt(commentId)));
  revalidatePath(`/tickets/${ticketId}`, "page");
};

// User Management Functions
export const seedPermissions = async () => {
  const permissions = [
    { name: "manage_users", description: "Can manage user accounts and roles" },
    { name: "manage_tickets", description: "Can create, edit, and delete all tickets" },
    { name: "view_all_tickets", description: "Can view tickets assigned to others" },
    { name: "manage_comments", description: "Can manage all comments" },
  ];

  for (const perm of permissions) {
    await db.insert(permissionsTable).values(perm).onConflictDoNothing();
  }

  // Seed role permissions
  const rolePermissions = [
    { role: "admin", permission_name: "manage_users" },
    { role: "admin", permission_name: "manage_tickets" },
    { role: "admin", permission_name: "view_all_tickets" },
    { role: "admin", permission_name: "manage_comments" },
    { role: "manager", permission_name: "manage_tickets" },
    { role: "manager", permission_name: "view_all_tickets" },
    { role: "manager", permission_name: "manage_comments" },
    { role: "developer", permission_name: "manage_tickets" },
  ];

  for (const rp of rolePermissions) {
    const permission = await db.select().from(permissionsTable).where(eq(permissionsTable.name, rp.permission_name)).limit(1);
    if (permission[0]) {
      await db.insert(rolePermissionsTable).values({
        role: rp.role,
        permission_id: permission[0].id,
      }).onConflictDoNothing();
    }
  }
};

export const createUser = async (userData) => {
  const insertData = {
    email: userData.email,
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    password_hash: userData.password_hash || null,
    role: userData.role || "viewer",
    is_active: userData.is_active ? true : false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  insertData.clerk_id = userData.clerk_id || crypto.randomUUID();

  await db.insert(usersTable).values(insertData);
  revalidatePath("/admin/users", "page");
  const createdUser = await getUserByEmail(insertData.email);
  return createdUser;
};

export const getUsers = cache(async () => {
  return await db.select().from(usersTable);
});

export const getUserByClerkId = cache(async (clerkId) => {
  if (!clerkId) return null;
  try {
    const user = (
      await db.select().from(usersTable).where(eq(usersTable.clerk_id, clerkId))
    )[0];
    return user || null;
  } catch (error) {
    console.error("getUserByClerkId error", error);
    return null;
  }
});

export const getUserByEmail = cache(async (email) => {
  if (!email) return null;
  try {
    const user = (
      await db
        .select({
          id: usersTable.id,
          clerk_id: usersTable.clerk_id,
          email: usersTable.email,
          password_hash: usersTable.password_hash,
          first_name: usersTable.first_name,
          last_name: usersTable.last_name,
          role: usersTable.role,
          is_active: usersTable.is_active,
          created_at: usersTable.created_at,
          updated_at: usersTable.updated_at,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1)
    )[0];
    return user || null;
  } catch (error) {
    console.error("getUserByEmail error", error);
    return null;
  }
});

export const getUserById = cache(async (id) => {
  const user = (
    await db.select().from(usersTable).where(eq(usersTable.id, parseInt(id)))
  )[0];
  return user;
});

export const updateUser = async (id, data) => {
  await db
    .update(usersTable)
    .set({ ...data, updated_at: new Date() })
    .where(eq(usersTable.id, parseInt(id)));
  revalidatePath("/admin/users", "page");
  revalidatePath(`/profile/${id}`, "page");
};

export const deleteUser = async (id) => {
  await db.delete(usersTable).where(eq(usersTable.id, parseInt(id)));
  revalidatePath("/admin/users", "page");
};

// Permission Functions
export const getPermissions = cache(async () => {
  return await db.select().from(permissionsTable);
});

export const getRolePermissions = cache(async (role) => {
  return await db
    .select({
      permission: permissionsTable.name,
      description: permissionsTable.description,
    })
    .from(rolePermissionsTable)
    .innerJoin(permissionsTable, eq(rolePermissionsTable.permission_id, permissionsTable.id))
    .where(eq(rolePermissionsTable.role, role));
});

export const hasPermission = async (userId, permission) => {
  const user = await getUserById(userId);
  if (!user) return false;

  const rolePermissions = await getRolePermissions(user.role);
  return rolePermissions.some(p => p.permission === permission);
};

// Update ticket creation to handle reporter and assignee IDs
export const createTicket = async (data) => {
  const ticketData = {
    ...data,
    status: "backlog",
    created_at: new Date(),
    updated_at: new Date(),
  };
  const res = await db.insert(ticketsTable).values(ticketData);
  revalidatePath("/tickets", "page");
  redirect("/tickets");
};

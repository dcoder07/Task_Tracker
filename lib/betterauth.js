import crypto from "crypto";
import { db } from "@/db";
import { usersTable, sessionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "tasktracker_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function toHex(buffer) {
  return buffer.toString("hex");
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

export function verifyPassword(password, hashed) {
  if (!password || !hashed) return false;
  const [salt, key] = hashed.split(":");
  if (!salt || !key) return false;

  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return crypto.timingSafeEqual(derived, keyBuffer);
}

export async function createSession(userId) {
  const token = toHex(crypto.randomBytes(32));
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  await db.insert(sessionsTable).values({
    token,
    user_id: userId,
    expires_at: expiresAt,
  });
  return token;
}

export async function getSession(token) {
  if (!token) return null;
  const session = (await db.select().from(sessionsTable).where(eq(sessionsTable.token, token)))[0];
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
    return null;
  }
  return session;
}

export async function getUserFromSession(token) {
  const session = await getSession(token);
  if (!session) return null;

  const user = (await db.select().from(usersTable).where(eq(usersTable.id, session.user_id)))[0];
  if (!user || !user.is_active) return null;

  // Return full user record without password hash
  const { password_hash, ...rest } = user;
  return rest;
}

export async function invalidateSession(token) {
  if (!token) return;
  await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

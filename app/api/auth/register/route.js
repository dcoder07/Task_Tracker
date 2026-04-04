import { NextResponse } from "next/server";
import { hashPassword, createSession, getSessionCookieOptions } from "@/lib/betterauth";
import { createUser, getUserByEmail } from "@/db/actions";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, password, first_name, last_name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const password_hash = hashPassword(password);
    const user = await createUser({
      email,
      first_name: first_name || "",
      last_name: last_name || "",
      password_hash,
      role: "viewer",
      is_active: true,
    });

    if (!user || !user.id) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const token = await createSession(user.id);
    const res = NextResponse.json({ user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role } });
    res.cookies.set("tasktracker_session", token, getSessionCookieOptions());
    return res;
  } catch (error) {
    const errDetail = {
      message: error?.message || "Registration failed",
      name: error?.name,
      stack: error?.stack,
      cause: error?.cause,
    };
    console.error("Register error", errDetail);
    return NextResponse.json({ error: errDetail.message, detail: errDetail }, { status: 500 });
  }
}

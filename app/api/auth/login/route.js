import { NextResponse } from "next/server";
import { verifyPassword, createSession, getSessionCookieOptions } from "@/lib/betterauth";
import { getUserByEmail } from "@/db/actions";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 403 });
    }

    const token = await createSession(user.id);
    const res = NextResponse.json({ user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role } });
    res.cookies.set("tasktracker_session", token, getSessionCookieOptions());
    return res;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

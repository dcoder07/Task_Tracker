import { NextResponse } from "next/server";
import { invalidateSession } from "@/lib/betterauth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const token = req.cookies.get("tasktracker_session")?.value;
    if (token) {
      await invalidateSession(token);
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set("tasktracker_session", "", { path: "/", maxAge: 0 });
    return res;
  } catch (error) {
    console.error("Logout error", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

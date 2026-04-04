import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/betterauth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const token = req.cookies.get("tasktracker_session")?.value;
    const user = token ? await getUserFromSession(token) : null;
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me fetch error", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

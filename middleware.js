import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth", "/api/auth", "/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/auth/me"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("tasktracker_session");
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};

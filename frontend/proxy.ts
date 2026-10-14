import { NextRequest, NextResponse } from "next/server";

// UX guard only: checks a session cookie exists. Express requireAuth is the real enforcement.
export function proxy(request: NextRequest) {
  if (!request.cookies.has("token")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};

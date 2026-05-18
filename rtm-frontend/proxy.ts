import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") 
  || request.nextUrl.pathname.startsWith("/register") 
  || request.nextUrl.pathname.startsWith("/logout") 
  || request.nextUrl.pathname.startsWith("/forgot-password");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/login", "/register", "/forgot-password", "/logout"],
};

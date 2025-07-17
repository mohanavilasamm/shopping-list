import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
 
    if(!sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }
 
    return NextResponse.next();
}
 
export const config = {
  matcher: [
    // Protect specific pages
    "/select-store",
    "/shopping-list",
    // Protect specific API routes
    "/api/proxy/:path*",
  ],
};

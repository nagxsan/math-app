import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const nonProtectedPaths = ["/api/sign-in", "/sign-in", "/api/sign-up", "/sign-up"];

  const notProtectedRoute = nonProtectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  if (notProtectedRoute) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);
  console.log(user);

  if (!user || typeof user === "string") {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const requestWithUser = req.clone();
  requestWithUser.headers.set("x-user-email", user.email);
  requestWithUser.headers.set("x-user-role", user.role);

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Apply middleware only to API routes except:
     * - api/sign-in
     * - api/sign-up
     */
    '/api/:path*',
  ],
};

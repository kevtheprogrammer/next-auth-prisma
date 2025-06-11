import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  console.log("🔐 Token:", token);
  console.log("🍪 Cookies:", req.cookies.getAll());

  const isAuthRoute = req.nextUrl.pathname.startsWith("/dashboard");

  if (isAuthRoute && !token) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/signin";
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

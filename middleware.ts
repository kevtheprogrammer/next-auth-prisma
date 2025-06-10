import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Allow public routes
  if (!path.startsWith('/dashboard') && !path.startsWith('/signin') && !path.startsWith('/signup')) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  console.log('Secrete -----------:', process.env.AUTH_SECRET);
  console.log('Token -----------:', token);

  // No token? Redirect to signin
  if (!token) {
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  // Token exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

 
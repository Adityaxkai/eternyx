import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and auth endpoints
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/api/admin/auth')) {
    if (!session.isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (pathname.startsWith('/admin/login') && session.isAdmin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

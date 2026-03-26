import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DASHBOARD_DEFAULT = '/dashboard/client';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = !!request.cookies.get('access_token')?.value;

  if (pathname === '/') {
    return NextResponse.redirect(new URL(hasToken ? DASHBOARD_DEFAULT : '/login', request.url));
  }

  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL(hasToken ? DASHBOARD_DEFAULT : '/login', request.url));
  }

  if (pathname.startsWith('/dashboard/') && !hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && hasToken) {
    return NextResponse.redirect(new URL(DASHBOARD_DEFAULT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/dashboard/:path*', '/login'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. [Skip] Static resources, APIs (except possibly specific secure ones if needed), etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Check Auth Token and Role
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value; // Note: Cookie is not tamper-proof securily, but acceptable for MVP routing.

  // 3. Handling Auth Pages (Login/Signup)
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if (isAuthPage) {
    // If user is ALREADY logged in, redirect to their dashboard
    if (authToken) {
      if (userRole === 'manager') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else if (userRole === 'worker') {
        return NextResponse.redirect(new URL('/tbm', request.url)); // Worker Dashboard
      }
      // If role is invalid/missing but token exists, maybe let them login again or go home
      return NextResponse.next();
    }
    // If not logged in, allow access to login/signup
    return NextResponse.next();
  }

  // 4. Protected Routes
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/tbm') ||
    pathname.startsWith('/chat');

  if (isProtectedPath) {
    // If NOT logged in, redirect to Login
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      // Optional: Add ?next=pathname to redirect back after login
      return NextResponse.redirect(loginUrl);
    }

    // Role-Based Access Control
    if (pathname.startsWith('/dashboard')) {
      // Manager Only
      if (userRole !== 'manager') {
        // If worker tries to access dashboard, send to TBM
        return NextResponse.redirect(new URL('/tbm', request.url));
      }
    }

    if (pathname.startsWith('/tbm') || pathname.startsWith('/chat')) {
      // Worker Area (Managers can access too? For now, let's allow managers or restrict)
      // If strict worker only:
      /*
      if (userRole !== 'worker' && userRole !== 'manager') {
         return NextResponse.redirect(new URL('/login', request.url));
      }
      */
    }
  }

  // 5. Root Path ('/')
  // If we want root to auto-redirect based on role:
  /*
  if (pathname === '/') {
     if (authToken) {
        if (userRole === 'manager') return NextResponse.redirect(new URL('/dashboard', request.url));
        if (userRole === 'worker') return NextResponse.redirect(new URL('/tbm', request.url));
     }
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
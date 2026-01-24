import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. [예외 처리] 정적 리소스, API(auth 제외), 로그인 페이지 등은 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname === '/favicon.ico' ||
    // 퍼블릭 이미지 등
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg')
  ) {
    return NextResponse.next();
  }

  // 2. 인증 토큰 및 역할 확인
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // 3. 로그인이 필요한 페이지인데 토큰이 없는 경우 -> 로그인 페이지로
  if (!authToken) {
    // 보호된 경로에 접근하려고 할 때만 리다이렉트
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/tbm') ||
      pathname.startsWith('/chat')
    ) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 루트 페이지('/')는 통역 모드(공용)일 수 있으므로 허용할 수도 있지만,
    // 현재 기획상 루트가 통역 메인이면 허용, 아니면 로그인으로 보냄
    // 여기서는 일단 통과시킴 (Page 내부에서 처리 or Public)
    return NextResponse.next();
  }

  // 4. 권한 기반 접근 제어

  // (1) 관리자 전용 구역 (/dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (userRole !== 'manager') {
      // 권한 없음: 근로자 메인으로 보내거나 에러 페이지
      // 여기서는 본인의 역할에 맞는 페이지로 리다이렉트
      if (userRole === 'worker') {
        return NextResponse.redirect(new URL('/tbm', request.url));
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // (2) 근로자 전용 구역 (/tbm, /chat)
  // 관리자가 근로자 페이지를 볼 필요가 있다면 허용, 아니라면 차단.
  // 보통 관리자는 모니터링이 주 목적이므로 Dashboard에 머묾.
  if (pathname.startsWith('/tbm') || pathname.startsWith('/chat')) {
    // 관리자가 근로자 뷰를 테스트할 수도 있으므로 일단은 '로그인만 되어있으면' 허용하거나,
    // 엄격하게 막으려면 아래 주석 해제
    /*
    if (userRole !== 'worker') {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    */
  }

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
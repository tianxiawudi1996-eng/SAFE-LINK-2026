// 로그인 API
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // 필수 필드 검증
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        // 사용자 조회
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                managerProfile: true,
                workerProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: '이메일 또는 비밀번호가 잘못되었습니다.' },
                { status: 401 }
            );
        }

        // 비밀번호 검증
        if (!verifyPassword(password, user.password)) {
            return NextResponse.json(
                { success: false, error: '이메일 또는 비밀번호가 잘못되었습니다.' },
                { status: 401 }
            );
        }

        // 만료된 세션 정리 (로그인 시 청소)
        await prisma.userSession.deleteMany({
            where: {
                userId: user.id,
                expiresAt: { lt: new Date() }
            },
        });

        // 새 세션 생성
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일

        await prisma.userSession.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // 쿠키 설정
        const response = NextResponse.json({
            success: true,
            message: '로그인 성공',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                profile: user.role === 'manager' ? user.managerProfile : user.workerProfile,
            },
            token,
        });

        // HttpOnly 쿠키에 토큰 저장 (미들웨어 검증용)
        // 로컬 개발 환경(HTTP) 호환성을 위해 secure 옵션을 false로 조정
        const isProduction = process.env.NODE_ENV === 'production';

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: isProduction, // 배포 환경에서만 true
            sameSite: 'lax',
            path: '/',
            expires: expiresAt,
        });

        // 역할 쿠키 (클라이언트/미들웨어 참조용)
        response.cookies.set('user_role', user.role, {
            httpOnly: false,
            secure: isProduction, // 배포 환경에서만 true
            sameSite: 'lax',
            path: '/',
            expires: expiresAt,
        });

        return response;
    } catch (error) {
        console.error('로그인 오류:', error);
        return NextResponse.json(
            { success: false, error: '로그인에 실패했습니다.' },
            { status: 500 }
        );
    }
}

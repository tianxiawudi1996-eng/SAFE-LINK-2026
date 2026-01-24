import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (username === 'admin' && password === 'admin') {
            const token = generateToken();

            // 쿠키 설정 또는 토큰 반환
            return NextResponse.json({
                success: true,
                token,
                user: { name: 'Super Admin', role: 'super_admin' }
            });
        }

        return NextResponse.json(
            { success: false, error: '아이디 또는 비밀번호가 잘못되었습니다.' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

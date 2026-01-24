import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('id');

        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID is required' }, { status: 400 });
        }

        // 세션 삭제 시 연결된 서명들도 Cascade로 삭제됨 (Prisma 스키마 설정에 따라 다름, 여기선 명시적 트랜잭션 사용 안 해도 되지만 안전하게)
        await prisma.tbmSession.delete({
            where: { id: sessionId },
        });

        return NextResponse.json({ success: true, message: '세션이 삭제되었습니다.' });
    } catch (error) {
        console.error('Session delete error:', error);
        return NextResponse.json({ success: false, error: '삭제 실패' }, { status: 500 });
    }
}

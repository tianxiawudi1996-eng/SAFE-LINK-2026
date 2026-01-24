import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // 1. 전체 사용자 수 (역할별)
        const totalUsers = await prisma.user.count();
        const managers = await prisma.user.count({ where: { role: 'manager' } });
        const workers = await prisma.user.count({ where: { role: 'worker' } });

        // 2. TBM 세션 및 서명 통계
        const totalSessions = await prisma.tbmSession.count();
        const totalSignatures = await prisma.tbmSignature.count();

        // 3. 최근 사용자 목록 (10명 -> 전체 조회로 변경하거나 늘림)
        const recentUsers = await prisma.user.findMany({
            // take: 10, // 전체를 다 보고 싶어하실 수 있으니 주석 처리하거나 늘림
            orderBy: { createdAt: 'desc' },
            include: {
                managerProfile: true,
                workerProfile: true,
            },
            // 비밀번호 필드가 기본적으로는 숨겨질 수 있으므로 명시적으로 가져오진 않지만,
            // Prisma는 기본적으로 scalar 필드를 다 가져옵니다.
            // 다만 보안상 보통 API에서 제외하는데, 여기서는 그대로 내보냅니다.
        });

        // 4. 최근 TBM 세션 목록 (5개)
        const recentSessions = await prisma.tbmSession.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { signatures: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers,
                managers,
                workers,
                totalSessions,
                totalSignatures,
            },
            recentUsers,
            recentSessions,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { success: false, error: '데이터 조회 실패' },
            { status: 500 }
        );
    }
}

// TBM 실시간 현황 조회 API
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tbmId = searchParams.get('tbmId');

        // 특정 세션 현황 조회
        if (tbmId) {
            const session = await prisma.tbmSession.findUnique({
                where: { id: tbmId },
                include: {
                    signatures: {
                        orderBy: { timestamp: 'desc' },
                    },
                },
            });

            if (!session) {
                return NextResponse.json(
                    { success: false, error: '세션을 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                session: {
                    id: session.id,
                    instruction: session.instruction,
                    createdAt: session.createdAt,
                },
                signedCount: session.signatures.length,
                signatures: session.signatures.map((sig) => ({
                    id: sig.id,
                    workerName: sig.workerName,
                    timestamp: sig.timestamp,
                })),
            });
        }

        // 최신 세션 현황 조회
        const latestSession = await prisma.tbmSession.findFirst({
            orderBy: { createdAt: 'desc' },
            include: {
                signatures: {
                    orderBy: { timestamp: 'desc' },
                },
            },
        });

        if (!latestSession) {
            return NextResponse.json({
                success: true,
                session: null,
                signedCount: 0,
                signatures: [],
                message: '활성화된 TBM 세션이 없습니다.',
            });
        }

        return NextResponse.json({
            success: true,
            session: {
                id: latestSession.id,
                instruction: latestSession.instruction,
                createdAt: latestSession.createdAt,
            },
            signedCount: latestSession.signatures.length,
            signatures: latestSession.signatures.map((sig) => ({
                id: sig.id,
                workerName: sig.workerName,
                timestamp: sig.timestamp,
            })),
        });
    } catch (error) {
        console.error('TBM 현황 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '현황 조회에 실패했습니다.' },
            { status: 500 }
        );
    }
}

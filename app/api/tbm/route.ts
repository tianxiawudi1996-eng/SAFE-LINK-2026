// TBM 세션 생성 API
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { instruction } = await request.json();

        if (!instruction || instruction.trim() === '') {
            return NextResponse.json(
                { success: false, error: '지시사항을 입력해주세요.' },
                { status: 400 }
            );
        }

        // TBM 세션 생성
        const session = await prisma.tbmSession.create({
            data: {
                instruction: instruction.trim(),
            },
        });

        return NextResponse.json({
            success: true,
            session: {
                id: session.id,
                instruction: session.instruction,
                createdAt: session.createdAt,
            },
        });
    } catch (error) {
        console.error('TBM 세션 생성 오류:', error);
        return NextResponse.json(
            { success: false, error: 'TBM 세션 생성에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// 최신 TBM 세션 조회 (GET)
export async function GET() {
    try {
        const latestSession = await prisma.tbmSession.findFirst({
            orderBy: { createdAt: 'desc' },
            include: {
                signatures: true,
            },
        });

        if (!latestSession) {
            return NextResponse.json({
                success: true,
                session: null,
                message: '활성화된 TBM 세션이 없습니다.',
            });
        }

        return NextResponse.json({
            success: true,
            session: {
                id: latestSession.id,
                instruction: latestSession.instruction,
                createdAt: latestSession.createdAt,
                signedCount: latestSession.signatures.length,
                signatures: latestSession.signatures,
            },
        });
    } catch (error) {
        console.error('TBM 세션 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: 'TBM 세션 조회에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// TBM 서명 저장 API
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { tbmId, workerName, signatureData } = await request.json();

        // 필수 필드 검증
        if (!tbmId || !workerName || !signatureData) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // TBM 세션 존재 여부 확인
        const session = await prisma.tbmSession.findUnique({
            where: { id: tbmId },
        });

        if (!session) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 TBM 세션입니다.' },
                { status: 404 }
            );
        }

        // 중복 서명 체크 (같은 세션, 같은 근로자)
        const existingSignature = await prisma.tbmSignature.findFirst({
            where: {
                tbmId: tbmId,
                workerName: workerName,
            },
        });

        if (existingSignature) {
            return NextResponse.json(
                { success: false, error: '이미 서명을 완료했습니다.' },
                { status: 409 }
            );
        }

        // 서명 저장
        const signature = await prisma.tbmSignature.create({
            data: {
                tbmId: tbmId,
                workerName: workerName.trim(),
                signatureData: signatureData, // WebAuthn 인증 데이터 (암호화됨)
            },
        });

        // 현재 세션의 총 서명 수 조회
        const totalSignatures = await prisma.tbmSignature.count({
            where: { tbmId: tbmId },
        });

        return NextResponse.json({
            success: true,
            message: '서명이 완료되었습니다.',
            signature: {
                id: signature.id,
                workerName: signature.workerName,
                timestamp: signature.timestamp,
            },
            totalSignatures: totalSignatures,
        });
    } catch (error) {
        console.error('TBM 서명 저장 오류:', error);
        return NextResponse.json(
            { success: false, error: '서명 저장에 실패했습니다.' },
            { status: 500 }
        );
    }
}

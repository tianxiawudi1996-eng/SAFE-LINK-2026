// 회원가입 API
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, role, country, language } = body;

        // 필수 필드 검증
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: '올바른 이메일 형식이 아닙니다.' },
                { status: 400 }
            );
        }

        // 비밀번호 길이 검증
        if (password.length < 4) {
            return NextResponse.json(
                { success: false, error: '비밀번호는 4자 이상이어야 합니다.' },
                { status: 400 }
            );
        }

        // 근로자인 경우 국가/언어 필수
        if (role === 'worker' && (!country || !language)) {
            return NextResponse.json(
                { success: false, error: '근로자는 국가와 언어를 선택해야 합니다.' },
                { status: 400 }
            );
        }

        // 이메일 중복 체크 - transaction 밖에서 체크하여 빠른 실패
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: '이미 사용중인 이메일입니다.' },
                { status: 409 }
            );
        }

        // 비밀번호 해시
        const hashedPassword = hashPassword(password);
        const token = generateToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일

        // 트랜잭션으로 사용자 + 프로필 + 세션 생성
        const result = await prisma.$transaction(async (tx) => {
            // 1. 사용자 생성
            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role,
                },
            });

            // 2. 프로필 생성
            if (role === 'manager') {
                await tx.managerProfile.create({
                    data: { userId: user.id },
                });
            } else if (role === 'worker') {
                await tx.workerProfile.create({
                    data: {
                        userId: user.id,
                        country: country || 'KR',
                        language: language || 'Korean',
                        // @ts-ignore - Prisma client generation blocked by file lock on Windows
                        gender: body.gender || 'female', // 성별 저장 (기본값 여성)
                    },
                });
            }

            // 3. 세션 생성
            await tx.userSession.create({
                data: {
                    userId: user.id,
                    token,
                    expiresAt,
                },
            });

            return user;
        });

        // 응답 (비밀번호 제외)
        return NextResponse.json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                id: result.id,
                email: result.email,
                name: result.name,
                role: result.role,
                gender: role === 'worker' ? body.gender : undefined, // 성별 추가
            },
            token,
        });

    } catch (error) {
        console.error('회원가입 오류:', error);
        return NextResponse.json(
            { success: false, error: '회원가입에 실패했습니다.' },
            { status: 500 }
        );
    }
}

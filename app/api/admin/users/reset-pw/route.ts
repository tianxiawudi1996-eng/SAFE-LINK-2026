import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth'; // Ensure this utility is exported or duplicate logic

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        // 1234 해시 생성 (auth.ts에 hashPassword가 export 안되어있으면 복붙 필요)
        // 여기서는 간단히 하기 위해 직접 해시 로직 구현 혹은 import

        // *주의*: lib/auth.ts에서 hashPassword가 export 되어 있어야 함.
        // 만약 안되어있으면 로직 복제
        const crypto = require('crypto');
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHash('sha256').update('1234' + salt).digest('hex');
        const hashedPassword = `${salt}:${hash}`;

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

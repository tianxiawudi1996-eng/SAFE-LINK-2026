import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ success: true, message: '사용자가 삭제되었습니다.' });
    } catch (error) {
        console.error('User delete error:', error);
        return NextResponse.json({ success: false, error: '삭제 실패' }, { status: 500 });
    }
}

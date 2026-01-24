import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(password + salt).digest('hex');
    return `${salt}:${hash}`;
}

async function main() {
    const currentEmail = 'wo3ai4ni3@never.com'; // 현재 DB에 있는 이메일
    const targetEmail = 'wo3ai4ni3@naver.com';   // 사용자가 의도했을 법한 이메일
    const newPassword = '1234';
    const hashedPassword = hashPassword(newPassword);

    // 1. 이미 naver.com 계정이 있는지 확인
    const existingNaver = await prisma.user.findUnique({
        where: { email: targetEmail }
    });

    if (existingNaver) {
        // naver 계정이 이미 있으면 비번만 리셋
        await prisma.user.update({
            where: { email: targetEmail },
            data: { password: hashedPassword }
        });
        console.log(`User ${targetEmail} found. Password reset to '1234'.`);
    } else {
        // naver 계정이 없으면, never 계정을 찾아서 이메일 수정 + 비번 리셋
        const existingNever = await prisma.user.findUnique({
            where: { email: currentEmail }
        });

        if (existingNever) {
            await prisma.user.update({
                where: { email: currentEmail },
                data: {
                    email: targetEmail,
                    password: hashedPassword
                }
            });
            console.log(`Updated email from ${currentEmail} to ${targetEmail} and reset password to '1234'.`);
        } else {
            console.log('User not found with either email.');
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

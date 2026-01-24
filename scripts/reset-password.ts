import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

const prisma = new PrismaClient();

// auth.ts의 hashPassword 함수와 동일한 로직
function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(password + salt).digest('hex');
    return `${salt}:${hash}`;
}

async function main() {
    const email = 'wo3ai4ni3@never.com';
    const newPassword = '1234';
    const hashedPassword = hashPassword(newPassword);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log(`Password for user ${user.name} (${user.email}) has been reset to '${newPassword}'`);
    } catch (error) {
        console.error('Error updating password:', error);
        console.log('User might not exist. Please check the email.');
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

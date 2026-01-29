
const { PrismaClient } = require('@prisma/client');
const { createHash, randomBytes } = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update(password + salt).digest('hex');
    return `${salt}:${hash}`;
}

async function main() {
    console.log('Fixing admin user password...');
    try {
        const hashedPassword = hashPassword('admin');
        const updatedUser = await prisma.user.update({
            where: { email: 'admin' },
            data: { password: hashedPassword }
        });
        console.log('Updated admin user password to hashed version:', updatedUser.email);
    } catch (e) {
        console.error('Error updating admin user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

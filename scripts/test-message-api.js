const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Testing Message API Schema...');

    try {
        // 1. Create a dummy message with senderRole field
        const msg = await prisma.workerMessage.create({
            data: {
                workerName: 'TestBot',
                workerCountry: 'US',
                workerLanguage: 'en',
                originalText: 'Test message',
                translatedText: '테스트 메시지',
                senderRole: 'worker',
                isRead: false
            }
        });
        console.log('✅ Created Message ID:', msg.id);

        // 2. Query with new filters
        const count = await prisma.workerMessage.count({
            where: { isRead: false }
        });
        console.log('✅ Unread Count:', count);

        // 3. Clean up
        await prisma.workerMessage.delete({ where: { id: msg.id } });
        console.log('✅ Cleanup complete');

    } catch (e) {
        console.error('❌ Error:', e);
        process.exit(1);
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

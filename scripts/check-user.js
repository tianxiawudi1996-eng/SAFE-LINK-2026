
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking database users...');
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- ${u.email} (${u.role}, name: ${u.name})`);
        });

        if (users.length === 0) {
            console.log('No users found. Creating admin user...');
            const newUser = await prisma.user.create({
                data: {
                    email: 'admin',
                    password: 'admin', // In a real app, hash this!
                    name: 'Admin',
                    role: 'manager',
                    managerProfile: {
                        create: {
                            department: 'Headquarters',
                            position: 'System Admin'
                        }
                    }
                }
            });
            console.log('Created admin user:', newUser);
        } else {
            const admin = users.find(u => u.email === 'admin');
            if (!admin) {
                console.log('User "admin" not found. Creating...');
                await prisma.user.create({
                    data: {
                        email: 'admin',
                        password: 'admin',
                        name: 'Admin',
                        role: 'manager',
                        managerProfile: {
                            create: {
                                department: 'HQ',
                                position: 'Admin'
                            }
                        }
                    }
                });
                console.log('Created admin user.');
            }
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

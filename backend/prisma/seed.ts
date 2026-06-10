/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

const prisma = new PrismaService();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seeding.');
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      username: 'Admin',
      role: 'admin',
    },
  });

  console.log('Admin user created:', admin);
  await createSampleConversations(admin.id);
}

async function createSampleConversations(adminId: string) {
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@mail.com',
      password: await bcrypt.hash('User123', 10),
      username: 'Sample User',
      role: 'user',
    },
  });

  // Create a sample conversation between the admin and the demo user
  const conv = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: adminId }, { id: user1.id }],
      },
    },
  });

  // User 1 send sample message to the conversation
  await prisma.message.create({
    data: {
      content: 'Hello! This is a sample conversation.',
      senderId: user1.id,
      conversationId: conv.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      username: 'Admin',
      role: 'admin',
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

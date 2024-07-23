import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed admin
  const admin1 = await prisma.admin.upsert({
    where: { email: 'admin1@example.com' },
    update: {},
    create: {
      name: 'Admin One',
      email: 'admin1@example.com',
      password: 'password1',
      permissions: 'ALL',
    },
  })

  // Seed users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: 'password1',
      userLabel: 'RETAIL',
      role: 'MEMBER',
      userProfiles: {
        create: {
          fullName: 'John Doe',
          studioName: 'Studio XYZ',
          address: '123 Main St',
          phoneNumber: '555-1234',
          profilePicture: 'user1.jpg',
          birthdate: new Date('1990-01-01'),
        },
      },
    },
  })
}

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const cashierPassword = await bcrypt.hash('cashier123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create cashier user
  const cashier = await prisma.user.upsert({
    where: { username: 'cashier' },
    update: {},
    create: {
      username: 'cashier',
      password: cashierPassword,
      role: 'CASHIER',
    },
  })

  console.log('Seed completed:')
  console.log('Admin user created:', admin.username)
  console.log('Cashier user created:', cashier.username)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

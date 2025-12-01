import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'pola@polarad.co.kr'
  const password = 'Qnwkchqnwk2@'

  const hashedPassword = await bcrypt.hash(password, 12)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      name: 'Polarad Admin',
      password: hashedPassword,
      role: 'SUPER',
      isActive: true,
    },
  })

  console.log('✅ Admin account created/updated:')
  console.log(`   Email: ${admin.email}`)
  console.log(`   Role: ${admin.role}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

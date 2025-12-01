import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 패키지 데이터 생성
  const packages = [
    {
      name: 'BASIC',
      displayName: '베이직',
      price: 500000,
      description: '소규모 사업장을 위한 기본 패키지',
      features: ['META 광고 운영', '기본 리포트', '월 1회 컨설팅'],
      sortOrder: 1,
    },
    {
      name: 'STANDARD',
      displayName: '스탠다드',
      price: 1000000,
      description: '성장하는 사업을 위한 표준 패키지',
      features: ['META 광고 운영', 'NAVER 광고 운영', '상세 리포트', '월 2회 컨설팅', '명함/명찰 디자인'],
      sortOrder: 2,
    },
    {
      name: 'PREMIUM',
      displayName: '프리미엄',
      price: 2000000,
      description: '풀서비스를 원하는 사업장을 위한 프리미엄 패키지',
      features: ['META 광고 운영', 'NAVER 광고 운영', '실시간 리포트', '주 1회 컨설팅', '명함/명찰/봉투 디자인', '웹사이트 제작', '블로그 관리'],
      sortOrder: 3,
    },
    {
      name: 'CUSTOM',
      displayName: '맞춤형',
      price: 0,
      description: '맞춤형 서비스 (별도 협의)',
      features: ['맞춤형 서비스 구성'],
      sortOrder: 4,
    },
  ]

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: pkg,
      create: pkg,
    })
  }
  console.log(`✅ Created ${packages.length} packages`)

  // 테스트 사용자 생성 (옵션)
  const hashedPassword = await bcrypt.hash('1234', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'test@polarad.co.kr' },
    update: {},
    create: {
      clientName: '테스트업체',
      name: '홍길동',
      email: 'test@polarad.co.kr',
      phone: '01012345678',
      password: hashedPassword,
      smsConsent: true,
      emailConsent: true,
    },
  })

  console.log(`✅ Created test user: ${testUser.clientName} (${testUser.email})`)
  console.log(`   Login: 클라이언트명: 테스트업체, 연락처: 01012345678, PIN: 1234`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// 추가: 관리자 계정 생성을 위한 별도 함수
async function createAdmin() {
  const adminPassword = await bcrypt.hash('Qnwkchqnwk2@', 12)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'pola@polarad.co.kr' },
    update: { password: adminPassword },
    create: {
      email: 'pola@polarad.co.kr',
      name: 'Polarad Admin',
      password: adminPassword,
      role: 'SUPER',
      isActive: true,
    },
  })
  
  console.log('Admin created:', admin.email)
}

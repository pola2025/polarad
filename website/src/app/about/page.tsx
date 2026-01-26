'use client'

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema'
import { Button } from '@/components/ui/Button'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { FloatingLines } from '@/components/ui/FloatingLines'
import { motion } from 'framer-motion'
import { Building2, ArrowRight, Target, Zap, Shield, Heart, Users, Clock, BadgeCheck, Headphones } from 'lucide-react'

// 핵심 가치
const coreValues = [
  {
    icon: Target,
    title: '단순함',
    description: '카카오 로그인 한 번으로 고객 정보를 정확하게 수집합니다. 스팸 걱정 없이 진성 리드만 받으세요.',
  },
  {
    icon: Zap,
    title: '신속함',
    description: '기획 확정 후 5~7일 내 제작 완료. 빠르게 리드 수집을 시작할 수 있습니다.',
  },
  {
    icon: Shield,
    title: '합리성',
    description: '월 3만원으로 랜딩페이지 + 1년 자동화. 텔레그램 알림과 대시보드까지 모두 포함됩니다.',
  },
]

// 폴라애드를 선택해야 하는 이유
const whyPolaad = [
  {
    icon: Heart,
    title: '중소기업을 이해합니다',
    description: '제한된 예산으로도 효율적인 리드 수집이 가능합니다. 복잡한 시스템 없이 카카오 로그인과 텔레그램 알림으로 간편하게 시작하세요.',
  },
  {
    icon: Users,
    title: '올인원 솔루션',
    description: '랜딩페이지 제작, 카카오 로그인 연동, 텔레그램 알림, 관리 대시보드까지. 리드 수집에 필요한 모든 것을 한 번에 제공합니다.',
  },
  {
    icon: BadgeCheck,
    title: '투명한 가격 정책',
    description: '숨겨진 비용이 없습니다. 36만원(VAT 별도)으로 랜딩페이지 제작과 1년간 접수 자동화를 모두 이용할 수 있습니다.',
  },
  {
    icon: Headphones,
    title: '지속적인 지원',
    description: '제작 후에도 궁금한 점이 있다면 언제든 문의할 수 있습니다. 1년 후에는 월 1만원으로 서비스를 연장할 수 있습니다.',
  },
]

// 통계
const stats = [
  { value: '50+', label: '제작 완료' },
  { value: '98%', label: '고객 만족도' },
  { value: '7일', label: '평균 제작' },
  { value: '24/7', label: '고객 지원' },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: '홈', url: 'https://polarad.co.kr' },
          { name: '회사소개', url: 'https://polarad.co.kr/about' }
        ]}
      />

      <main className="min-h-screen bg-gray-950">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-7rem)] pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white -mt-24 md:-mt-28">
          <AuroraBackground color="mixed" intensity="medium" />

          {/* Floating Lines Effect */}
          <FloatingLines 
            linesGradient={['#E945F5', '#2F4BC0', '#E945F5']}
            animationSpeed={1}
            interactive={true}
            bendRadius={5}
            bendStrength={-0.5}
            mouseDamping={0.05}
            parallax={true}
            parallaxStrength={0.2}
            className="z-[1]"
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>

          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-400 text-sm font-semibold mb-6 backdrop-blur-sm"
                >
                  <Building2 className="w-4 h-4" />
                  <span>회사소개</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight break-keep text-balance"
                >
                  중소기업의<br />
                  <span className="text-primary-400">온라인 영업 파트너</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 break-keep text-balance"
                >
                  폴라애드는 중소기업이 온라인 영업의 어려움을 겪지 않도록<br className="hidden md:block" />
                  복잡한 과정을 하나로 모아 <span className="text-white font-semibold">쉽고 빠르게</span> 시작할 수 있도록 돕습니다.
                </motion.p>

                {/* 미션 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 max-w-xl mx-auto lg:mx-0"
                >
                  <div className="text-sm text-primary-400 font-semibold mb-2">Our Mission</div>
                  <p className="text-white font-medium break-keep">
                    &ldquo;모든 중소기업이 24시간 일하는 온라인 영업사원을 가질 수 있도록&rdquo;
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Button variant="primary" size="xl" className="w-full sm:w-auto shadow-xl shadow-primary-900/20 border border-primary-500/50" href="/contact">
                    무료 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10" href="/service">
                    서비스 보기
                  </Button>
                </motion.div>
              </div>

              {/* Right - Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex-1 w-full max-w-md lg:max-w-lg"
              >
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm"
                    >
                      <div className="text-3xl lg:text-4xl font-bold text-primary-400 mb-2">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 핵심 가치 Section */}
        <section className="py-20 lg:py-28 bg-gray-100">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-keep">
                폴라애드의 핵심 가치
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto break-keep">
                고객의 성공을 위해 추구하는 세 가지 가치
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-5">
                    <value.icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed break-keep">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 왜 폴라애드인가 Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-keep">
                왜 <span className="text-primary-600">폴라애드</span>인가?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto break-keep">
                폴라애드를 선택해야 하는 이유
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {whyPolaad.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed break-keep">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-28 px-4 overflow-hidden bg-gray-950">
          <AuroraBackground color="blue" intensity="medium" />
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white break-keep"
              >
                함께 시작하실 준비가 되셨나요?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl mb-10 text-gray-300 break-keep"
              >
                폴라애드와 함께라면 온라인 영업이 어렵지 않습니다
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button size="lg" variant="primary" href="/contact">
                  무료 상담 신청
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" href="/service" className="border-white/20 text-white hover:bg-white/10">
                  서비스 보기
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

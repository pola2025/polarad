import { redirect } from 'next/navigation'

export default function EstimatorPage() {
  // 견적계산기는 상담신청 페이지로 통합되었습니다
  redirect('/contact')
}

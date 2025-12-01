'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, X } from 'lucide-react'

function PolicyModal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)] text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 py-10 sm:py-16 px-4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
            <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-primary">폴라애드</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">정책자금·경영컨설팅 전문<br />온라인 DB영업 자동화 솔루션</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">회사</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-primary transition-colors text-xs sm:text-sm">회사소개</a></li>
                <li><a href="/service" className="text-gray-600 hover:text-primary transition-colors text-xs sm:text-sm">서비스</a></li>
                <li><a href="/portfolio" className="text-gray-600 hover:text-primary transition-colors text-xs sm:text-sm">포트폴리오</a></li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">지원</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><a href="/contact" className="text-gray-600 hover:text-primary transition-colors text-xs sm:text-sm">상담신청</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-300">
            <div className="flex flex-col gap-1.5 text-gray-500">
              {/* 상호/통신판매업 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-base">
                <span className="break-keep">상호: 폴라애드</span>
                <span className="break-keep">대표: 이재호</span>
                <span className="break-keep">사업자등록번호: 808-03-00327</span>
              </div>
              <div className="text-xs sm:text-base">
                <span className="break-keep">통신판매업신고번호: 제2025-서울금천-1908호</span>
              </div>
              {/* 연락처 정보 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-base">
                <div className="flex items-center gap-1"><Phone size={14} className="sm:hidden text-gray-400" /><Phone size={16} className="hidden sm:block text-gray-400" /><a href="tel:032-345-9834" className="hover:text-primary transition-colors font-medium">032-345-9834</a></div>
                <div className="flex items-center gap-1"><Mail size={14} className="sm:hidden text-gray-400" /><Mail size={16} className="hidden sm:block text-gray-400" /><a href="mailto:mkt@polarad.co.kr" className="hover:text-primary transition-colors">mkt@polarad.co.kr</a></div>
              </div>
              <div className="flex items-start gap-1 text-xs sm:text-base"><MapPin size={14} className="sm:hidden mt-0.5 text-gray-400 shrink-0" /><MapPin size={16} className="hidden sm:block mt-0.5 text-gray-400 shrink-0" /><span className="break-keep"><span className="sm:hidden">서울특별시 금천구 가산디지털2로 98,<br />롯데 IT 캐슬 2동 11층 1107</span><span className="hidden sm:inline">서울특별시 금천구 가산디지털2로 98, 롯데 IT 캐슬 2동 11층 1107</span></span></div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 mt-2 border-t border-gray-200 text-xs">
                <button onClick={() => setPrivacyOpen(true)} className="hover:text-primary transition-colors">개인정보처리방침</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setTermsOpen(true)} className="hover:text-primary transition-colors">이용약관</button>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span className="w-full sm:w-auto">© {currentYear} 폴라애드. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="개인정보처리방침">
        <div className="space-y-4 text-sm">
          <p className="text-gray-500 text-xs">시행일: 2025년 1월 1일</p>
          <p>폴라애드(이하 &ldquo;회사&rdquo;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>

          <h3 className="font-semibold text-gray-900 text-sm">제1조 (개인정보의 처리목적)</h3>
          <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>서비스 제공: 상담 및 문의 처리, 서비스 제공에 관한 계약 이행</li>
            <li>고객 관리: 서비스 이용에 따른 본인확인, 고객상담 및 불만처리</li>
            <li>마케팅 활용: 신규 서비스 안내 및 맞춤 서비스 제공 (동의 시)</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제2조 (수집하는 개인정보 항목 및 수집방법)</h3>
          <p className="font-medium text-gray-800">1. 수집 항목</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>필수항목: 이름, 연락처, 이메일, 회사명</li>
            <li>선택항목: 문의내용, 관심서비스</li>
          </ul>
          <p className="font-medium text-gray-800 mt-2">2. 수집 방법</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>홈페이지 상담신청 양식</li>
            <li>전화, 이메일을 통한 문의</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제3조 (개인정보의 처리 및 보유기간)</h3>
          <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>상담 및 문의 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제4조 (정보주체의 권리·의무 및 행사방법)</h3>
          <p>정보주체는 회사에 대해 언제든지 다음의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
            <li>개인정보 전송 요구 (2025년 시행)</li>
          </ul>
          <p>위 권리 행사는 서면, 전화, 이메일 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.</p>

          <h3 className="font-semibold text-gray-900 text-sm">제5조 (개인정보의 파기)</h3>
          <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>전자적 파일: 복원이 불가능한 방법으로 영구 삭제</li>
            <li>종이 문서: 분쇄기로 분쇄 또는 소각</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제6조 (개인정보의 안전성 확보조치)</h3>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>관리적 조치: 내부관리계획 수립·시행, 직원 교육</li>
            <li>기술적 조치: 개인정보처리시스템 접근 제한, 보안프로그램 설치</li>
            <li>물리적 조치: 서버실, 자료보관실 접근 통제</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제7조 (개인정보 보호책임자)</h3>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p>개인정보 보호책임자: 이재호 (대표)</p>
            <p>연락처: 032-345-9834</p>
            <p>이메일: mkt@polarad.co.kr</p>
          </div>

          <h3 className="font-semibold text-gray-900 text-sm">제8조 (권익침해 구제방법)</h3>
          <p>정보주체는 개인정보침해로 인한 구제를 받기 위하여 아래 기관에 분쟁해결이나 상담 등을 신청할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청: 1301 (www.spo.go.kr)</li>
            <li>경찰청: 182 (ecrm.cyber.go.kr)</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제9조 (개인정보 처리방침 변경)</h3>
          <p>이 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다. 변경 시 웹사이트를 통해 공지합니다.</p>
        </div>
      </PolicyModal>

      <PolicyModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="이용약관">
        <div className="space-y-4 text-sm">
          <p className="text-gray-500 text-xs">시행일: 2025년 1월 1일</p>

          <h3 className="font-semibold text-gray-900 text-sm">제1조 (목적)</h3>
          <p>이 약관은 폴라애드(이하 &ldquo;회사&rdquo;)가 제공하는 서비스의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

          <h3 className="font-semibold text-gray-900 text-sm">제2조 (정의)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>&ldquo;서비스&rdquo;란 회사가 제공하는 정책자금 컨설팅, 경영컨설팅, 온라인 DB영업 자동화 솔루션 등 모든 서비스를 말합니다.</li>
            <li>&ldquo;이용자&rdquo;란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
            <li>&ldquo;상담신청&rdquo;이란 이용자가 회사의 서비스를 이용하기 위해 상담을 요청하는 것을 말합니다.</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제3조 (약관의 효력 및 변경)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
            <li>회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있습니다.</li>
            <li>약관 변경 시 적용일자 및 변경사유를 명시하여 최소 7일 전에 공지합니다. 이용자에게 불리한 변경의 경우 30일 전에 공지합니다.</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제4조 (서비스의 제공)</h3>
          <p>회사는 다음과 같은 서비스를 제공합니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>정책자금 및 경영 컨설팅 서비스</li>
            <li>온라인 DB영업 자동화 솔루션</li>
            <li>기타 회사가 정하는 서비스</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제5조 (서비스 이용계약의 성립)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>이용계약은 이용자가 약관의 내용에 동의하고 상담신청을 한 후, 회사가 이를 승낙함으로써 성립합니다.</li>
            <li>회사는 다음의 경우 승낙을 거부하거나 유보할 수 있습니다: 허위정보 기재, 서비스 운영에 지장이 있는 경우 등</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제6조 (회사의 의무)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>회사는 관련 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않습니다.</li>
            <li>회사는 지속적이고 안정적인 서비스 제공을 위해 노력합니다.</li>
            <li>회사는 이용자의 개인정보를 보호하기 위해 보안시스템을 갖추고 개인정보처리방침을 공시하고 준수합니다.</li>
            <li>회사는 이용자의 정당한 의견이나 불만을 처리하기 위해 고객센터를 운영합니다.</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제7조 (이용자의 의무)</h3>
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>신청 또는 변경 시 허위내용 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 무단 변경</li>
            <li>회사가 정한 정보 이외의 정보 송신 또는 게시</li>
            <li>회사 및 제3자의 저작권 등 지적재산권 침해</li>
            <li>회사 및 제3자의 명예 손상 또는 업무 방해</li>
            <li>기타 관계 법령에 위반되는 행위</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제8조 (서비스 이용의 제한)</h3>
          <p>회사는 이용자가 제7조의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우 서비스 이용을 제한할 수 있습니다.</p>

          <h3 className="font-semibold text-gray-900 text-sm">제9조 (면책조항)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
            <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
            <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제10조 (분쟁해결)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위해 고객센터를 운영합니다.</li>
            <li>회사와 이용자 간에 발생한 분쟁은 「전자문서 및 전자거래 기본법」에 따른 전자거래분쟁조정위원회의 조정을 통해 해결할 수 있습니다.</li>
          </ul>

          <h3 className="font-semibold text-gray-900 text-sm">제11조 (재판권 및 준거법)</h3>
          <p>이 약관에 명시되지 않은 사항은 관계 법령 및 상관례에 따르며, 서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.</p>

          <h3 className="font-semibold text-gray-900 text-sm">부칙</h3>
          <p>이 약관은 2025년 1월 1일부터 시행합니다.</p>
        </div>
      </PolicyModal>
    </>
  )
}

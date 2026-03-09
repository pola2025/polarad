"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, X } from "lucide-react";

function PolicyModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#2a2a2a] rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/[0.06]">
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)] text-sm text-gray-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
      <footer className="bg-[#111111] border-t border-white/[0.06] py-10 sm:py-16 px-4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
            <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-[#c9a962]">
                폴라애드
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                소상공인 전용 디지털 영업사원
                <br />
                홈페이지 + 광고 + DB수집 올인원
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-white text-sm sm:text-base">
                회사
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link
                    href="/service"
                    className="text-gray-500 hover:text-[#c9a962] transition-colors text-xs sm:text-sm"
                  >
                    서비스
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo"
                    className="text-gray-500 hover:text-[#c9a962] transition-colors text-xs sm:text-sm"
                  >
                    데모
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-white text-sm sm:text-base">
                지원
              </h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-500 hover:text-[#c9a962] transition-colors text-xs sm:text-sm"
                  >
                    상담신청
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketing-news"
                    className="text-gray-500 hover:text-[#c9a962] transition-colors text-xs sm:text-sm"
                  >
                    마케팅 소식
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/[0.06]">
            <div className="flex flex-col gap-1.5 text-gray-500">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-base">
                <span className="break-keep">상호: 폴라애드</span>
                <span className="break-keep">대표: 이재호</span>
                <span className="break-keep">사업자등록번호: 808-03-00327</span>
              </div>
              <div className="text-xs sm:text-base">
                <span className="break-keep">
                  통신판매업신고번호: 제2025-서울금천-1908호
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-base">
                <div className="flex items-center gap-1">
                  <Phone size={14} className="sm:hidden text-gray-600" />
                  <Phone size={16} className="hidden sm:block text-gray-600" />
                  <a
                    href="tel:032-345-9834"
                    className="hover:text-[#c9a962] transition-colors font-medium"
                  >
                    032-345-9834
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <Mail size={14} className="sm:hidden text-gray-600" />
                  <Mail size={16} className="hidden sm:block text-gray-600" />
                  <a
                    href="mailto:mkt@polarad.co.kr"
                    className="hover:text-[#c9a962] transition-colors"
                  >
                    mkt@polarad.co.kr
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-1 text-xs sm:text-base">
                <MapPin
                  size={14}
                  className="sm:hidden mt-0.5 text-gray-600 shrink-0"
                />
                <MapPin
                  size={16}
                  className="hidden sm:block mt-0.5 text-gray-600 shrink-0"
                />
                <span className="break-keep">
                  <span className="sm:hidden">
                    서울특별시 금천구 가산디지털2로 98,
                    <br />
                    롯데 IT 캐슬 2동 11층 1107
                  </span>
                  <span className="hidden sm:inline">
                    서울특별시 금천구 가산디지털2로 98, 롯데 IT 캐슬 2동 11층
                    1107
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 mt-2 border-t border-white/[0.06] text-xs">
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="hover:text-[#c9a962] transition-colors"
                >
                  개인정보처리방침
                </button>
                <span className="text-gray-700">|</span>
                <button
                  onClick={() => setTermsOpen(true)}
                  className="hover:text-[#c9a962] transition-colors"
                >
                  이용약관
                </button>
                <span className="text-gray-700 hidden sm:inline">|</span>
                <span className="w-full sm:w-auto">
                  &copy; {currentYear} 폴라애드. All rights reserved.
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="개인정보처리방침"
      >
        <div className="space-y-4 text-sm">
          <p className="text-gray-600 text-xs">시행일: 2025년 1월 1일</p>
          <p>
            폴라애드(이하 &ldquo;회사&rdquo;)는 「개인정보 보호법」 제30조에
            따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고
            원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을
            수립·공개합니다.
          </p>
          <h3 className="font-semibold text-white text-sm">
            제1조 (개인정보의 처리목적)
          </h3>
          <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              서비스 제공: 상담 및 문의 처리, 서비스 제공에 관한 계약 이행
            </li>
            <li>
              고객 관리: 서비스 이용에 따른 본인확인, 고객상담 및 불만처리
            </li>
            <li>마케팅 활용: 신규 서비스 안내 및 맞춤 서비스 제공 (동의 시)</li>
          </ul>
          <h3 className="font-semibold text-white text-sm">
            제2조 (수집하는 개인정보 항목)
          </h3>
          <p className="font-medium text-gray-300">1. 수집 항목</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>필수항목: 이름, 연락처, 이메일, 회사명</li>
            <li>선택항목: 문의내용, 관심서비스</li>
          </ul>
          <p className="font-medium text-gray-300 mt-2">2. 수집 방법</p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>홈페이지 상담신청 양식</li>
            <li>전화, 이메일을 통한 문의</li>
          </ul>
          <h3 className="font-semibold text-white text-sm">
            제3조 (개인정보의 처리 및 보유기간)
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>상담 및 문의 기록: 3년</li>
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
          </ul>
          <h3 className="font-semibold text-white text-sm">
            제7조 (개인정보 보호책임자)
          </h3>
          <div className="bg-[#333] p-3 rounded text-sm">
            <p>개인정보 보호책임자: 이재호 (대표)</p>
            <p>연락처: 032-345-9834</p>
            <p>이메일: mkt@polarad.co.kr</p>
          </div>
        </div>
      </PolicyModal>

      <PolicyModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="이용약관"
      >
        <div className="space-y-4 text-sm">
          <p className="text-gray-600 text-xs">시행일: 2025년 1월 1일</p>
          <h3 className="font-semibold text-white text-sm">제1조 (목적)</h3>
          <p>
            이 약관은 폴라애드(이하 &ldquo;회사&rdquo;)가 제공하는 서비스의
            이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을
            목적으로 합니다.
          </p>
          <h3 className="font-semibold text-white text-sm">제2조 (정의)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              &ldquo;서비스&rdquo;란 회사가 제공하는 소상공인 리드 자동화 구독
              서비스를 말합니다.
            </li>
            <li>
              &ldquo;이용자&rdquo;란 회사의 서비스를 이용하는 자를 말합니다.
            </li>
          </ul>
          <h3 className="font-semibold text-white text-sm">
            제4조 (서비스의 제공)
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>반응형 홈페이지 제작 및 운영</li>
            <li>Meta 광고 운영 및 리드 수집 자동화</li>
            <li>월간 성과 리포트 자동 발송</li>
          </ul>
          <h3 className="font-semibold text-white text-sm">
            제11조 (재판권 및 준거법)
          </h3>
          <p>
            서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사
            소재지를 관할하는 법원을 관할 법원으로 합니다.
          </p>
          <h3 className="font-semibold text-white text-sm">부칙</h3>
          <p>이 약관은 2025년 1월 1일부터 시행합니다.</p>
        </div>
      </PolicyModal>
    </>
  );
}

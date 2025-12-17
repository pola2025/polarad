import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | PolarAD',
  description: '폴라애드 개인정보처리방침',
  robots: 'noindex, nofollow',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>폴라애드</strong>(이하 &quot;회사&quot;)는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고
            개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
          </p>
          <p className="text-sm text-gray-500 mb-8">시행일: 2025년 1월 1일</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (개인정보의 수집 및 이용 목적)</h2>
            <p className="text-gray-700 mb-3">회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>서비스 제공 및 상담 요청 처리</li>
              <li>마케팅 및 광고 서비스 제공</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>고객 문의 응대 및 불만 처리</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (수집하는 개인정보 항목)</h2>
            <p className="text-gray-700 mb-3">회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>필수항목:</strong> 이름, 연락처(전화번호), 이메일</li>
              <li><strong>선택항목:</strong> 회사명, 업종, 문의내용</li>
              <li><strong>자동수집항목:</strong> IP주소, 쿠키, 방문일시, 서비스 이용기록</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (개인정보의 보유 및 이용기간)</h2>
            <p className="text-gray-700 mb-3">
              회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 개인정보를 보관합니다.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              <li>웹사이트 방문기록: 3개월</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <p className="text-gray-700">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (개인정보의 파기)</h2>
            <p className="text-gray-700">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li><strong>전자적 파일:</strong> 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
              <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (이용자의 권리와 행사방법)</h2>
            <p className="text-gray-700 mb-3">이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
            <p className="text-gray-700 mt-3">
              위 권리 행사는 회사에 대해 서면, 전화, 이메일 등을 통하여 하실 수 있으며
              회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (개인정보 보호책임자)</h2>
            <p className="text-gray-700 mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
              개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>개인정보 보호책임자</strong></p>
              <p className="text-gray-600">성명: 이재호</p>
              <p className="text-gray-600">이메일: admin@polarad.co.kr</p>
              <p className="text-gray-600">연락처: 문의 양식을 통해 연락</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (개인정보처리방침 변경)</h2>
            <p className="text-gray-700">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              본 방침은 2025년 1월 1일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

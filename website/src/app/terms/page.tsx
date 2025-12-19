import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '서비스 이용약관 | PolarAD',
  description: '폴라애드 서비스 이용약관',
  robots: 'noindex, nofollow',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            본 약관은 <strong>폴라애드</strong>(이하 &quot;회사&quot;)가 제공하는 마케팅 서비스의 이용조건 및 절차,
            회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
          <p className="text-sm text-gray-500 mb-8">시행일: 2025년 1월 1일</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700">
              본 약관은 회사가 운영하는 웹사이트(polarad.co.kr)에서 제공하는 온라인 마케팅 서비스
              (이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항,
              기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>&quot;서비스&quot;</strong>란 회사가 제공하는 마케팅 대행, 홈페이지 제작, 광고 운영 등 일체의 서비스를 말합니다.</li>
              <li><strong>&quot;이용자&quot;</strong>란 회사의 서비스에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li><strong>&quot;회원&quot;</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ul className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
              <li>회사가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 이전부터 공지합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
            <p className="text-gray-700 mb-3">회사는 다음과 같은 서비스를 제공합니다.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>마케팅 전략 수립 및 컨설팅</li>
              <li>Meta(Facebook/Instagram) 광고 운영 대행</li>
              <li>홈페이지 기획 및 제작</li>
              <li>브랜딩 및 인쇄물 제작</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (서비스의 중단)</h2>
            <p className="text-gray-700 mb-3">
              회사는 다음 각 호에 해당하는 경우 서비스 제공을 중지할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
              <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
              <li>기타 불가항력적 사유가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (이용자의 의무)</h2>
            <p className="text-gray-700 mb-3">이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>신청 또는 변경 시 허위내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
              <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>기타 관계법령에 위반된다고 판단되는 행위</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (저작권의 귀속)</h2>
            <ul className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.</li>
              <li>이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (면책조항)</h2>
            <ul className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
              <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
              <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (분쟁해결)</h2>
            <ul className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치, 운영합니다.</li>
              <li>회사와 이용자 간에 발생한 분쟁은 대한민국 법을 준거법으로 합니다.</li>
              <li>회사와 이용자 간에 발생한 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 전속관할로 합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (기타)</h2>
            <p className="text-gray-700">
              본 약관에 명시되지 않은 사항은 관계법령 및 상관례에 따릅니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제11조 (연락처)</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">이메일: mkt@polarad.co.kr</p>
              <p className="text-gray-600">전화: 032-345-9834</p>
              <p className="text-gray-600">웹사이트: polarad.co.kr</p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              본 약관은 2025년 1월 1일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

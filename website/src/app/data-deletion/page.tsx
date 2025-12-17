import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '데이터 삭제 요청 | PolarAD',
  description: '폴라애드 사용자 데이터 삭제 요청 안내',
  robots: 'noindex, nofollow',
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">데이터 삭제 요청</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>폴라애드</strong>는 이용자의 개인정보 보호를 중요시하며,
            이용자가 자신의 데이터 삭제를 요청할 권리를 존중합니다.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">데이터 삭제 요청 방법</h2>
            <p className="text-gray-700 mb-4">
              폴라애드 서비스 이용 중 수집된 개인정보의 삭제를 원하시는 경우,
              아래 방법 중 하나를 통해 요청하실 수 있습니다.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">방법 1: 이메일 요청</h3>
              <p className="text-blue-800 mb-2">
                아래 이메일로 데이터 삭제 요청을 보내주세요.
              </p>
              <p className="text-blue-900 font-mono bg-blue-100 px-3 py-2 rounded inline-block">
                admin@polarad.co.kr
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-green-900 mb-3">방법 2: 문의 양식</h3>
              <p className="text-green-800">
                웹사이트의 <a href="/contact" className="underline font-medium">문의하기</a> 페이지를 통해
                "데이터 삭제 요청"을 선택하고 요청해주세요.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">요청 시 필요한 정보</h2>
            <p className="text-gray-700 mb-3">데이터 삭제 요청 시 다음 정보를 포함해주세요:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>성명 (또는 회사명)</li>
              <li>연락처 (이메일 또는 전화번호)</li>
              <li>삭제를 원하는 데이터 범위</li>
              <li>서비스 이용 시 사용한 계정 정보 (해당되는 경우)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">처리 절차</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-gray-900">요청 접수</h4>
                  <p className="text-gray-600">이메일 또는 문의 양식을 통해 삭제 요청 접수</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-gray-900">본인 확인</h4>
                  <p className="text-gray-600">요청자 본인 확인 절차 진행 (1-2 영업일)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-gray-900">데이터 삭제</h4>
                  <p className="text-gray-600">확인 완료 후 데이터 삭제 처리 (3-5 영업일)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                <div>
                  <h4 className="font-semibold text-gray-900">완료 통보</h4>
                  <p className="text-gray-600">삭제 완료 후 이메일로 결과 통보</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">삭제되는 데이터</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>이름, 연락처, 이메일 등 개인 식별 정보</li>
              <li>서비스 이용 기록 및 상담 내역</li>
              <li>광고 계정 연동 정보 (해당되는 경우)</li>
              <li>쿠키 및 로그 데이터</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">예외 사항</h2>
            <p className="text-gray-700 mb-3">
              다음의 경우 법령에 따라 일정 기간 데이터를 보관할 수 있습니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>전자상거래법에 따른 계약 및 결제 기록 (5년)</li>
              <li>소비자 불만 또는 분쟁 처리 기록 (3년)</li>
              <li>기타 관계 법령에 따른 보존 의무가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Facebook/Instagram 데이터</h2>
            <p className="text-gray-700 mb-4">
              Facebook 또는 Instagram을 통해 수집된 데이터의 삭제를 원하시는 경우:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>위 방법을 통해 폴라애드에 직접 요청하시거나</li>
              <li>Facebook 설정 → 앱 및 웹사이트 → 폴라애드 앱 제거를 통해 연동을 해제하실 수 있습니다</li>
            </ul>
          </section>

          <div className="bg-gray-50 rounded-xl p-6 mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">문의처</h3>
            <p className="text-gray-700">이메일: admin@polarad.co.kr</p>
            <p className="text-gray-700">웹사이트: <a href="https://polarad.co.kr" className="text-blue-600 hover:underline">polarad.co.kr</a></p>
          </div>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              최종 업데이트: 2025년 1월 1일
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Database,
  Key,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react';

type Step = 'credentials' | 'tables' | 'account' | 'complete';

interface TableResult {
  table: string;
  success: boolean;
  error?: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('credentials');

  // 입력값
  const [apiKey, setApiKey] = useState('');
  const [baseId, setBaseId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tableResults, setTableResults] = useState<TableResult[]>([]);
  const [copied, setCopied] = useState(false);

  // Step 1: 테이블 생성
  const handleCreateTables = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/content-studio/setup/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, baseId }),
      });

      const data = await res.json();

      if (data.success || data.results) {
        setTableResults(data.results || []);
        setStep('account');
      } else {
        setError(data.error || '테이블 생성에 실패했습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 계정 생성
  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/content-studio/setup/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, baseId, name, email, password, websiteUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('complete');
      } else {
        setError(data.error || '계정 생성에 실패했습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 환경변수 복사
  const envText = `CONTENT_STUDIO_BASE_ID=${baseId}
CONTENT_STUDIO_JWT_SECRET=${generateSecret()}`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Content Studio 셋업</h1>
          <p className="text-neutral-500 mt-2">Airtable 연동 및 초기 설정</p>
        </div>

        {/* 진행 표시 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['credentials', 'tables', 'account', 'complete'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : ['credentials', 'tables', 'account', 'complete'].indexOf(step) > i
                      ? 'bg-green-500 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {['credentials', 'tables', 'account', 'complete'].indexOf(step) > i ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && <div className="w-12 h-0.5 bg-neutral-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1: API 자격 증명 */}
        {step === 'credentials' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Airtable 연동 정보
            </h2>

            <div className="space-y-6">
              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Airtable Personal Access Token
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="pat..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="mt-2 text-sm text-neutral-500">
                  <a
                    href="https://airtable.com/create/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    토큰 생성하기 <ExternalLink className="w-3 h-3" />
                  </a>
                  {' '}(schema.bases:write, data.records:write 권한 필요)
                </p>
              </div>

              {/* Base ID */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Airtable Base ID
                </label>
                <input
                  type="text"
                  value={baseId}
                  onChange={(e) => setBaseId(e.target.value)}
                  placeholder="app..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="mt-2 text-sm text-neutral-500">
                  Airtable Base URL에서 확인: airtable.com/<strong>appXXXXXXXXX</strong>/...
                </p>
              </div>

              <button
                onClick={() => setStep('tables')}
                disabled={!apiKey || !baseId}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                다음 단계
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: 테이블 생성 */}
        {step === 'tables' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              테이블 생성
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600 mb-3">생성될 테이블:</p>
              <ul className="space-y-2">
                {['Clients', 'ClientTopics', 'ClientContents', 'UsageLog', 'UsageSummary'].map(
                  (table) => (
                    <li key={table} className="flex items-center gap-2 text-sm text-neutral-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {table}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('credentials')}
                className="px-4 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </button>
              <button
                onClick={handleCreateTables}
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    테이블 생성하기
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 계정 생성 */}
        {step === 'account' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              관리자 계정 생성
            </h2>

            {/* 테이블 생성 결과 */}
            {tableResults.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2">테이블 생성 완료!</p>
                <ul className="space-y-1">
                  {tableResults.map((r) => (
                    <li key={r.table} className="flex items-center gap-2 text-sm">
                      {r.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={r.success ? 'text-green-700' : 'text-red-700'}>
                        {r.table} {r.error && `(${r.error})`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  회사/브랜드명 *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="폴라애드"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  비밀번호 *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  웹사이트 URL (선택)
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                onClick={handleCreateAccount}
                disabled={loading || !name || !email || !password}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    계정 생성 완료
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: 완료 */}
        {step === 'complete' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">셋업 완료!</h2>
              <p className="text-neutral-500 mt-2">Content Studio를 사용할 준비가 되었습니다.</p>
            </div>

            {/* 환경변수 안내 */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-2">
                중요: .env.local 파일에 다음 환경변수를 추가하세요
              </p>
              <div className="relative">
                <pre className="text-xs bg-neutral-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                  {envText}
                </pre>
                <button
                  onClick={copyEnv}
                  className="absolute top-2 right-2 p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push('/content-studio/login')}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              로그인하러 가기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 랜덤 시크릿 생성 (32자)
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

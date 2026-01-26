'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  User,
  BarChart3,
  Loader2,
  Save,
  Check,
  Calendar,
  FileText,
  Globe,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface ClientInfo {
  id: string;
  name: string;
  email: string;
  websiteUrl?: string;
}

interface UsageSummary {
  yearMonth: string;
  topicCount: number;
  contentCount: number;
  publishCount: number;
  totalTokens: number;
}

export default function SettingsPage() {
  // 상태
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);

  // 폼 상태
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // 탭 상태
  const [activeTab, setActiveTab] = useState<'profile' | 'usage'>('profile');

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/content-studio/auth/me');
      const data = await res.json();

      if (data.success && data.client) {
        setClient(data.client);
        setName(data.client.name);
        setWebsiteUrl(data.client.websiteUrl || '');

        // 사용량도 함께 로드
        if (data.usage) {
          setUsageSummary(data.usage);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 프로필 저장 (향후 구현)
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      // TODO: 프로필 업데이트 API 구현
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 딜레이
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 포맷 함수
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-blue-600" />
          설정
        </h1>
        <p className="mt-1 text-neutral-500">계정 정보와 사용량을 확인하세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'text-blue-600 border-blue-600'
              : 'text-neutral-600 border-transparent hover:text-neutral-900'
          }`}
        >
          <User className="w-4 h-4" />
          프로필
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'usage'
              ? 'text-blue-600 border-blue-600'
              : 'text-neutral-600 border-transparent hover:text-neutral-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          사용량
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 프로필 정보 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              프로필 정보
            </h2>

            <div className="space-y-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 이메일 (읽기 전용) */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={client?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-neutral-50 text-neutral-500"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  이메일은 변경할 수 없습니다
                </p>
              </div>

              {/* 웹사이트 URL */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  웹사이트 URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  콘텐츠가 게시될 웹사이트 주소입니다
                </p>
              </div>

              {/* 저장 버튼 */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    저장 중...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    저장됨
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 계정 정보 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-semibold text-neutral-900 mb-4">계정 정보</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-600">계정 ID</span>
                <span className="text-sm font-mono text-neutral-800">
                  {client?.id?.slice(0, 8)}...
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-600">플랜</span>
                <span className="text-sm font-medium text-blue-600">
                  Content Studio Pro
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-600">가입일</span>
                <span className="text-sm text-neutral-800">
                  {new Date().toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>

            {/* 도움말 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                도움이 필요하신가요?
              </h3>
              <p className="text-sm text-blue-700">
                Content Studio 사용에 관한 질문은{' '}
                <a
                  href="mailto:support@polarad.co.kr"
                  className="underline hover:text-blue-900"
                >
                  support@polarad.co.kr
                </a>
                로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 이번 달 사용량 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                이번 달 사용량
              </h2>
              <span className="text-sm text-neutral-500">
                {usageSummary?.yearMonth || new Date().toISOString().slice(0, 7)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 주제 생성 */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(usageSummary?.topicCount || 0)}
                </p>
                <p className="text-sm text-neutral-600">주제 생성</p>
              </div>

              {/* 콘텐츠 생성 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(usageSummary?.contentCount || 0)}
                </p>
                <p className="text-sm text-neutral-600">콘텐츠 생성</p>
              </div>

              {/* 웹 게시 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatNumber(usageSummary?.publishCount || 0)}
                </p>
                <p className="text-sm text-neutral-600">웹 게시</p>
              </div>

              {/* 토큰 사용량 */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatTokens(usageSummary?.totalTokens || 0)}
                </p>
                <p className="text-sm text-neutral-600">AI 토큰</p>
              </div>
            </div>
          </div>

          {/* 사용량 안내 */}
          <div className="bg-neutral-50 rounded-xl p-6">
            <h3 className="font-medium text-neutral-900 mb-3">사용량 안내</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>주제 생성</strong>: AI가 키워드 기반으로 블로그 주제를
                  제안할 때마다 1회로 집계됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>콘텐츠 생성</strong>: AI가 블로그 글 본문을 작성할
                  때마다 1회로 집계됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>웹 게시</strong>: 작성한 콘텐츠를 마케팅소식에 게시할
                  때마다 1회로 집계됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>AI 토큰</strong>: Gemini AI 호출 시 사용된 토큰 수를
                  합산합니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

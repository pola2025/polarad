'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Lightbulb,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  FileText,
} from 'lucide-react';
import type { ContentCategory, TopicStatus } from '@/lib/content-studio/types';

interface Topic {
  id: string;
  clientId: string;
  title: string;
  category: ContentCategory;
  status: TopicStatus;
  createdAt: string;
}

const CATEGORIES: { value: ContentCategory; label: string }[] = [
  { value: 'meta-ads', label: 'Meta 광고' },
  { value: 'instagram-reels', label: '인스타그램 릴스' },
  { value: 'threads', label: '쓰레드' },
  { value: 'google-ads', label: 'Google 광고' },
  { value: 'marketing-trends', label: '마케팅 트렌드' },
  { value: 'ai-trends', label: 'AI 트렌드' },
  { value: 'ai-tips', label: 'AI 활용 팁' },
  { value: 'faq', label: 'FAQ' },
];

const STATUS_LABELS: Record<TopicStatus, { label: string; color: string }> = {
  pending: { label: '대기', color: 'bg-yellow-100 text-yellow-800' },
  used: { label: '사용됨', color: 'bg-green-100 text-green-800' },
  archived: { label: '보관', color: 'bg-gray-100 text-gray-800' },
};

export default function TopicsPage() {
  // 상태
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // 생성 폼
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<ContentCategory>('meta-ads');
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

  // 필터
  const [filterStatus, setFilterStatus] = useState<TopicStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 주제 목록 로드
  const loadTopics = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.set('status', filterStatus);
      }

      const res = await fetch(`/api/content-studio/topics?${params}`);
      const data = await res.json();

      if (data.success) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error('Failed to load topics:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  // AI 주제 생성
  const handleGenerate = async () => {
    if (!keyword.trim()) return;

    setGenerating(true);
    setSuggestedTopics([]);
    setSelectedTopics(new Set());

    try {
      const res = await fetch('/api/content-studio/topics/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category, count: 10 }),
      });

      const data = await res.json();

      if (data.success) {
        setSuggestedTopics(data.topics);
      } else {
        alert(data.error || '주제 생성에 실패했습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  // 선택된 주제 저장
  const handleSave = async () => {
    if (selectedTopics.size === 0) return;

    setSaving(true);

    try {
      const res = await fetch('/api/content-studio/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titles: Array.from(selectedTopics),
          category,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // 초기화 및 새로고침
        setSuggestedTopics([]);
        setSelectedTopics(new Set());
        setKeyword('');
        loadTopics();
      } else {
        alert(data.error || '저장에 실패했습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 주제 삭제
  const handleDelete = async (topicId: string) => {
    if (!confirm('이 주제를 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/content-studio/topics?id=${topicId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        loadTopics();
      } else {
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    }
  };

  // 체크박스 토글
  const toggleTopic = (topic: string) => {
    const newSelected = new Set(selectedTopics);
    if (newSelected.has(topic)) {
      newSelected.delete(topic);
    } else {
      newSelected.add(topic);
    }
    setSelectedTopics(newSelected);
  };

  // 전체 선택/해제
  const toggleAll = () => {
    if (selectedTopics.size === suggestedTopics.length) {
      setSelectedTopics(new Set());
    } else {
      setSelectedTopics(new Set(suggestedTopics));
    }
  };

  // 필터링된 주제
  const filteredTopics = topics.filter((topic) => {
    if (searchQuery && !topic.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">주제 관리</h1>
        <p className="mt-1 text-neutral-500">
          AI로 콘텐츠 주제를 생성하고 관리하세요
        </p>
      </div>

      {/* 주제 생성 카드 */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          AI 주제 생성
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* 키워드 입력 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              키워드
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 인스타그램 광고 비용, 메타 계정 정지"
              className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          {/* 카테고리 선택 */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              카테고리
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ContentCategory)}
                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={generating || !keyword.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              주제 생성
            </>
          )}
        </button>

        {/* AI 생성 결과 */}
        {suggestedTopics.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-neutral-900">
                생성된 주제 ({suggestedTopics.length}개)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedTopics.size === suggestedTopics.length ? '전체 해제' : '전체 선택'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || selectedTopics.size === 0}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {selectedTopics.size}개 저장
                </button>
              </div>
            </div>

            <ul className="space-y-2">
              {suggestedTopics.map((topic, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTopics.has(topic)
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                  }`}
                  onClick={() => toggleTopic(topic)}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedTopics.has(topic)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-neutral-300'
                    }`}
                  >
                    {selectedTopics.has(topic) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-neutral-800">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 저장된 주제 목록 */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            저장된 주제
          </h2>

          {/* 필터 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색..."
                className="pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-48"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TopicStatus | 'all')}
                className="pl-9 pr-8 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="all">전체</option>
                <option value="pending">대기</option>
                <option value="used">사용됨</option>
                <option value="archived">보관</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    주제
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 w-32">
                    카테고리
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 w-24">
                    상태
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500 w-32">
                    생성일
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-500 w-24">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic) => (
                  <tr key={topic.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <span className="text-sm text-neutral-900">{topic.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                        {CATEGORIES.find((c) => c.value === topic.category)?.label || topic.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${STATUS_LABELS[topic.status].color}`}
                      >
                        {STATUS_LABELS[topic.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-neutral-500">
                        {new Date(topic.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {topic.status === 'pending' && (
                          <a
                            href={`/content-studio/blog?topic=${topic.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="글 작성"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(topic.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">저장된 주제가 없습니다</p>
            <p className="text-sm text-neutral-400 mt-1">
              위에서 AI로 주제를 생성해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

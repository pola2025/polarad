'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Sparkles,
  Save,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  Eye,
  Edit3,
  Clock,
  Trash2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type {
  ContentCategory,
  ToneType,
  ContentLength,
  ContentStatus,
} from '@/lib/content-studio/types';

interface Topic {
  id: string;
  title: string;
  category: ContentCategory;
  status: string;
}

interface Content {
  id: string;
  title: string;
  content: string;
  plainText: string;
  description?: string;
  category: ContentCategory;
  tags: string;
  status: ContentStatus;
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

const TONES: { value: ToneType; label: string; desc: string }[] = [
  { value: 'professional', label: '전문적', desc: '신뢰감 있는 정보 중심' },
  { value: 'friendly', label: '친근함', desc: '편안한 대화체' },
  { value: 'casual', label: '캐주얼', desc: '가벼운 톤, 이모지 포함' },
];

const LENGTHS: { value: ContentLength; label: string }[] = [
  { value: 1000, label: '1,000자 (짧은 글)' },
  { value: 1500, label: '1,500자 (기본)' },
  { value: 2000, label: '2,000자 (긴 글)' },
];

export default function BlogPage() {
  const searchParams = useSearchParams();
  const topicIdParam = searchParams.get('topic');
  const editIdParam = searchParams.get('edit');

  // 상태
  const [topics, setTopics] = useState<Topic[]>([]);
  const [drafts, setDrafts] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<'content' | 'naver' | null>(null);

  // 폼 상태
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  const [category, setCategory] = useState<ContentCategory>('meta-ads');
  const [tone, setTone] = useState<ToneType>('professional');
  const [length, setLength] = useState<ContentLength>(1500);

  // 생성된 콘텐츠
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    plainText: string;
    description: string;
    tags: string[];
    seoKeywords: string[];
  } | null>(null);

  // 편집 모드
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);

  // 미리보기 모드
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'naver'>('edit');

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      const [topicsRes, draftsRes] = await Promise.all([
        fetch('/api/content-studio/topics?status=pending'),
        fetch('/api/content-studio/contents?status=draft'),
      ]);

      const topicsData = await topicsRes.json();
      const draftsData = await draftsRes.json();

      if (topicsData.success) {
        setTopics(topicsData.topics);
      }
      if (draftsData.success) {
        setDrafts(draftsData.contents);
      }

      // URL 파라미터 처리
      if (topicIdParam && topicsData.topics) {
        const topic = topicsData.topics.find((t: Topic) => t.id === topicIdParam);
        if (topic) {
          setSelectedTopicId(topicIdParam);
          setCategory(topic.category);
        }
      }

      if (editIdParam && draftsData.contents) {
        const content = draftsData.contents.find((c: Content) => c.id === editIdParam);
        if (content) {
          loadContent(content);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [topicIdParam, editIdParam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 콘텐츠 로드 (편집용)
  const loadContent = (content: Content) => {
    setCurrentContentId(content.id);
    setEditTitle(content.title);
    setEditContent(content.content);
    setCategory(content.category);
    setEditMode(true);
    setGeneratedContent(null);
  };

  // AI 콘텐츠 생성
  const handleGenerate = async () => {
    const topic = selectedTopicId
      ? topics.find((t) => t.id === selectedTopicId)?.title
      : customTopic;

    if (!topic?.trim()) {
      alert('주제를 선택하거나 입력해주세요.');
      return;
    }

    setGenerating(true);
    setGeneratedContent(null);
    setEditMode(false);

    try {
      const res = await fetch('/api/content-studio/generate/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          category,
          tone,
          length,
          topicId: selectedTopicId || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedContent(data.content);
        setEditTitle(data.content.title);
        setEditContent(data.content.content);
        setPreviewMode('preview');
      } else {
        alert(data.error || '콘텐츠 생성에 실패했습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  // 초안 저장
  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setSaving(true);

    try {
      const plainText = markdownToPlainText(editContent);

      const body = {
        ...(currentContentId && { id: currentContentId }),
        title: editTitle,
        content: editContent,
        plainText,
        description: generatedContent?.description || '',
        category,
        tags: generatedContent?.tags?.join(', ') || '',
        seoKeywords: generatedContent?.seoKeywords?.join(', ') || '',
      };

      const res = await fetch('/api/content-studio/contents', {
        method: currentContentId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        alert('저장되었습니다.');
        if (!currentContentId && data.contentId) {
          setCurrentContentId(data.contentId);
        }
        loadData();
      } else {
        alert(data.error || '저장에 실패했습니다.');
      }
    } catch {
      alert('서버 연결에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // 클립보드 복사
  const handleCopy = async (type: 'content' | 'naver') => {
    const text = type === 'content' ? editContent : markdownToPlainText(editContent);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert('복사에 실패했습니다.');
    }
  };

  // 마크다운 → 플레인텍스트
  function markdownToPlainText(markdown: string): string {
    return markdown
      .replace(/^### (.+)$/gm, '\n■ $1\n')
      .replace(/^## (.+)$/gm, '\n▶ $1\n')
      .replace(/^# (.+)$/gm, '\n【$1】\n')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
      .replace(/^- /gm, '• ')
      .replace(/^\d+\. /gm, '→ ')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // 새 글 작성
  const handleNew = () => {
    setSelectedTopicId('');
    setCustomTopic('');
    setGeneratedContent(null);
    setEditTitle('');
    setEditContent('');
    setCurrentContentId(null);
    setEditMode(false);
    setPreviewMode('edit');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">블로그 콘텐츠</h1>
          <p className="mt-1 text-neutral-500">AI로 블로그 글을 작성하세요</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          + 새 글 작성
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 설정 패널 */}
        <div className="space-y-4">
          {/* 생성 설정 */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              콘텐츠 설정
            </h2>

            <div className="space-y-4">
              {/* 주제 선택 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  저장된 주제
                </label>
                <div className="relative">
                  <select
                    value={selectedTopicId}
                    onChange={(e) => {
                      setSelectedTopicId(e.target.value);
                      if (e.target.value) {
                        const topic = topics.find((t) => t.id === e.target.value);
                        if (topic) setCategory(topic.category);
                        setCustomTopic('');
                      }
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm appearance-none bg-white"
                  >
                    <option value="">직접 입력</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* 직접 입력 */}
              {!selectedTopicId && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    주제 직접 입력
                  </label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="예: 인스타그램 광고 비용 절감 방법"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              )}

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  카테고리
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ContentCategory)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm appearance-none bg-white"
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

              {/* 톤앤매너 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  톤앤매너
                </label>
                <div className="space-y-2">
                  {TONES.map((t) => (
                    <label
                      key={t.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        tone === t.value
                          ? 'bg-blue-50 border-blue-300'
                          : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={t.value}
                        checked={tone === t.value}
                        onChange={(e) => setTone(e.target.value as ToneType)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          tone === t.value ? 'border-blue-600' : 'border-neutral-300'
                        }`}
                      >
                        {tone === t.value && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{t.label}</p>
                        <p className="text-xs text-neutral-500">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 분량 */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  분량
                </label>
                <div className="relative">
                  <select
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value) as ContentLength)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm appearance-none bg-white"
                  >
                    {LENGTHS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* 생성 버튼 */}
              <button
                onClick={handleGenerate}
                disabled={generating || (!selectedTopicId && !customTopic.trim())}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    AI 콘텐츠 생성
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 작성 중인 초안 */}
          {drafts.length > 0 && (
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h2 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                작성 중인 초안
              </h2>
              <ul className="space-y-2">
                {drafts.slice(0, 5).map((draft) => (
                  <li
                    key={draft.id}
                    className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded-lg cursor-pointer"
                    onClick={() => loadContent(draft)}
                  >
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-700 truncate flex-1">
                      {draft.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 오른쪽: 에디터 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* 에디터 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('edit')}
                  className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 ${
                    previewMode === 'edit'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  편집
                </button>
                <button
                  onClick={() => setPreviewMode('preview')}
                  className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 ${
                    previewMode === 'preview'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  미리보기
                </button>
                <button
                  onClick={() => setPreviewMode('naver')}
                  className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 ${
                    previewMode === 'naver'
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  네이버용
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy('naver')}
                  className="px-3 py-1.5 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg flex items-center gap-1.5"
                >
                  {copied === 'naver' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  네이버용 복사
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editContent.trim()}
                  className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  저장
                </button>
              </div>
            </div>

            {/* 제목 입력 */}
            <div className="px-5 py-3 border-b border-neutral-100">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full text-xl font-bold text-neutral-900 placeholder:text-neutral-400 outline-none"
              />
            </div>

            {/* 에디터 본문 */}
            <div className="min-h-[500px]">
              {previewMode === 'edit' ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="내용을 입력하세요... (마크다운 지원)"
                  className="w-full h-[500px] px-5 py-4 text-neutral-800 placeholder:text-neutral-400 outline-none resize-none font-mono text-sm"
                />
              ) : previewMode === 'preview' ? (
                <div className="px-5 py-4 prose prose-neutral max-w-none">
                  <ReactMarkdown>{editContent || '*내용이 없습니다*'}</ReactMarkdown>
                </div>
              ) : (
                <div className="px-5 py-4">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      네이버 블로그용 텍스트
                    </p>
                    <p className="text-xs text-green-600">
                      아래 내용을 복사해서 네이버 블로그에 붙여넣으세요
                    </p>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-neutral-800 font-sans">
                    {editTitle && `【${editTitle}】\n\n`}
                    {markdownToPlainText(editContent) || '내용이 없습니다'}
                  </pre>
                </div>
              )}
            </div>

            {/* 태그/키워드 표시 */}
            {generatedContent && (generatedContent.tags.length > 0 || generatedContent.seoKeywords.length > 0) && (
              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
                <div className="flex flex-wrap gap-2">
                  {generatedContent.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {generatedContent.seoKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-neutral-200 text-neutral-600 text-xs rounded"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

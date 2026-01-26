'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Globe,
  FileText,
  Loader2,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ContentCategory, ContentStatus } from '@/lib/content-studio/types';

interface Content {
  id: string;
  title: string;
  content: string;
  plainText: string;
  description?: string;
  category: ContentCategory;
  tags: string;
  seoKeywords?: string;
  status: ContentStatus;
  publishedUrl?: string;
  thumbnailUrl?: string;
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
  { value: 'ai-news', label: 'AI 뉴스' },
  { value: 'faq', label: 'FAQ' },
];

export default function WebPublishPage() {
  // 상태
  const [drafts, setDrafts] = useState<Content[]>([]);
  const [published, setPublished] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [generateThumbnail, setGenerateThumbnail] = useState(true);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    url?: string;
    error?: string;
  } | null>(null);

  // 탭 상태
  const [activeTab, setActiveTab] = useState<'draft' | 'published'>('draft');

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      const [draftsRes, publishedRes] = await Promise.all([
        fetch('/api/content-studio/contents?status=draft'),
        fetch('/api/content-studio/contents?status=published'),
      ]);

      const draftsData = await draftsRes.json();
      const publishedData = await publishedRes.json();

      if (draftsData.success) {
        setDrafts(draftsData.contents);
      }
      if (publishedData.success) {
        setPublished(publishedData.contents);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 게시 처리
  const handlePublish = async () => {
    if (!selectedContent) return;

    setPublishing(true);
    setPublishResult(null);

    try {
      const res = await fetch('/api/content-studio/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: selectedContent.id,
          generateThumbnailFlag: generateThumbnail,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPublishResult({
          success: true,
          url: data.publishedUrl,
        });
        // 목록 새로고침
        loadData();
        setSelectedContent(null);
      } else {
        setPublishResult({
          success: false,
          error: data.error || '게시에 실패했습니다.',
        });
      }
    } catch {
      setPublishResult({
        success: false,
        error: '서버 연결에 실패했습니다.',
      });
    } finally {
      setPublishing(false);
    }
  };

  // 카테고리 라벨 찾기
  const getCategoryLabel = (category: ContentCategory) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  // 날짜 포맷
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
          <Globe className="w-7 h-7 text-blue-600" />
          웹페이지 게시
        </h1>
        <p className="mt-1 text-neutral-500">
          작성한 콘텐츠를 마케팅소식 웹페이지에 게시합니다
        </p>
      </div>

      {/* 게시 성공 알림 */}
      {publishResult?.success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-green-800">게시가 완료되었습니다!</p>
            <p className="text-sm text-green-700 mt-1">
              아래 링크에서 게시된 글을 확인할 수 있습니다.
            </p>
            <a
              href={publishResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-green-700 hover:text-green-800 underline"
            >
              {publishResult.url}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <button
            onClick={() => setPublishResult(null)}
            className="text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* 게시 실패 알림 */}
      {publishResult && !publishResult.success && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-800">게시에 실패했습니다</p>
            <p className="text-sm text-red-700 mt-1">{publishResult.error}</p>
          </div>
          <button
            onClick={() => setPublishResult(null)}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: 콘텐츠 목록 */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* 탭 */}
          <div className="flex border-b border-neutral-200">
            <button
              onClick={() => setActiveTab('draft')}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === 'draft'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              게시 대기 ({drafts.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                activeTab === 'published'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Check className="w-4 h-4" />
              게시 완료 ({published.length})
            </button>
          </div>

          {/* 목록 */}
          <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
            {activeTab === 'draft' ? (
              drafts.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <FileText className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                  <p>게시할 초안이 없습니다</p>
                  <p className="text-sm mt-1">
                    블로그 콘텐츠에서 글을 작성해주세요
                  </p>
                </div>
              ) : (
                drafts.map((content) => (
                  <div
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedContent?.id === content.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <h3 className="font-medium text-neutral-900 line-clamp-1">
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                      <span className="px-2 py-0.5 bg-neutral-100 rounded text-xs">
                        {getCategoryLabel(content.category)}
                      </span>
                      <span>{formatDate(content.createdAt)}</span>
                    </div>
                  </div>
                ))
              )
            ) : published.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <Globe className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
                <p>게시된 콘텐츠가 없습니다</p>
              </div>
            ) : (
              published.map((content) => (
                <div
                  key={content.id}
                  className="p-4 hover:bg-neutral-50"
                >
                  <h3 className="font-medium text-neutral-900 line-clamp-1">
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                      게시됨
                    </span>
                    <span>{getCategoryLabel(content.category)}</span>
                  </div>
                  {content.publishedUrl && (
                    <a
                      href={content.publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
                    >
                      {content.publishedUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 오른쪽: 미리보기 & 게시 설정 */}
        <div className="space-y-4">
          {selectedContent ? (
            <>
              {/* 미리보기 */}
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="px-5 py-3 border-b border-neutral-200 bg-neutral-50 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-neutral-600" />
                  <span className="font-medium text-neutral-900">미리보기</span>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-neutral-900 mb-3">
                    {selectedContent.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {getCategoryLabel(selectedContent.category)}
                    </span>
                    {selectedContent.tags && (
                      <>
                        {selectedContent.tags.split(',').slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="prose prose-sm prose-neutral max-w-none max-h-[300px] overflow-y-auto">
                    <ReactMarkdown>
                      {selectedContent.content.slice(0, 1000) +
                        (selectedContent.content.length > 1000 ? '...' : '')}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* 게시 설정 */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  게시 설정
                </h3>

                <div className="space-y-4">
                  {/* 썸네일 생성 옵션 */}
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={generateThumbnail}
                      onChange={(e) => setGenerateThumbnail(e.target.checked)}
                      className="w-5 h-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-neutral-600" />
                        <span className="font-medium text-neutral-900">
                          AI 썸네일 자동 생성
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        Gemini를 사용하여 글에 맞는 썸네일 이미지를 자동 생성합니다
                      </p>
                    </div>
                  </label>

                  {/* 게시 정보 */}
                  <div className="p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
                    <p>• 게시 위치: 마케팅소식 웹페이지</p>
                    <p>• 카테고리: {getCategoryLabel(selectedContent.category)}</p>
                    <p>• 작성자: 폴라애드</p>
                  </div>

                  {/* 게시 버튼 */}
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        게시 중...
                      </>
                    ) : (
                      <>
                        <Globe className="w-5 h-5" />
                        웹페이지에 게시
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
              <Globe className="w-16 h-16 mx-auto text-neutral-200 mb-4" />
              <h3 className="text-lg font-medium text-neutral-700">
                게시할 콘텐츠를 선택하세요
              </h3>
              <p className="text-sm text-neutral-500 mt-2">
                왼쪽 목록에서 게시 대기 중인 콘텐츠를 선택하면
                <br />
                미리보기와 게시 옵션을 설정할 수 있습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

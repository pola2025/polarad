/**
 * Content Studio 타입 정의
 */

// 클라이언트 상태
export type ClientStatus = 'active' | 'suspended';

// 주제 상태
export type TopicStatus = 'pending' | 'used' | 'archived';

// 콘텐츠 상태
export type ContentStatus = 'draft' | 'published';

// 사용량 액션
export type UsageAction = 'topic_suggest' | 'content_generate' | 'publish';

// 카테고리 (기존 마케팅소식과 동일)
export type ContentCategory =
  | 'meta-ads'
  | 'instagram-reels'
  | 'threads'
  | 'google-ads'
  | 'marketing-trends'
  | 'ai-trends'
  | 'ai-tips'
  | 'ai-news'
  | 'faq';

// 톤앤매너
export type ToneType = 'professional' | 'friendly' | 'casual';

// 분량 (자수)
export type ContentLength = 1000 | 1500 | 2000;

// ============================================
// Airtable 레코드 타입
// ============================================

export interface AirtableClient {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  websiteUrl?: string;
  airtableBaseId?: string;
  status: ClientStatus;
  createdAt: string;
}

export interface AirtableClientTopic {
  id?: string;
  clientId: string;
  title: string;
  category: ContentCategory;
  status: TopicStatus;
  createdAt: string;
}

export interface AirtableClientContent {
  id?: string;
  clientId: string;
  topicId?: string;
  title: string;
  content: string;         // 마크다운
  plainText: string;       // 네이버용
  htmlContent?: string;    // 웹페이지용
  description?: string;    // 메타 설명
  category: ContentCategory;
  tags: string;            // 쉼표 구분
  seoKeywords?: string;
  status: ContentStatus;
  publishedUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface AirtableUsageLog {
  id?: string;
  clientId: string;
  action: UsageAction;
  tokensUsed: number;
  model: string;
  createdAt: string;
}

export interface AirtableUsageSummary {
  id?: string;
  clientId: string;
  yearMonth: string;       // 2026-01
  topicCount: number;
  contentCount: number;
  publishCount: number;
  totalTokens: number;
}

// ============================================
// API 요청/응답 타입
// ============================================

// 로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  client?: {
    id: string;
    name: string;
    email: string;
    websiteUrl?: string;
  };
  error?: string;
}

// JWT 페이로드
export interface JWTPayload {
  clientId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// 주제 제안
export interface TopicSuggestRequest {
  keyword: string;
  category: ContentCategory;
  count?: number;  // 기본 10
}

export interface TopicSuggestResponse {
  success: boolean;
  topics?: string[];
  error?: string;
}

// 주제 저장
export interface TopicSaveRequest {
  titles: string[];
  category: ContentCategory;
}

export interface TopicSaveResponse {
  success: boolean;
  savedCount?: number;
  error?: string;
}

// 콘텐츠 생성
export interface ContentGenerateRequest {
  topic: string;           // 주제 또는 직접 입력
  category: ContentCategory;
  tone: ToneType;
  length: ContentLength;
  topicId?: string;        // 저장된 주제 ID (있으면)
}

export interface ContentGenerateResponse {
  success: boolean;
  content?: {
    title: string;
    content: string;       // 마크다운
    plainText: string;     // 네이버용
    description: string;
    tags: string[];
    seoKeywords: string[];
  };
  tokensUsed?: number;
  error?: string;
}

// 게시
export interface PublishRequest {
  contentId: string;
  category: ContentCategory;
  tags: string[];
  generateThumbnail?: boolean;
}

export interface PublishResponse {
  success: boolean;
  publishedUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

// 대시보드 통계
export interface DashboardStats {
  pendingTopics: number;
  draftContents: number;
  publishedContents: number;
  monthlyUsage: {
    topicCount: number;
    contentCount: number;
    publishCount: number;
  };
}

// ============================================
// UI 컴포넌트 타입
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

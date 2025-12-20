'use client';

import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';
import { ComparisonChart, BarChart, StatCards } from './Chart';

interface MarkdownContentProps {
  content: string;
}

/**
 * 커스텀 컴포넌트 태그 파싱 및 렌더링
 * <ComparisonChart>, <BarChart>, <StatCards> 등을 실제 컴포넌트로 변환
 */
function parseCustomComponents(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let keyIndex = 0;

  // 커스텀 컴포넌트 패턴 (self-closing 또는 일반 태그)
  const componentPattern = /<(ComparisonChart|BarChart|StatCards)\s*([\s\S]*?)\/>/g;

  let lastIndex = 0;
  let match;

  while ((match = componentPattern.exec(content)) !== null) {
    // 컴포넌트 이전의 마크다운 텍스트
    if (match.index > lastIndex) {
      const markdownText = content.slice(lastIndex, match.index);
      if (markdownText.trim()) {
        parts.push(
          <MarkdownRenderer key={`md-${keyIndex++}`} content={markdownText} />
        );
      }
    }

    // 컴포넌트 파싱
    const componentName = match[1];
    const propsString = match[2];

    try {
      const props = parseProps(propsString);

      if (componentName === 'ComparisonChart') {
        parts.push(
          <ComparisonChart
            key={`chart-${keyIndex++}`}
            title={(props.title as string) || ''}
            data={props.data as { label: string; before: number | string; after: number | string; change: string }[]}
            beforeLabel={props.beforeLabel as string}
            afterLabel={props.afterLabel as string}
          />
        );
      } else if (componentName === 'BarChart') {
        parts.push(
          <BarChart
            key={`bar-${keyIndex++}`}
            title={(props.title as string) || ''}
            data={props.data as { label: string; value: number; maxValue?: number }[]}
            unit={props.unit as string}
            color={props.color as 'primary' | 'green' | 'orange'}
          />
        );
      } else if (componentName === 'StatCards') {
        parts.push(
          <StatCards
            key={`stat-${keyIndex++}`}
            stats={props.stats as { label: string; value: string; change?: string; icon?: string }[]}
          />
        );
      }
    } catch (e) {
      console.error('Failed to parse component:', componentName, e);
    }

    lastIndex = match.index + match[0].length;
  }

  // 남은 마크다운 텍스트
  if (lastIndex < content.length) {
    const markdownText = content.slice(lastIndex);
    if (markdownText.trim()) {
      parts.push(
        <MarkdownRenderer key={`md-${keyIndex++}`} content={markdownText} />
      );
    }
  }

  return parts.length > 0 ? parts : [<MarkdownRenderer key="md-0" content={content} />];
}

/**
 * Props 문자열을 객체로 파싱
 * 예: title="제목" data={[...]} → { title: "제목", data: [...] }
 */
function parseProps(propsString: string): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  // title="..." 패턴
  const stringPropPattern = /(\w+)="([^"]*)"/g;
  let stringMatch;
  while ((stringMatch = stringPropPattern.exec(propsString)) !== null) {
    props[stringMatch[1]] = stringMatch[2];
  }

  // data={...} 패턴 (JSON 배열)
  const jsonPropPattern = /(\w+)=\{(\[[\s\S]*?\])\}/g;
  let jsonMatch;
  while ((jsonMatch = jsonPropPattern.exec(propsString)) !== null) {
    try {
      // JSX 스타일 객체를 JSON으로 변환
      let jsonStr = jsonMatch[2]
        .replace(/(\w+):/g, '"$1":')  // key: → "key":
        .replace(/'/g, '"')           // ' → "
        .replace(/,\s*}/g, '}')       // trailing comma 제거
        .replace(/,\s*]/g, ']');      // trailing comma 제거

      props[jsonMatch[1]] = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse JSON prop:', jsonMatch[1], e);
    }
  }

  return props;
}

/**
 * 마크다운 렌더러 컴포넌트
 */
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}

// 마크다운 컴포넌트 설정
const markdownComponents: Components = {
  // 헤딩
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h4>
  ),

  // 문단
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  ),

  // 링크
  a: ({ href, children }) => (
    <Link
      href={href || '#'}
      className="text-primary hover:underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </Link>
  ),

  // 이미지
  img: ({ src, alt }) => {
    const imgSrc = typeof src === 'string' ? src : '';
    if (!imgSrc) return null;

    return (
      <span className="block my-6">
        <Image
          src={imgSrc}
          alt={alt || ''}
          width={800}
          height={450}
          className="rounded-lg w-full h-auto"
        />
        {alt && (
          <span className="block text-center text-sm text-gray-500 mt-2">{alt}</span>
        )}
      </span>
    );
  },

  // 리스트
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),

  // 인용
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 bg-gray-50 rounded-r-lg">
      <div className="text-gray-700 italic">{children}</div>
    </blockquote>
  ),

  // 코드
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-gray-100 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
      {children}
    </pre>
  ),

  // 테이블
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-200 px-4 py-2 text-gray-700">{children}</td>
  ),

  // 수평선
  hr: () => <hr className="my-8 border-gray-200" />,

  // 강조
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),
};

/**
 * Airtable에서 가져온 마크다운 콘텐츠 렌더링
 * 커스텀 차트 컴포넌트 지원
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return <>{parseCustomComponents(content)}</>;
}

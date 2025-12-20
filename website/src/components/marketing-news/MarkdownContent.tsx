'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';

interface MarkdownContentProps {
  content: string;
}

/**
 * Airtable에서 가져온 마크다운 콘텐츠 렌더링
 * article-content 클래스의 기존 스타일을 그대로 활용
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
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
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

import Link from 'next/link';
import {
  requireAuth,
  getDashboardStats,
  getTopicsByClient,
  getContentsByClient,
} from '@/lib/content-studio';
import {
  Lightbulb,
  FileText,
  Globe,
  TrendingUp,
  ArrowRight,
  Clock,
} from 'lucide-react';

export default async function DashboardPage() {
  const { client } = await requireAuth();
  const stats = await getDashboardStats(client.id);
  const recentTopics = await getTopicsByClient(client.id, 'pending');
  const recentDrafts = await getContentsByClient(client.id, 'draft');

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          안녕하세요, {client.name}님
        </h1>
        <p className="mt-1 text-neutral-500">
          오늘도 멋진 콘텐츠를 만들어보세요!
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="대기 중인 주제"
          value={stats.pendingTopics}
          icon={Lightbulb}
          color="blue"
          href="/content-studio/topics"
        />
        <StatCard
          title="작성 중인 콘텐츠"
          value={stats.draftContents}
          icon={FileText}
          color="amber"
          href="/content-studio/blog"
        />
        <StatCard
          title="게시된 콘텐츠"
          value={stats.publishedContents}
          icon={Globe}
          color="green"
          href="/content-studio/web"
        />
        <StatCard
          title="이번 달 사용량"
          value={stats.monthlyUsage.contentCount}
          icon={TrendingUp}
          color="purple"
          suffix="건"
        />
      </div>

      {/* 빠른 작업 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 대기 중인 주제 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              대기 중인 주제
            </h2>
            <Link
              href="/content-studio/topics"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentTopics.length > 0 ? (
            <ul className="space-y-3">
              {recentTopics.slice(0, 5).map((topic) => (
                <li
                  key={topic.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                >
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate">
                      {topic.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(topic.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <Link
                    href={`/content-studio/blog?topic=${topic.id}`}
                    className="text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    글 작성
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Lightbulb}
              message="대기 중인 주제가 없습니다"
              action={{
                label: '주제 생성하기',
                href: '/content-studio/topics',
              }}
            />
          )}
        </div>

        {/* 작성 중인 콘텐츠 */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              작성 중인 콘텐츠
            </h2>
            <Link
              href="/content-studio/blog"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentDrafts.length > 0 ? (
            <ul className="space-y-3">
              {recentDrafts.slice(0, 5).map((content) => (
                <li
                  key={content.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate">
                      {content.title}
                    </p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(content.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <Link
                    href={`/content-studio/blog?edit=${content.id}`}
                    className="text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    이어서 작성
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={FileText}
              message="작성 중인 콘텐츠가 없습니다"
              action={{
                label: '새 콘텐츠 작성',
                href: '/content-studio/blog',
              }}
            />
          )}
        </div>
      </div>

      {/* 월별 사용량 */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          이번 달 활동
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {stats.monthlyUsage.topicCount}
            </p>
            <p className="text-sm text-neutral-500 mt-1">주제 생성</p>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <p className="text-3xl font-bold text-amber-600">
              {stats.monthlyUsage.contentCount}
            </p>
            <p className="text-sm text-neutral-500 mt-1">콘텐츠 생성</p>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {stats.monthlyUsage.publishCount}
            </p>
            <p className="text-sm text-neutral-500 mt-1">게시 완료</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  suffix = '',
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'green' | 'purple';
  href?: string;
  suffix?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const content = (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-900">
            {value}
            {suffix && <span className="text-base font-normal ml-1">{suffix}</span>}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// 빈 상태 컴포넌트
function EmptyState({
  icon: Icon,
  message,
  action,
}: {
  icon: React.ElementType;
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-8">
      <Icon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
      <p className="text-sm text-neutral-500 mb-4">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action.label}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

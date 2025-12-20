'use client';

interface ComparisonChartProps {
  title: string;
  data?: {
    label: string;
    before: number | string;
    after: number | string;
    change: string;
  }[];
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonChart({
  title,
  data,
  beforeLabel = 'Before',
  afterLabel = 'After'
}: ComparisonChartProps) {
  // 방어적 코딩: data가 없거나 배열이 아니면 렌더링하지 않음
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <div className="my-8 p-6 bg-gray-50 rounded-2xl">
      <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">{title}</h4>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-800">{item.label}</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                item.change.startsWith('+')
                  ? 'bg-green-100 text-green-700'
                  : item.change.startsWith('-')
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
              }`}>
                {item.change}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">{beforeLabel}</div>
                <div className="text-lg font-bold text-gray-600">{item.before}</div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">{afterLabel}</div>
                <div className="text-lg font-bold text-primary">{item.after}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface BarChartProps {
  title: string;
  data?: {
    label: string;
    value: number;
    maxValue?: number;
  }[];
  unit?: string;
  color?: 'primary' | 'green' | 'orange';
}

export function BarChart({ title, data, unit = '', color = 'primary' }: BarChartProps) {
  // 방어적 코딩: data가 없거나 배열이 아니면 렌더링하지 않음
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map(d => d.maxValue || d.value));

  const colorClasses = {
    primary: 'bg-primary',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="my-8 p-6 bg-gray-50 rounded-2xl">
      <h4 className="text-lg font-bold text-gray-900 mb-6 text-center">{title}</h4>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-bold text-gray-900">{item.value}{unit}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  stats?: {
    label: string;
    value: string;
    change?: string;
    icon?: string;
  }[];
}

export function StatCards({ stats }: StatCardProps) {
  // 방어적 코딩: stats가 없거나 배열이 아니면 렌더링하지 않음
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  return (
    <div className="my-8 grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          {stat.icon && <div className="text-2xl mb-2">{stat.icon}</div>}
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-500">{stat.label}</div>
          {stat.change && (
            <div className={`text-xs font-medium mt-2 ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'
            }`}>
              {stat.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

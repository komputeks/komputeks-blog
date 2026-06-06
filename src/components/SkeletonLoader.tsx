import { useTheme } from '../contexts/ThemeContext';

export default function SkeletonLoader({ count = 3, type = 'card' }: { count?: number; type?: 'card' | 'line' | 'hero' }) {
  const { theme } = useTheme();
  const bg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const shimmer = 'animate-pulse';

  if (type === 'hero') {
    return (
      <div className={`rounded-2xl overflow-hidden ${bg} ${shimmer} h-[400px] md:h-[500px]`} />
    );
  }

  if (type === 'line') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className={`w-24 h-24 rounded-lg ${bg} ${shimmer}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-4 ${bg} ${shimmer} rounded w-1/4`} />
              <div className={`h-4 ${bg} ${shimmer} rounded w-3/4`} />
              <div className={`h-3 ${bg} ${shimmer} rounded w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className={`h-48 ${bg} ${shimmer}`} />
          <div className="p-4 space-y-3">
            <div className={`h-4 ${bg} ${shimmer} rounded w-1/4`} />
            <div className={`h-5 ${bg} ${shimmer} rounded w-3/4`} />
            <div className={`h-4 ${bg} ${shimmer} rounded w-full`} />
            <div className={`h-3 ${bg} ${shimmer} rounded w-1/2`} />
          </div>
        </div>
      ))}
    </div>
  );
}

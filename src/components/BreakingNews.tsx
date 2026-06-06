import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface BreakingNewsProps {
  posts: any[];
}

export default function BreakingNews({ posts }: BreakingNewsProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % posts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts.length) return null;

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Zap size={16} className="text-yellow-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-red-500">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="whitespace-nowrap animate-marquee">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                to={`/article/${post.slug}`}
                className={`inline-block mr-12 text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

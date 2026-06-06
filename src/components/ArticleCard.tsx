import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface ArticleCardProps {
  post: any;
  variant?: 'default' | 'horizontal' | 'compact';
}

export default function ArticleCard({ post, variant = 'default' }: ArticleCardProps) {
  const { theme } = useTheme();
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex gap-4 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} p-3 rounded-xl transition-colors`}
      >
        <Link to={`/article/${post.slug}`} className="shrink-0">
          <img
            src={post.cover_image || '/uploads/upload_1.jpg'}
            alt={post.title}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {post.komputeks_categories && (
            <span className="text-xs font-medium text-blue-500">{post.komputeks_categories.name}</span>
          )}
          <Link to={`/article/${post.slug}`}>
            <h3 className={`font-semibold text-sm line-clamp-2 mt-1 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}>
              {post.title}
            </h3>
          </Link>
          <div className={`flex items-center gap-3 mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="flex items-center gap-1"><Clock size={12} />{formatDate(post.published_at)}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <Link to={`/article/${post.slug}`} className={`flex items-center gap-3 py-3 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b last:border-0`}>
        <img src={post.cover_image || '/uploads/upload_1.jpg'} alt={post.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
        <div className="min-w-0">
          <h4 className={`text-sm font-medium line-clamp-2 ${theme === 'dark' ? 'text-gray-200 hover:text-blue-400' : 'text-gray-800 hover:text-blue-600'} transition-colors`}>
            {post.title}
          </h4>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(post.published_at)}</span>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'} shadow-md transition-all duration-300`}
    >
      <Link to={`/article/${post.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.cover_image || '/uploads/upload_1.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {post.komputeks_categories && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {post.komputeks_categories.name}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/article/${post.slug}`}>
          <h3 className={`font-bold text-lg line-clamp-2 mb-2 ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'} transition-colors`}>
            {post.title}
          </h3>
        </Link>
        <p className={`text-sm line-clamp-2 mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {post.excerpt}
        </p>
        <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {post.views || 0}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

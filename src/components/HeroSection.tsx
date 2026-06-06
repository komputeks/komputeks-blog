import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  post: any;
}

export default function HeroSection({ post }: HeroSectionProps) {
  const { theme } = useTheme();

  if (!post) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden group cursor-pointer"
    >
      <Link to={`/article/${post.slug}`}>
        <div className="relative h-[400px] md:h-[500px]">
          <img
            src={post.cover_image || '/uploads/upload_1.jpg'}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-3">
              {post.komputeks_categories && (
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  {post.komputeks_categories.name}
                </span>
              )}
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                Featured
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 line-clamp-2">
              {post.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              {post.komputeks_users && (
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  {post.komputeks_users.full_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {post.views || 0} views
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

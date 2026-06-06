import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  editorsPicks: any[];
  popularPosts: any[];
  tags: any[];
}

export default function Sidebar({ editorsPicks, popularPosts, tags }: SidebarProps) {
  const { theme } = useTheme();
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <aside className="space-y-8">
      {/* Editors Picks */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`rounded-xl p-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
      >
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <span className="w-1 h-6 bg-blue-600 rounded-full" />
          Editor's Picks
        </h3>
        <div className="space-y-4">
          {editorsPicks.slice(0, 4).map((post, i) => (
            <Link key={post.id} to={`/article/${post.slug}`} className="flex gap-3 group">
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'} group-hover:text-blue-500 transition-colors`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h4 className={`text-sm font-medium line-clamp-2 ${theme === 'dark' ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'} transition-colors`}>
                  {post.title}
                </h4>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1 mt-1`}>
                  <Clock size={10} />{formatDate(post.published_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stay Connected */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl p-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
      >
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <span className="w-1 h-6 bg-purple-600 rounded-full" />
          Stay Connected
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <a href="#" className="flex items-center gap-2 p-3 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-700 transition-colors">
            <Facebook size={18} />
            <span>Facebook</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-sky-500 rounded-lg text-white text-sm hover:bg-sky-600 transition-colors">
            <Twitter size={18} />
            <span>Twitter</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-pink-600 rounded-lg text-white text-sm hover:bg-pink-700 transition-colors">
            <Instagram size={18} />
            <span>Instagram</span>
          </a>
          <a href="#" className="flex items-center gap-2 p-3 bg-red-600 rounded-lg text-white text-sm hover:bg-red-700 transition-colors">
            <Youtube size={18} />
            <span>YouTube</span>
          </a>
        </div>
      </motion.div>

      {/* Popular Posts */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl p-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
      >
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <span className="w-1 h-6 bg-green-600 rounded-full" />
          Popular Posts
        </h3>
        <div className="space-y-1">
          {popularPosts.slice(0, 5).map(post => (
            <Link key={post.id} to={`/article/${post.slug}`} className={`block py-2.5 ${theme === 'dark' ? 'border-gray-700 hover:text-blue-400' : 'border-gray-200 hover:text-blue-600'} border-b last:border-0 transition-colors`}>
              <h4 className="text-sm font-medium line-clamp-2">{post.title}</h4>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{post.views || 0} views</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-xl p-5 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}
      >
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <span className="w-1 h-6 bg-orange-600 rounded-full" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link
              key={tag.id}
              to={`/tag/${tag.slug}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'}`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </aside>
  );
}

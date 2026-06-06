import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Tag() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [tag, setTag] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 9;

  useEffect(() => {
    setPage(1);
    fetchData();
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, [slug]);

  const fetchData = async () => {
    try {
      const offset = (page - 1) * perPage;
      const res = await fetch(`/api/tag-posts?tag_slug=${slug}&limit=${perPage}&offset=${offset}`);
      const data = await res.json();
      setTag(data.tag);
      setPosts(data.posts || []);
      setTotal(data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1) fetchData();
  }, [page]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar categories={categories} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex items-center gap-2 text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <span>/</span>
          <span>Tag: {tag?.name || slug}</span>
        </div>
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            #{tag?.name || slug}
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{total} articles tagged</p>
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            {posts.length === 0 && (
              <p className={`text-center py-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No articles found with this tag.</p>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} disabled:opacity-50`}>
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg font-medium ${p === page ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} disabled:opacity-50`}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer categories={categories} />
    </div>
  );
}

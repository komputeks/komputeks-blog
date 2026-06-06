import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { theme } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      setPage(1);
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const offset = (page - 1) * perPage;
      const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}&limit=${perPage}&offset=${offset}`);
      const data = await res.json();
      setPosts(data.data || []);
      setTotal(data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1 && query) fetchResults();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar categories={categories} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex items-center gap-2 text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <span>/</span>
          <span>Search</span>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className={`w-full px-6 py-4 rounded-xl text-lg ${theme === 'dark' ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
              <Search size={24} />
            </button>
          </div>
        </form>

        {query && (
          <h2 className={`text-xl mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {loading ? 'Searching...' : `${total} results for "${query}"`}
          </h2>
        )}

        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            {posts.length === 0 && query && (
              <div className="text-center py-16">
                <Search size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No articles found for "{query}"</p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Try different keywords or browse categories</p>
              </div>
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

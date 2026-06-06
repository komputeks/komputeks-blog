import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Category() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [category, setCategory] = useState<any>(null);
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

  useEffect(() => {
    if (category) fetchPosts();
  }, [page]);

  const fetchData = async () => {
    try {
      const catRes = await fetch(`/api/categories?slug=${slug}`);
      const catData = await catRes.json();
      setCategory(catData);

      const postsRes = await fetch(`/api/posts?category=${catData.id}&limit=${perPage}&offset=0`);
      const postsData = await postsRes.json();
      setPosts(postsData.data || []);
      setTotal(postsData.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!category) return;
    const offset = (page - 1) * perPage;
    const res = await fetch(`/api/posts?category=${category.id}&limit=${perPage}&offset=${offset}`);
    const data = await res.json();
    setPosts(data.data || []);
    setTotal(data.count || 0);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar categories={categories} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex items-center gap-2 text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <span>/</span>
          <span>{category?.name || 'Category'}</span>
        </div>

        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {category?.name || 'Category'}
          </h1>
          {category?.description && (
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{category.description}</p>
          )}
          {/* Subcategories */}
          {category?.children && category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category.children.map((child: any) => (
                <Link key={child.id} to={`/category/${child.slug}`} className={`px-3 py-1.5 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'} transition-colors`}>
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            {posts.length === 0 && (
              <p className={`text-center py-16 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No articles found in this category.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} disabled:opacity-50 transition-colors`}
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${p === page ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'} disabled:opacity-50 transition-colors`}
                >
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

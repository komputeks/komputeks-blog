import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BreakingNews from '../components/BreakingNews';
import HeroSection from '../components/HeroSection';
import ArticleCard from '../components/ArticleCard';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [breakingPosts, setBreakingPosts] = useState<any[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, catsRes, tagsRes, featuredRes, breakingRes, picksRes, popularRes] = await Promise.all([
        fetch('/api/posts?limit=12'),
        fetch('/api/categories'),
        fetch('/api/tags'),
        fetch('/api/posts?featured=true&limit=1'),
        fetch('/api/posts?breaking=true&limit=5'),
        fetch('/api/posts?editors_pick=true&limit=5'),
        fetch('/api/posts?limit=5'),
      ]);

      const postsData = await postsRes.json();
      const catsData = await catsRes.json();
      const tagsData = await tagsRes.json();
      const featuredData = await featuredRes.json();
      const breakingData = await breakingRes.json();
      const picksData = await picksRes.json();
      const popularData = await popularRes.json();

      setPosts(postsData.data || []);
      setCategories(catsData || []);
      setTags(tagsData || []);
      setFeaturedPost(featuredData.data?.[0] || null);
      setBreakingPosts(breakingData.data || []);
      setEditorsPicks(picksData.data || []);
      setPopularPosts((popularData.data || []).sort((a: any, b: any) => (b.views || 0) - (a.views || 0)));
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Navbar categories={categories} />
      <BreakingNews posts={breakingPosts} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <>
            <SkeletonLoader type="hero" />
            <div className="mt-8">
              <SkeletonLoader count={6} />
            </div>
          </>
        ) : (
          <>
            {/* Hero Section */}
            {featuredPost && <HeroSection post={featuredPost} />}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
              {/* Articles */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-8 bg-blue-600 rounded-full" />
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Latest Articles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.filter(p => !p.is_featured).slice(0, 8).map(post => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Sidebar editorsPicks={editorsPicks} popularPosts={popularPosts} tags={tags} />
              </div>
            </div>

            {/* More Articles */}
            {posts.length > 8 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-8 bg-purple-600 rounded-full" />
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>More Stories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(8).map(post => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}

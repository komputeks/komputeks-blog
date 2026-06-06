import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Tag, ChevronLeft, ChevronRight, MessageCircle, Share2, Facebook, Twitter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useTheme } from '../contexts/ThemeContext';

export default function Article() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [adjacentPosts, setAdjacentPosts] = useState<{ prev: any; next: any }>({ prev: null, next: null });
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts?slug=${slug}`);
      const data = await res.json();
      setPost(data);

      // Increment views
      await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: data.id, views: (data.views || 0) + 1 }),
      });

      // Get related posts
      if (data.category_id) {
        const relRes = await fetch(`/api/posts?category=${data.category_id}&limit=3`);
        const relData = await relRes.json();
        setRelatedPosts((relData.data || []).filter((p: any) => p.id !== data.id));
      }

      // Get adjacent posts
      const adjRes = await fetch(`/api/adjacent-posts?post_id=${data.id}`);
      const adjData = await adjRes.json();
      setAdjacentPosts(adjData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, author_name: commentName, author_email: commentEmail, content: commentContent }),
      });
      setCommentName('');
      setCommentEmail('');
      setCommentContent('');
      fetchPost();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar categories={categories} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SkeletonLoader type="hero" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar categories={categories} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Article not found</h1>
          <Link to="/" className="text-blue-500 mt-4 inline-block">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      <Navbar categories={categories} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>/</span>
          {post.komputeks_categories && (
            <>
              <Link to={`/category/${post.komputeks_categories.slug}`} className="hover:text-blue-500 transition-colors">
                {post.komputeks_categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="line-clamp-1">{post.title}</span>
        </div>

        {/* Article Header */}
        <article>
          <div className="flex items-center gap-3 mb-4">
            {post.komputeks_categories && (
              <Link to={`/category/${post.komputeks_categories.slug}`} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors">
                {post.komputeks_categories.name}
              </Link>
            )}
            {post.is_featured && (
              <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-medium rounded-full">Featured</span>
            )}
          </div>

          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </h1>

          <div className={`flex flex-wrap items-center gap-4 mb-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {post.komputeks_users && (
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {post.komputeks_users.full_name?.charAt(0)}
                </div>
                {post.komputeks_users.full_name}
              </span>
            )}
            <span className="flex items-center gap-1"><Clock size={14} />{formatDate(post.published_at)}</span>
            <span className="flex items-center gap-1"><Eye size={14} />{post.views || 0} views</span>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden mb-8">
            <img src={post.cover_image || '/uploads/upload_1.jpg'} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          </div>

          {/* Content */}
          <div className={`prose prose-lg max-w-none ${theme === 'dark' ? 'prose-invert' : ''} mb-8`}>
            <div className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {post.content?.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              {post.tags.map((tag: any) => (
                <Link key={tag.id} to={`/tag/${tag.slug}`} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'}`}>
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className={`flex items-center gap-4 py-6 border-y ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Share:</span>
            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Facebook size={16} />
            </button>
            <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
              <Twitter size={16} />
            </button>
            <button className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} transition-colors`}>
              <Share2 size={16} />
            </button>
          </div>

          {/* Author Bio */}
          {post.komputeks_users && (
            <div className={`mt-8 p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {post.komputeks_users.full_name?.charAt(0)}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {post.komputeks_users.full_name}
                  </h3>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.komputeks_users.bio || 'Technology enthusiast and writer covering the latest trends in computing, AI, and digital innovation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Previous/Next Navigation */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-8`}>
            {adjacentPosts.prev ? (
              <Link to={`/article/${adjacentPosts.prev.slug}`} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} shadow-md transition-all group`}>
                <div className="flex items-center gap-2 mb-2">
                  <ChevronLeft size={16} className="text-blue-500" />
                  <span className="text-xs text-blue-500 font-medium">Previous Post</span>
                </div>
                <h4 className={`font-medium text-sm line-clamp-2 ${theme === 'dark' ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'} transition-colors`}>
                  {adjacentPosts.prev.title}
                </h4>
              </Link>
            ) : <div />}
            {adjacentPosts.next ? (
              <Link to={`/article/${adjacentPosts.next.slug}`} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'} shadow-md transition-all group text-right`}>
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-xs text-blue-500 font-medium">Next Post</span>
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
                <h4 className={`font-medium text-sm line-clamp-2 ${theme === 'dark' ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'} transition-colors`}>
                  {adjacentPosts.next.title}
                </h4>
              </Link>
            ) : <div />}
          </div>

          {/* Comments */}
          <div className="mt-12">
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <MessageCircle size={20} />
              Comments ({post.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={commentName}
                  onChange={e => setCommentName(e.target.value)}
                  className={`px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={commentEmail}
                  onChange={e => setCommentEmail(e.target.value)}
                  className={`px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <textarea
                placeholder="Write your comment..."
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments?.map((comment: any) => (
                <div key={comment.id} className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {comment.author_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{comment.author_name}</h4>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{comment.content}</p>
                </div>
              ))}
              {(!post.comments || post.comments.length === 0) && (
                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(p => (
                  <ArticleCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer categories={categories} />
    </div>
  );
}

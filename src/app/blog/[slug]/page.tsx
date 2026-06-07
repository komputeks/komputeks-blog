import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Eye, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';
import CommentSection from '@/components/blog/CommentSection';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts?slug=${slug}&status=published`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

async function getAdjacentPosts(currentId: string, categoryId?: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const params = new URLSearchParams({ current_id: currentId });
    if (categoryId) params.set('category_id', categoryId);

    const res = await fetch(`${baseUrl}/api/adjacent-posts?${params.toString()}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  } catch {
    return { prev: null, next: null };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author?.name || 'Anonymous'],
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const adjacent = await getAdjacentPosts(post.id, post.category_id);
  const readTime = getReadingTime(post.content);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
              {post.category.name}
            </span>
          )}
          {post.is_breaking && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded">
              Breaking
            </span>
          )}
          {post.is_editors_pick && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded">
              Editor's Pick
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author.name || 'Anonymous'}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.published_at || post.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {readTime} min read
          </span>
          {post.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()} views
            </span>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex justify-between items-center py-8 border-t border-gray-200 dark:border-gray-700">
        {adjacent.prev ? (
          <Link
            href={`/blog/${adjacent.prev.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <div>
              <div className="text-xs text-gray-400">Previous</div>
              <div className="font-medium line-clamp-1">{adjacent.prev.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            href={`/blog/${adjacent.next.slug}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-right"
          >
            <div>
              <div className="text-xs text-gray-400">Next</div>
              <div className="font-medium line-clamp-1">{adjacent.next.title}</div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </nav>

      {/* Comments */}
      <CommentSection postId={post.id} />
    </article>
  );
}

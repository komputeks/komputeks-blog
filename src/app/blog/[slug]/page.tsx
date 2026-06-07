import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Eye, ChevronLeft, ChevronRight, ArrowLeft, Tag } from 'lucide-react';
import { formatDate, getReadingTime, formatNumber } from '@/lib/utils';
import CommentSection from '@/components/blog/CommentSection';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts?slug=${slug}&status=published`, { cache: 'no-store' });
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
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const params = new URLSearchParams({ current_id: currentId });
    if (categoryId) params.set('category_id', categoryId);
    const res = await fetch(`${baseUrl}/api/adjacent-posts?${params.toString()}`, { cache: 'no-store' });
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
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full"
            >
              {post.category.name}
            </Link>
          )}
          {post.is_breaking && (
            <span className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
              Breaking
            </span>
          )}
          {post.is_editors_pick && (
            <span className="px-3 py-1 text-xs font-medium bg-yellow-500 text-white rounded-full">
              Editor's Pick
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
              {formatNumber(post.views)} views
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
        <div className="flex flex-wrap gap-2 mb-8">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-accent transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex justify-between items-center py-8 border-t">
        {adjacent.prev ? (
          <Link
            href={`/blog/${adjacent.prev.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
            <div>
              <div className="text-xs text-muted-foreground">Previous</div>
              <div className="font-medium line-clamp-1">{adjacent.prev.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            href={`/blog/${adjacent.next.slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-right"
          >
            <div>
              <div className="text-xs text-muted-foreground">Next</div>
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

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Eye, ChevronLeft, ChevronRight, ArrowLeft, Tag } from 'lucide-react';
import { createServerClient } from '@/lib/supabase';
import { formatDate, getReadingTime, formatNumber } from '@/lib/utils';
import CommentSection from '@/components/blog/CommentSection';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('komputeks_posts')
    .select(`
      *,
      category:komputeks_categories(id, name, slug),
      author:komputeks_users(id, name, email, bio),
      tags:komputeks_post_tags(
        tag:komputeks_tags(id, name, slug)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }

  // Increment view count
  supabase
    .from('komputeks_posts')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)
    .then(() => {});

  return {
    ...data,
    tags: data.tags?.map((t: any) => t.tag).filter(Boolean) || [],
  };
}

async function getAdjacentPosts(currentId: string, categoryId?: string) {
  const supabase = createServerClient();
  
  // Get previous post (older)
  const { data: prevPosts } = await supabase
    .from('komputeks_posts')
    .select('id, title, slug')
    .eq('status', 'published')
    .lt('id', currentId)
    .order('created_at', { ascending: false })
    .limit(1);

  // Get next post (newer)
  const { data: nextPosts } = await supabase
    .from('komputeks_posts')
    .select('id, title, slug')
    .eq('status', 'published')
    .gt('id', currentId)
    .order('created_at', { ascending: true })
    .limit(1);

  return {
    prev: prevPosts?.[0] || null,
    next: nextPosts?.[0] || null,
  };
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

export const revalidate = 60; // Revalidate every 60 seconds

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
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              {post.category.name}
            </span>
          )}
          {post.is_breaking && (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
              Breaking
            </span>
          )}
          {post.is_editors_pick && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium">
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
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Eye } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate, generateExcerpt, getReadingTime, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const excerpt = post.excerpt || generateExcerpt(post.content);
  const readingTime = getReadingTime(post.content);

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-lg bg-card border">
        <Link href={`/blog/${post.slug}`} className="block">
          {post.featured_image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {post.category && (
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary rounded-full mb-3">
                {post.category.name}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-200 line-clamp-2">{excerpt}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 py-4 border-b last:border-0">
        {post.featured_image && (
          <Link href={`/blog/${post.slug}`} className="shrink-0">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-20 h-20 object-cover rounded"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${post.slug}`}>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(post.published_at || post.created_at)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        {post.featured_image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {post.category.name}
            </Link>
          )}
          {post.is_breaking && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded">
              Breaking
            </span>
          )}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author.name || 'Anonymous'}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime}m
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(post.views)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

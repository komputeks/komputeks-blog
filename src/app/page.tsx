import { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { formatDate, getReadingTime, formatNumber } from '@/lib/utils';
import { Calendar, Clock, User, Eye, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['technology', 'programming', 'blog', 'tutorials', 'web development', 'software engineering'],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@komputeks',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getRecentPosts() {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('komputeks_posts')
    .select(`
      *,
      category:komputeks_categories(id, name, slug),
      author:komputeks_users(id, name, email)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

async function getCategories() {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('komputeks_categories')
    .select('*')
    .order('name')
    .limit(6);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getRecentPosts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-blue-200">{siteConfig.shortName}</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Read Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Articles
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: any) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    {post.category && (
                      <Link
                        href={`/category/${post.category.slug}`}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getReadingTime(post.content)}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(post.views)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Subscribe to our newsletter to get the latest articles delivered to your inbox.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Subscribe Now
          </Link>
        </div>
      </section>
    </div>
  );
}

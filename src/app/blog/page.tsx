import type { Metadata } from 'next';
import { PostCard, CategoryNav } from '@/components/blog';

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

async function getPosts(page: number, category?: string) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    let url = `${baseUrl}/api/posts?limit=12&page=${page}`;
    if (category) url += `&category=${category}`;

    const res = await fetch(url, { cache: 'no-store' });
    return res.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: [], total: 0, total_pages: 0 };
  }
}

async function getCategories() {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
    return res.json();
  } catch {
    return [];
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return {
    title: 'Blog',
    description: 'Explore our latest articles on technology, programming, and software engineering.',
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const categorySlug = params.category;

  const [postsData, categories] = await Promise.all([
    getPosts(page, categorySlug),
    getCategories(),
  ]);

  const posts = postsData.data || [];
  const totalPages = postsData.total_pages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">All Posts</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <a
                      key={p}
                      href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        p === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
            <CategoryNav categories={categories} activeSlug={categorySlug} />
          </div>
        </aside>
      </div>
    </div>
  );
}

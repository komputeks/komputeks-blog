import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard',
};

async function getStats() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [postsRes, categoriesRes, tagsRes, commentsRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts?status=all&per_page=1`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/categories`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/tags`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/comments?status=all&per_page=1`, { cache: 'no-store' }),
  ]);

  const posts = await postsRes.json();
  const categories = await categoriesRes.json();
  const tags = await tagsRes.json();
  const comments = await commentsRes.json();

  return {
    totalPosts: posts.total || 0,
    totalCategories: categories.length || 0,
    totalTags: tags.length || 0,
    totalComments: comments.total || 0,
    publishedPosts: posts.data?.filter((p: any) => p.status === 'published').length || 0,
    draftPosts: posts.data?.filter((p: any) => p.status === 'draft').length || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-3xl font-bold mt-1">{stats.totalPosts}</p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-3xl font-bold mt-1">{stats.totalCategories}</p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Tags</p>
          <p className="text-3xl font-bold mt-1">{stats.totalTags}</p>
        </div>
        <div className="bg-card rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Comments</p>
          <p className="text-3xl font-bold mt-1">{stats.totalComments}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/posts/new"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            New Post
          </a>
          <a
            href="/admin/categories"
            className="px-4 py-2 rounded-md border hover:bg-accent"
          >
            Manage Categories
          </a>
          <a
            href="/admin/comments"
            className="px-4 py-2 rounded-md border hover:bg-accent"
          >
            Moderate Comments
          </a>
        </div>
      </div>
    </div>
  );
}

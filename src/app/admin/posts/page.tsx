'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Card, Badge, Input, Textarea } from '@/components/ui';
import toast from 'react-hot-toast';
import type { Post, Category, Tag } from '@/types';

function PostsManager() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('action') === 'new';
  const editId = searchParams.get('edit');

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    is_breaking: false,
    is_editors_pick: false,
    tag_ids: [] as string[],
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (isNew || editId) {
      setShowForm(true);
      if (editId) {
        fetchPost(editId);
      }
    }
  }, [isNew, editId]);

  const fetchData = async () => {
    try {
      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        fetch('/api/posts?limit=100'),
        fetch('/api/categories'),
        fetch('/api/tags'),
      ]);
      const [postsData, categoriesData, tagsData] = await Promise.all([
        postsRes.json(),
        categoriesRes.json(),
        tagsRes.json(),
      ]);
      setPosts(postsData.data || []);
      setCategories(categoriesData || []);
      setAllTags(tagsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts?id=${id}`);
      const post = await res.json();
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        category_id: post.category_id || '',
        status: post.status,
        is_breaking: post.is_breaking,
        is_editors_pick: post.is_editors_pick,
        tag_ids: post.tags?.map((t: Tag) => t.id) || [],
      });
    } catch (error) {
      toast.error('Failed to load post');
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Post deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const data = {
        ...formData,
        category_id: formData.category_id || null,
        author_id: user?.id,
      };

      const url = '/api/posts';
      const method = editId ? 'PUT' : 'POST';
      if (editId) (data as any).id = editId;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save');

      toast.success(editId ? 'Post updated' : 'Post created');
      setShowForm(false);
      router.push('/admin/posts');
      fetchData();
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setFormLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!user) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <Button onClick={() => { setShowForm(true); router.push('/admin/posts?action=new'); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {showForm ? (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              {editId ? 'Edit Post' : 'New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      title: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value),
                    }));
                  }}
                  required
                />
                <Input
                  label="Slug"
                  value={formData.slug}
                  onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>

              <Textarea
                label="Content"
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={10}
                required
              />

              <Input
                label="Excerpt"
                value={formData.excerpt}
                onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                helperText="Brief description for previews"
              />

              <Input
                label="Featured Image URL"
                value={formData.featured_image}
                onChange={e => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                type="url"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tag_ids: prev.tag_ids.includes(tag.id)
                            ? prev.tag_ids.filter(id => id !== tag.id)
                            : [...prev.tag_ids, tag.id],
                        }));
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.tag_ids.includes(tag.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_breaking}
                    onChange={e => setFormData(prev => ({ ...prev, is_breaking: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Breaking News</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_editors_pick}
                    onChange={e => setFormData(prev => ({ ...prev, is_editors_pick: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Editor's Pick</span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" loading={formLoading}>
                  {editId ? 'Update' : 'Create'} Post
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowForm(false); router.push('/admin/posts'); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Posts List */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredPosts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {post.is_breaking && <Badge variant="danger" size="sm">Breaking</Badge>}
                          {post.is_editors_pick && <Badge variant="warning" size="sm">Pick</Badge>}
                          <span className="font-medium text-gray-900 dark:text-white">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {post.category?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={post.status === 'published' ? 'success' : post.status === 'draft' ? 'default' : 'warning'}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/posts?edit=${post.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>}>
      <PostsManager />
    </Suspense>
  );
}

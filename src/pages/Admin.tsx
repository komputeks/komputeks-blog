import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, FileText, Tag, FolderOpen, Users, MessageCircle, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Admin() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  // Form states
  const [postForm, setPostForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category_id: '', status: 'published', is_featured: false, is_breaking: false, is_editors_pick: false, tags: [] as number[] });
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', parent_id: '' });
  const [tagForm, setTagForm] = useState({ name: '', slug: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [postsRes, catsRes, tagsRes, usersRes, commentsRes] = await Promise.all([
        fetch('/api/posts?status=published'),
        fetch('/api/categories'),
        fetch('/api/tags'),
        fetch('/api/users'),
        fetch('/api/comments'),
      ]);
      setPosts((await postsRes.json()).data || []);
      setCategories(await catsRes.json());
      setTags(await tagsRes.json());
      setUsers(await usersRes.json());
      setComments(await commentsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    // Get token from localStorage (supabase stores it there)
    const session = localStorage.getItem(`sb-${new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]}-auth-token`);
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.access_token;
    }
    return null;
  };

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  });

  // Posts CRUD
  const handleSavePost = async () => {
    try {
      if (editingPost) {
        await fetch('/api/posts', {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ ...postForm, id: editingPost.id, category_id: parseInt(postForm.category_id) || null }),
        });
      } else {
        await fetch('/api/posts', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ ...postForm, category_id: parseInt(postForm.category_id) || null }),
        });
      }
      setShowPostForm(false);
      setEditingPost(null);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/posts', { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id }) });
    fetchAll();
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setPostForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content || '',
      cover_image: post.cover_image || '', category_id: String(post.category_id || ''),
      status: post.status, is_featured: post.is_featured, is_breaking: post.is_breaking,
      is_editors_pick: post.is_editors_pick, tags: post.tags?.map((t: any) => t.id) || [],
    });
    setShowPostForm(true);
  };

  // Categories CRUD
  const handleSaveCategory = async () => {
    if (!catForm.name || !catForm.slug) return;
    await fetch('/api/categories', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ...catForm, parent_id: catForm.parent_id ? parseInt(catForm.parent_id) : null }),
    });
    setCatForm({ name: '', slug: '', description: '', parent_id: '' });
    fetchAll();
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await fetch('/api/categories', { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id }) });
    fetchAll();
  };

  // Tags CRUD
  const handleSaveTag = async () => {
    if (!tagForm.name || !tagForm.slug) return;
    await fetch('/api/tags', { method: 'POST', headers: authHeaders(), body: JSON.stringify(tagForm) });
    setTagForm({ name: '', slug: '' });
    fetchAll();
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm('Delete this tag?')) return;
    await fetch('/api/tags', { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id }) });
    fetchAll();
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Delete this comment?')) return;
    await fetch('/api/comments', { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id }) });
    fetchAll();
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
  ];

  const inputClass = `w-full px-4 py-2.5 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar categories={categories} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
          <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <button onClick={() => { setShowPostForm(true); setEditingPost(null); setPostForm({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category_id: '', status: 'published', is_featured: false, is_breaking: false, is_editors_pick: false, tags: [] }); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-6">
                  <Plus size={16} /> New Post
                </button>

                {showPostForm && (
                  <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {editingPost ? 'Edit Post' : 'New Post'}
                      </h3>
                      <button onClick={() => setShowPostForm(false)} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input placeholder="Title" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className={inputClass} />
                      <input placeholder="Slug" value={postForm.slug} onChange={e => setPostForm({ ...postForm, slug: e.target.value })} className={inputClass} />
                      <select value={postForm.category_id} onChange={e => setPostForm({ ...postForm, category_id: e.target.value })} className={inputClass}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <input placeholder="Cover Image URL" value={postForm.cover_image} onChange={e => setPostForm({ ...postForm, cover_image: e.target.value })} className={inputClass} />
                    </div>
                    <textarea placeholder="Excerpt" value={postForm.excerpt} onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })} className={`${inputClass} mb-4`} rows={2} />
                    <textarea placeholder="Content (paragraphs separated by blank lines)" value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} className={`${inputClass} mb-4`} rows={8} />
                    <div className="flex flex-wrap gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={postForm.is_featured} onChange={e => setPostForm({ ...postForm, is_featured: e.target.checked })} className="rounded" /> Featured
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={postForm.is_breaking} onChange={e => setPostForm({ ...postForm, is_breaking: e.target.checked })} className="rounded" /> Breaking
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={postForm.is_editors_pick} onChange={e => setPostForm({ ...postForm, is_editors_pick: e.target.checked })} className="rounded" /> Editor's Pick
                      </label>
                      <select value={postForm.status} onChange={e => setPostForm({ ...postForm, status: e.target.value })} className={`${inputClass} w-auto`}>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => setPostForm({ ...postForm, tags: postForm.tags.includes(tag.id) ? postForm.tags.filter(t => t !== tag.id) : [...postForm.tags, tag.id] })}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${postForm.tags.includes(tag.id) ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleSavePost} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Save size={16} /> {editingPost ? 'Update' : 'Create'} Post
                    </button>
                  </div>
                )}

                <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <tr>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Title</th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Category</th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                          <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Views</th>
                          <th className={`px-4 py-3 text-right text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posts.map(post => (
                          <tr key={post.id} className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                            <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{post.title.substring(0, 50)}...</td>
                            <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{post.komputeks_categories?.name || '-'}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.status}</span></td>
                            <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{post.views || 0}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => handleEditPost(post)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded mr-1"><Edit size={16} /></button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input placeholder="Name" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className={inputClass} />
                    <input placeholder="Slug" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} className={inputClass} />
                    <input placeholder="Description" value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} className={inputClass} />
                    <select value={catForm.parent_id} onChange={e => setCatForm({ ...catForm, parent_id: e.target.value })} className={inputClass}>
                      <option value="">No Parent (Top Level)</option>
                      {categories.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <button onClick={handleSaveCategory} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Plus size={16} /> Add Category
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cat.name}</h4>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{cat.slug}</p>
                          {cat.parent_id && <span className="text-xs text-blue-500">Subcategory</span>}
                        </div>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Tab */}
            {activeTab === 'tags' && (
              <div>
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md mb-6`}>
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Tag</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input placeholder="Name" value={tagForm.name} onChange={e => setTagForm({ ...tagForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className={inputClass} />
                    <input placeholder="Slug" value={tagForm.slug} onChange={e => setTagForm({ ...tagForm, slug: e.target.value })} className={inputClass} />
                  </div>
                  <button onClick={handleSaveTag} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Plus size={16} /> Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tags.map(tag => (
                    <div key={tag.id} className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{tag.name}</span>
                      <button onClick={() => handleDeleteTag(tag.id)} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <table className="w-full">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Email</th>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                        <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{u.full_name}</td>
                        <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{u.email}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">{u.role}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{comment.author_name}</h4>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => handleDeleteComment(comment.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{comment.content}</p>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Post ID: {comment.post_id}</p>
                  </div>
                ))}
                {comments.length === 0 && <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>No comments yet.</p>}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

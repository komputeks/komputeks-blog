'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Card, Badge } from '@/components/ui';
import toast from 'react-hot-toast';
import type { Comment } from '@/types';

export default function CommentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchComments = async () => {
    try {
      const url = statusFilter ? `/api/comments?status=${statusFilter}` : '/api/comments';
      const res = await fetch(url);
      const data = await res.json();
      setComments(data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchComments();
  }, [user, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Comment ' + status);
      fetchComments();
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Comment deleted');
      fetchComments();
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!user) return null;

  const statusColors = {
    pending: 'warning',
    approved: 'success',
    spam: 'danger',
    trash: 'default',
  } as const;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h1>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="spam">Spam</option>
          <option value="trash">Trash</option>
        </select>
      </div>

      <div className="space-y-4">
        {comments.map(comment => (
          <Card key={comment.id}>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{comment.author_name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{comment.author_email}</span>
                </div>
                <Badge variant={statusColors[comment.status as keyof typeof statusColors] || 'default'}>
                  {comment.status}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{comment.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  {comment.status === 'pending' && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(comment.id, 'approved')}>
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(comment.id, 'spam')}>
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  {comment.status === 'spam' && (
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(comment.id, 'approved')}>
                      <Check className="w-4 h-4 text-green-500" /> Not Spam
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(comment.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No comments found.
          </div>
        )}
      </div>
    </div>
  );
}

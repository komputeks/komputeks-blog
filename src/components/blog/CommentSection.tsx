'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatRelativeTime } from '@/lib/utils';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  status: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?post_id=${postId}&status=approved`);
      const data = await res.json();
      setComments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.author_email || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          post_id: postId,
        }),
      });

      if (res.ok) {
        toast.success('Comment submitted! It will be visible after moderation.');
        setFormData({ author_name: '', author_email: '', content: '' });
      } else {
        toast.error('Failed to submit comment');
      }
    } catch (error) {
      toast.error('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.author_email}
            onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
            className="px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <textarea
          placeholder="Write your comment..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Submit Comment
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{comment.author_name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

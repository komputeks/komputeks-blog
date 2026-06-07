import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { commentSchema } from '@/schemas';

// GET /api/comments - List comments with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;

    const postId = searchParams.get('post_id');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20', 10), 100);
    const offset = (page - 1) * perPage;

    let query = supabase
      .from('komputeks_comments')
      .select('*, post:komputeks_posts(id,title,slug), user:komputeks_users(id,name,email,avatar_url)', { count: 'exact' });

    if (postId) {
      query = query.eq('post_id', postId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1);

    if (error) throw error;

    return NextResponse.json({
      data,
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const validated = commentSchema.parse(body);

    // Verify post exists
    const { data: post } = await supabase
      .from('komputeks_posts')
      .select('id')
      .eq('id', validated.post_id)
      .single();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('komputeks_comments')
      .insert({
        ...validated,
        status: 'pending', // Comments start as pending for moderation
      })
      .select('*, post:komputeks_posts(id,title,slug)')
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create comment' },
      { status: 500 }
    );
  }
}

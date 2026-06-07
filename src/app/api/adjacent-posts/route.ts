import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET /api/adjacent-posts - Get previous and next posts for navigation
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;

    const currentId = searchParams.get('current_id');
    const categoryId = searchParams.get('category_id');

    if (!currentId) {
      return NextResponse.json({ error: 'current_id is required' }, { status: 400 });
    }

    // Get current post to determine position
    const { data: currentPost } = await supabase
      .from('komputeks_posts')
      .select('id, created_at')
      .eq('id', currentId)
      .single();

    if (!currentPost) {
      return NextResponse.json({ prev: null, next: null });
    }

    // Build base query for published posts
    let baseQuery = supabase
      .from('komputeks_posts')
      .select('id, title, slug, created_at')
      .eq('status', 'published');

    // Filter by category if provided
    if (categoryId) {
      baseQuery = baseQuery.eq('category_id', categoryId);
    }

    // Get previous post (older)
    const { data: prevPosts } = await supabase
      .from('komputeks_posts')
      .select('id, title, slug')
      .eq('status', 'published')
      .lt('created_at', currentPost.created_at)
      .order('created_at', { ascending: false })
      .limit(1);

    // Apply category filter to prev if needed
    let prev = prevPosts?.[0] || null;
    if (prev && categoryId) {
      const { data: filteredPrev } = await supabase
        .from('komputeks_posts')
        .select('id, title, slug')
        .eq('status', 'published')
        .eq('category_id', categoryId)
        .lt('created_at', currentPost.created_at)
        .order('created_at', { ascending: false })
        .limit(1);
      prev = filteredPrev?.[0] || null;
    }

    // Get next post (newer)
    const { data: nextPosts } = await supabase
      .from('komputeks_posts')
      .select('id, title, slug')
      .eq('status', 'published')
      .gt('created_at', currentPost.created_at)
      .order('created_at', { ascending: true })
      .limit(1);

    // Apply category filter to next if needed
    let next = nextPosts?.[0] || null;
    if (next && categoryId) {
      const { data: filteredNext } = await supabase
        .from('komputeks_posts')
        .select('id, title, slug')
        .eq('status', 'published')
        .eq('category_id', categoryId)
        .gt('created_at', currentPost.created_at)
        .order('created_at', { ascending: true })
        .limit(1);
      next = filteredNext?.[0] || null;
    }

    return NextResponse.json({ prev, next });
  } catch (error) {
    console.error('GET /api/adjacent-posts error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch adjacent posts' },
      { status: 500 }
    );
  }
}

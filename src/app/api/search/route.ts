import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET /api/search - Search posts
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get('q');
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '10', 10), 100);
    const offset = (page - 1) * perPage;

    // Search in title, content, and excerpt
    const { data, error, count } = await supabase
      .from('komputeks_posts')
      .select('*, category:komputeks_categories(*), author:komputeks_users(id,name,email,avatar_url), tags:komputeks_post_tags(tag:komputeks_tags(*))', { count: 'exact' })
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1);

    if (error) throw error;

    const posts = data?.map(post => ({
      ...post,
      tags: post.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) || [],
    })) || [];

    return NextResponse.json({
      data: posts,
      total: count || 0,
      query,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (error) {
    console.error('GET /api/search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}

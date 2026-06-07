import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { postSchema } from '@/schemas';

// GET /api/posts - List posts with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '10', 10), 100);
    const offset = (page - 1) * perPage;

    // Filter parameters
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');

    // Build query
    let query = supabase
      .from('komputeks_posts')
      .select('*, category:komputeks_categories(*), author:komputeks_users(id,name,email,avatar_url), tags:komputeks_post_tags(tag:komputeks_tags(*))',
        { count: 'exact' }
      );

    // Apply filters
    if (slug) {
      query = query.eq('slug', slug);
    }
    if (category) {
      query = query.eq('category_id', category);
    }
    if (tag) {
      // Filter by tag using junction table
      const { data: postIds } = await supabase
        .from('komputeks_post_tags')
        .select('post_id')
        .eq('tag_id', tag);
      
      if (postIds && postIds.length > 0) {
        query = query.in('id', postIds.map(p => p.post_id));
      } else {
        return NextResponse.json({ data: [], total: 0, page, per_page: perPage, total_pages: 0 });
      }
    }
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1);

    if (error) throw error;

    // Transform tags from junction table
    const posts = data?.map(post => ({
      ...post,
      tags: post.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) || [],
    })) || [];

    return NextResponse.json({
      data: posts,
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    // Validate input
    const validated = postSchema.parse(body);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('komputeks_posts')
      .select('id')
      .eq('slug', validated.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    // Extract tag_ids from validated data
    const { tag_ids, ...postData } = validated;

    // Set published_at if status is published
    if (postData.status === 'published') {
      (postData as Record<string, unknown>).published_at = new Date().toISOString();
    }

    // Create post
    const { data: post, error } = await supabase
      .from('komputeks_posts')
      .insert(postData)
      .select('*, category:komputeks_categories(*), author:komputeks_users(id,name,email,avatar_url)')
      .single();

    if (error) throw error;

    // Create post-tag associations
    if (tag_ids && tag_ids.length > 0) {
      const tagAssociations = tag_ids.map(tagId => ({
        post_id: post.id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase
        .from('komputeks_post_tags')
        .insert(tagAssociations);

      if (tagError) console.error('Failed to create tag associations:', tagError);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}

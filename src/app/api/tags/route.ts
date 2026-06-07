import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { tagSchema } from '@/schemas';

// GET /api/tags - List all tags
export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('komputeks_tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    // Get post counts for each tag
    const { data: postTags } = await supabase
      .from('komputeks_post_tags')
      .select('tag_id, komputeks_posts!inner(status)');

    const countMap = new Map<string, number>();
    postTags?.forEach((pt: Record<string, unknown>) => {
      const posts = pt.komputeks_posts as Record<string, unknown>;
      if (posts?.status === 'published') {
        const tagId = pt.tag_id as string;
        countMap.set(tagId, (countMap.get(tagId) || 0) + 1);
      }
    });

    const tags = data?.map(tag => ({
      ...tag,
      post_count: countMap.get(tag.id) || 0,
    })) || [];

    return NextResponse.json(tags);
  } catch (error) {
    console.error('GET /api/tags error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const validated = tagSchema.parse(body);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('komputeks_tags')
      .select('id')
      .eq('slug', validated.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('komputeks_tags')
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/tags error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create tag' },
      { status: 500 }
    );
  }
}

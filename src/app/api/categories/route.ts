import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { categorySchema } from '@/schemas';

// GET /api/categories - List all categories
export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('komputeks_categories')
      .select('*, parent:komputeks_categories!parent_id(*)')
      .order('name', { ascending: true });

    if (error) throw error;

    // Get post counts for each category
    const { data: postCounts } = await supabase
      .from('komputeks_posts')
      .select('category_id')
      .eq('status', 'published');

    const countMap = new Map<string, number>();
    postCounts?.forEach(post => {
      if (post.category_id) {
        countMap.set(post.category_id, (countMap.get(post.category_id) || 0) + 1);
      }
    });

    const categories = data?.map(cat => ({
      ...cat,
      post_count: countMap.get(cat.id) || 0,
    })) || [];

    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const validated = categorySchema.parse(body);

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('komputeks_categories')
      .select('id')
      .eq('slug', validated.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('komputeks_categories')
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create category' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { categorySchema } from '@/schemas';

// GET /api/categories/[id] - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('komputeks_categories')
      .select('*, parent:komputeks_categories!parent_id(*)')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Get post count
    const { count } = await supabase
      .from('komputeks_posts')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)
      .eq('status', 'published');

    return NextResponse.json({ ...data, post_count: count || 0 });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    const body = await request.json();

    const validated = categorySchema.partial().parse(body);

    if (validated.slug) {
      const { data: existing } = await supabase
        .from('komputeks_categories')
        .select('id')
        .eq('slug', validated.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('komputeks_categories')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    // Check if category has posts
    const { count } = await supabase
      .from('komputeks_posts')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with posts. Move or delete the posts first.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('komputeks_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete category' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { tagSchema } from '@/schemas';

// GET /api/tags/[id] - Get a single tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('komputeks_tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Get post count
    const { count } = await supabase
      .from('komputeks_post_tags')
      .select('*, komputeks_posts!inner(status)', { count: 'exact', head: true })
      .eq('tag_id', id);

    return NextResponse.json({ ...data, post_count: count || 0 });
  } catch (error) {
    console.error('GET /api/tags/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id] - Update a tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    const body = await request.json();

    const validated = tagSchema.partial().parse(body);

    if (validated.slug) {
      const { data: existing } = await supabase
        .from('komputeks_tags')
        .select('id')
        .eq('slug', validated.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'A tag with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from('komputeks_tags')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/tags/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    // Delete post-tag associations
    await supabase.from('komputeks_post_tags').delete().eq('tag_id', id);

    const { error } = await supabase
      .from('komputeks_tags')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tags/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete tag' },
      { status: 500 }
    );
  }
}

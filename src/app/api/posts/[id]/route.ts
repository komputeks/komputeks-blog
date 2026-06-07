import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { postSchema } from '@/schemas';

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('komputeks_posts')
      .select('*, category:komputeks_categories(*), author:komputeks_users(id,name,email,avatar_url,bio), tags:komputeks_post_tags(tag:komputeks_tags(*))')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Transform tags and increment view count
    const post = {
      ...data,
      tags: data.tags?.map((t: { tag: unknown }) => t.tag).filter(Boolean) || [],
    };

    // Increment view count (fire and forget)
    supabase
      .from('komputeks_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id)
      .then(() => {});

    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    const body = await request.json();

    // Validate input (partial validation for updates)
    const validated = postSchema.partial().parse(body);

    // Check if slug is being changed and if it conflicts
    if (validated.slug) {
      const { data: existing } = await supabase
        .from('komputeks_posts')
        .select('id')
        .eq('slug', validated.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Extract tag_ids from validated data
    const { tag_ids, ...postData } = validated;

    // Set published_at if status is being changed to published
    if (postData.status === 'published') {
      (postData as Record<string, unknown>).published_at = new Date().toISOString();
    }

    // Update post
    const { data: post, error } = await supabase
      .from('komputeks_posts')
      .update({ ...postData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, category:komputeks_categories(*), author:komputeks_users(id,name,email,avatar_url)')
      .single();

    if (error) throw error;

    // Update tag associations if provided
    if (tag_ids !== undefined) {
      // Remove existing associations
      await supabase.from('komputeks_post_tags').delete().eq('post_id', id);

      // Create new associations
      if (tag_ids.length > 0) {
        const tagAssociations = tag_ids.map((tagId: string) => ({
          post_id: id,
          tag_id: tagId,
        }));

        await supabase.from('komputeks_post_tags').insert(tagAssociations);
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    // Delete post-tag associations first
    await supabase.from('komputeks_post_tags').delete().eq('post_id', id);

    // Delete comments
    await supabase.from('komputeks_comments').delete().eq('post_id', id);

    // Delete post
    const { error } = await supabase
      .from('komputeks_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete post' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { userSchema } from '@/schemas';

// GET /api/users/[id] - Get a single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from('komputeks_users')
      .select('id, email, name, avatar_url, role, bio, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get post count
    const { count } = await supabase
      .from('komputeks_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', id);

    return NextResponse.json({ ...data, post_count: count || 0 });
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;
    const body = await request.json();

    const validated = userSchema.partial().parse(body);

    const { data, error } = await supabase
      .from('komputeks_users')
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient();
    const { id } = await params;

    // Check if user has posts
    const { count } = await supabase
      .from('komputeks_posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with posts. Reassign or delete posts first.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('komputeks_users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete user' },
      { status: 500 }
    );
  }
}

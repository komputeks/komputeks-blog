import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// POST /api/auth/create-user - Create a confirmed user (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'reader' } = body;

    // Create user with admin API (auto-confirmed)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name,
        role,
      },
    });

    if (error) throw error;

    // Create user profile in database
    if (data.user) {
      await supabaseAdmin
        .from('komputeks_users')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          name,
          role,
        });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: data.user?.id,
        email: data.user?.email,
      }
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

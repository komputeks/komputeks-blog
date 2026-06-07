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

// POST /api/auth/confirm-user - Confirm a user's email (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Get user by email
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Confirm user's email
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Email confirmed' });
  } catch (error: any) {
    console.error('Confirm user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to confirm user' },
      { status: 500 }
    );
  }
}

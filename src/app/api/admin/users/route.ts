import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the requester is the admin
    if (!user || user.email?.toLowerCase() !== 'admin@drip.com') {
      console.log('Unauthorized access attempt by:', user?.email);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
       console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment');
       return NextResponse.json({ error: 'Missing service role key. Please set it in your environment variables.' }, { status: 500 });
    }

    // Initialize admin client to list users
    const { createClient: createSupabaseJs } = await import('@supabase/supabase-js');
    const adminAuthClient = createSupabaseJs(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await adminAuthClient.auth.admin.listUsers();
    
    if (error) throw error;

    const mappedUsers = data.users.map((u: any) => ({
       id: u.id,
       email: u.email,
       created_at: u.created_at,
       tryons_used: u.user_metadata?.tryons_used || 0
    }));

    return NextResponse.json({ users: mappedUsers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

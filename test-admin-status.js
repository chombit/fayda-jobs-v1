// Test script to check admin status
const { createClient } = require('@supabase/supabase-js');

// Use your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminStatus() {
  try {
    console.log('🔍 Checking admin status...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError);
      return;
    }
    
    if (!user) {
      console.error('❌ No user found - not authenticated');
      return;
    }
    
    console.log('✅ Current user:', {
      id: user.id,
      email: user.email
    });
    
    // Check admin role
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin');
    
    if (roleError) {
      console.error('❌ Error checking admin role:', roleError);
      return;
    }
    
    if (roles && roles.length > 0) {
      console.log('✅ User has admin role:', roles[0]);
    } else {
      console.log('❌ User does NOT have admin role');
      console.log('🔧 You need to assign admin role to this user');
      console.log(`📝 Run this SQL in Supabase:`);
      console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${user.id}', 'admin') ON CONFLICT (user_id, role) DO NOTHING;`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAdminStatus();

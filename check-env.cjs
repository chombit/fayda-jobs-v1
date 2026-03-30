const fs = require('fs');
const dotenv = require('dotenv');

// Simple diagnostic to check environment variables
function checkEnv() {
  const env = dotenv.config({ path: '.env' }).parsed || {};
  const envLocal = dotenv.config({ path: '.env.local' }).parsed || {};
  
  const results = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_LENGTH: env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LENGTH: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.length,
    },
    envLocal: {
      NEXT_PUBLIC_SUPABASE_URL: envLocal.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_LENGTH: envLocal.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY_LENGTH: envLocal.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.length,
    }
  };
  
  console.log(JSON.stringify(results, null, 2));
}

checkEnv();

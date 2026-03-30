import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Standard public environment variables for Next.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Validation for environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const missing = [];
  if (!SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  console.error('Supabase Client Error: Missing environment variables:', missing.join(', '));
}

// In Next.js, these are automatically injected if they start with NEXT_PUBLIC_
// We avoid top-level code that might run before environment is ready if possible,
// but for createClient it's standard.

const isBrowser = typeof window !== 'undefined';

/**
 * Supabase client for client-side operations.
 * It automatically handles auth state persistence in the browser.
 */
export const supabase = createClient<Database>(
  SUPABASE_URL || '', 
  SUPABASE_ANON_KEY || '', 
  {
    auth: {
      storage: isBrowser ? localStorage : undefined,
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
    },
  }
);

// Diagnostic logging (only in development)
if (process.env.NODE_ENV === 'development' && isBrowser) {
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.length < 10) {
    console.warn('Supabase Client Warning: API Key looks invalid or is missing. Length:', SUPABASE_ANON_KEY?.length);
  }
}
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Must be called inside a request context.
 *
 * Usage:
 *   import { createSupabaseServer } from '@/integrations/supabase/server';
 *   const supabase = await createSupabaseServer();
 */
export async function createSupabaseServer() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars – set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from Server Components where cookies can't be set.
          // This is safe to ignore when reading data.
        }
      },
    },
  });
}

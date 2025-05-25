import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient as createBrowserClient } from '@supabase/supabase-js';
import { Database } from '@/app/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cliente para el lado del servidor
export function createServerClient() {
  // No manejamos cookies en el servidor para simplificar
  return createSupabaseServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      cookies: {
        get() {
          return ''; // No manejamos cookies en el servidor
        },
        set() {
          // No hacemos nada
        },
        remove() {
          // No hacemos nada
        },
      },
    }
  );
}

// Cliente para el lado del navegador
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );
}

export async function getSession() {
  try {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUser() {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

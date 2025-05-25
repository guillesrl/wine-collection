import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/app/types/database';

type Schema = Database['public'];

// Cliente tipado
export const createClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  );
};

// Tipos para las operaciones de la base de datos
export type Tables = Schema['Tables'];
export type TableName = keyof Tables;

export type TableRow<T extends TableName> = Tables[T]['Row'];
export type TableInsert<T extends TableName> = Tables[T]['Insert'];
export type TableUpdate<T extends TableName> = Tables[T]['Update'];

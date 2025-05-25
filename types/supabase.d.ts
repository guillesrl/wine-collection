import { Database } from '@/app/types/database';

declare global {
  type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

  interface Window {
    ENV: {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }

  type Tables = Database['public']['Tables']
  type TableName = keyof Tables

  type TableRow<T extends TableName> = Tables[T]['Row']
  type TableInsert<T extends TableName> = Tables[T]['Insert']
  type TableUpdate<T extends TableName> = Tables[T]['Update']

  // Helper types for Supabase client
  type SupabaseTable<T extends TableName> = {
    select: (columns?: string) => any;
    insert: (values: TableInsert<T> | TableInsert<T>[], options?: { returning?: 'minimal' | 'representation' }) => any;
    update: (values: TableUpdate<T>, options?: { returning?: 'minimal' | 'representation' }) => any;
    delete: () => any;
  };

  interface SupabaseClient {
    from<T extends TableName>(table: T): SupabaseTable<T>;
  }
}

// This export is needed for the file to be treated as a module
export {};

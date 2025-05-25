import { Database } from '@/app/types/database';

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

export type TableRow<T extends TableName> = Tables[T]['Row'];
export type TableInsert<T extends TableName> = Tables[T]['Insert'];
export type TableUpdate<T extends TableName> = Tables[T]['Update'];

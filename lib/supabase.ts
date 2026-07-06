import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface CategoryRow {
  id: number;
  type: 'yarn' | 'fabric';
  slug: string;
  name: Record<string, string>;
  image: string | null;
  gradient: string | null;
  created_at: string;
}

export interface ProductRow {
  id: number;
  category_id: number | null;
  type: 'yarn' | 'fabric';
  slug: string;
  name: Record<string, string>;
  description: Record<string, string> | null;
  image: string | null;
  composition: Record<string, string> | null;
  width: string | null;
  weight: string | null;
  available_counts: string[] | null;
  collection: 'summer' | 'winter' | null;
  is_available: boolean;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  username: string | null;
  phone: string | null;
  company_name: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

export type PriceRequestStatus = 'pending' | 'priced' | 'shipped' | 'cancelled';

export interface PriceRequestRow {
  id: string;
  user_id: string | null;
  username: string | null;
  company_name: string | null;
  phone: string | null;
  email: string | null;
  product_name: string | null;
  variation_value: string | null;
  requested_manufacturer: string | null;
  language: string | null;
  status: PriceRequestStatus;
  created_at: string;
}

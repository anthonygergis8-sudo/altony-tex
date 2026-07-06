import { supabase } from '@/lib/supabase';
import type { ProfileRow, PriceRequestRow, PriceRequestStatus, ProductRow } from '@/lib/supabase';
import { GoogleSheetsService } from './google-sheets-service';

export type { PriceRequestStatus } from '@/lib/supabase';

export const STATUS_LABELS: Record<PriceRequestStatus, string> = {
  pending: 'statusPending',
  priced: 'statusPriced',
  shipped: 'statusShipped',
  cancelled: 'statusCancelled',
};

export const STATUS_COLORS: Record<PriceRequestStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  priced: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  shipped: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export const AdminService = {
  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [customersRes, todayRes, pendingRes, shippedRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('price_requests').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
      supabase.from('price_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('price_requests').select('id', { count: 'exact', head: true }).eq('status', 'shipped'),
    ]);

    return {
      totalCustomers: customersRes.count || 0,
      totalRequestsToday: todayRes.count || 0,
      pendingRequests: pendingRes.count || 0,
      completedRequests: shippedRes.count || 0,
    };
  },

  async getPriceRequests(): Promise<PriceRequestRow[]> {
    const { data, error } = await supabase
      .from('price_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as PriceRequestRow[];
  },

  async updateRequestStatus(id: string, status: PriceRequestStatus, request?: PriceRequestRow) {
    const { error } = await supabase
      .from('price_requests')
      .update({ status })
      .eq('id', id);
    if (error) return { ok: false, message: error.message };

    if (request) {
      GoogleSheetsService.sendPriceRequest({
        username: request.username || '',
        phone: request.phone || '',
        companyName: request.company_name || '',
        productName: request.product_name || '',
        variationValue: request.variation_value || '',
        requestedManufacturer: request.requested_manufacturer || '',
        language: (request.language as 'ar' | 'en' | 'zh') || 'ar',
      }).catch(() => {});
    }

    return { ok: true, message: 'Status updated' };
  },

  async getProducts(): Promise<ProductRow[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('type', { ascending: true })
      .order('id', { ascending: true });
    if (error || !data) return [];
    return data as ProductRow[];
  },

  async toggleProductAvailability(id: number, isAvailable: boolean) {
    const { error } = await supabase
      .from('products')
      .update({ is_available: isAvailable })
      .eq('id', id);
    return !error;
  },

  async getCustomers(): Promise<ProfileRow[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data as ProfileRow[];
  },

  async createPriceRequest(data: {
    username: string;
    companyName: string;
    phone: string;
    email: string;
    productName: string;
    variationValue: string;
    requestedManufacturer: string;
    language: string;
  }) {
    const { data: authData } = await supabase.auth.getUser();
    const { error } = await supabase.from('price_requests').insert({
      user_id: authData.user?.id || null,
      username: data.username,
      company_name: data.companyName,
      phone: data.phone,
      email: data.email,
      product_name: data.productName,
      variation_value: data.variationValue,
      requested_manufacturer: data.requestedManufacturer,
      language: data.language,
      status: 'pending',
    });
    return !error;
  },
};

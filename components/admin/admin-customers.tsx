'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AdminService } from '@/lib/services/admin-service';
import type { ProfileRow } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminCustomers() {
  const { t } = useI18n();
  const [customers, setCustomers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await AdminService.getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-neutral-500">
        <Users className="h-12 w-12 mb-3 opacity-50" />
        <p>{t.admin.noCustomers}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#111]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/50">
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.customerName}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.company}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.phone}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.email}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.date}</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <motion.tr
              key={customer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-white">
                    {customer.username || '—'}
                  </div>
                  {customer.role === 'admin' && (
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={`mt-1 text-xs ${
                    customer.role === 'admin'
                      ? 'bg-amber-500/15 text-amber-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {customer.role}
                </Badge>
              </td>
              <td className="p-4 text-neutral-300">{customer.company_name || '—'}</td>
              <td className="p-4 text-neutral-300" dir="ltr">{customer.phone || '—'}</td>
              <td className="p-4 text-neutral-300" dir="ltr">{customer.id.slice(0, 8)}...</td>
              <td className="p-4 text-neutral-400 text-xs">
                {new Date(customer.created_at).toLocaleDateString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

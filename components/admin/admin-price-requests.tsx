'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AdminService, STATUS_LABELS, STATUS_COLORS } from '@/lib/services/admin-service';
import type { PriceRequestRow, PriceRequestStatus } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Loader2, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminPriceRequests() {
  const { t, language } = useI18n();
  const [requests, setRequests] = useState<PriceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await AdminService.getPriceRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: PriceRequestStatus, request: PriceRequestRow) => {
    setUpdatingId(id);
    await AdminService.updateRequestStatus(id, status, request);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setUpdatingId(null);
  };

  const handleWhatsApp = (request: PriceRequestRow) => {
    const username = request.username || '';
    const productName = request.product_name || '';
    const phone = (request.phone || '').replace(/[^0-9]/g, '');

    const message =
      language === 'ar'
        ? `أهلاً بك أ. ${username} في شركة AlTony Tex. 🏭\nبخصوص استفساركم عن: ${productName}\nالسعر الخاص بكم هو: ......\nفي انتظار تأكيد سيادتكم.`
        : `Welcome ${username} to AlTony Tex. 🏭\nRegarding your inquiry about: ${productName}\nYour special price is: ......\nAwaiting your confirmation.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-neutral-500">
        <Inbox className="h-12 w-12 mb-3 opacity-50" />
        <p>{t.admin.noRequests}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#111]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/50">
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.customerName}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.phone}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.product}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.variation}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.manufacturer}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.status}</th>
            <th className="text-right p-4 font-semibold text-neutral-300">{t.admin.actions}</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <motion.tr
              key={request.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors"
            >
              <td className="p-4">
                <div className="font-medium text-white">{request.username || '—'}</div>
                <div className="text-xs text-neutral-500">{request.company_name || ''}</div>
              </td>
              <td className="p-4 text-neutral-300" dir="ltr">{request.phone || '—'}</td>
              <td className="p-4 text-neutral-300">{request.product_name || '—'}</td>
              <td className="p-4 text-neutral-300">{request.variation_value || '—'}</td>
              <td className="p-4 text-neutral-300">{request.requested_manufacturer || '—'}</td>
              <td className="p-4">
                <Select
                  value={request.status}
                  onValueChange={(value) =>
                    handleStatusChange(request.id, value as PriceRequestStatus, request)
                  }
                  disabled={updatingId === request.id}
                >
                  <SelectTrigger className={`w-[140px] border ${STATUS_COLORS[request.status]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t.admin.statusPending}</SelectItem>
                    <SelectItem value="priced">{t.admin.statusPriced}</SelectItem>
                    <SelectItem value="shipped">{t.admin.statusShipped}</SelectItem>
                    <SelectItem value="cancelled">{t.admin.statusCancelled}</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-4">
                <Button
                  size="sm"
                  onClick={() => handleWhatsApp(request)}
                  className="bg-green-500 hover:bg-green-600 text-white gap-1.5"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t.admin.whatsappQuote}
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

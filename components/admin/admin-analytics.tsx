'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AdminService } from '@/lib/services/admin-service';
import { Users, ClipboardList, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
  totalCustomers: number;
  totalRequestsToday: number;
  pendingRequests: number;
  completedRequests: number;
}

export function AdminAnalytics() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await AdminService.getStats();
    setStats(data);
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <div className="animate-pulse text-neutral-500">Loading...</div>
      </div>
    );
  }

  const cards = [
    {
      label: t.admin.totalCustomers,
      value: stats.totalCustomers,
      icon: Users,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    {
      label: t.admin.totalRequestsToday,
      value: stats.totalRequestsToday,
      icon: TrendingUp,
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    {
      label: t.admin.pendingRequests,
      value: stats.pendingRequests,
      icon: Clock,
      gradient: 'from-yellow-500/20 to-amber-500/20',
      iconColor: 'text-yellow-400',
      border: 'border-yellow-500/20',
    },
    {
      label: t.admin.completedRequests,
      value: stats.completedRequests,
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 to-green-500/20',
      iconColor: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} p-6`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-black/30 ${card.iconColor}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {card.value}
          </div>
          <div className="text-sm text-neutral-400">
            {card.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

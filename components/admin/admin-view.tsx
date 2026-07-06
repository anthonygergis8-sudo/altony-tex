'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useI18n } from '@/lib/i18n/context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, ClipboardList, Package, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminAnalytics } from './admin-analytics';
import { AdminPriceRequests } from './admin-price-requests';
import { AdminProducts } from './admin-products';
import { AdminCustomers } from './admin-customers';

type AdminTab = 'analytics' | 'requests' | 'products' | 'customers';

export function AdminView() {
  const { user, isAdmin, isLoading } = useAuth();
  const { t, isRTL } = useI18n();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      setDenied(true);
      toast({
        title: t.admin.accessDenied,
        variant: 'destructive',
      });
    }
  }, [isLoading, user, isAdmin, t.admin.accessDenied, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (denied || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.admin.accessDenied}</h1>
          <Button
            onClick={() => window.location.href = '/'}
            className="mt-6 bg-amber-500 text-black hover:bg-amber-600"
          >
            {t.admin.backToApp}
          </Button>
        </motion.div>
      </div>
    );
  }

  const tabs: { key: AdminTab; icon: typeof BarChart3; label: string }[] = [
    { key: 'analytics', icon: BarChart3, label: t.admin.analytics },
    { key: 'requests', icon: ClipboardList, label: t.admin.priceRequests },
    { key: 'products', icon: Package, label: t.admin.products },
    { key: 'customers', icon: Users, label: t.admin.customers },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#111] border-b border-neutral-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = '/'}
              className="text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{t.admin.dashboard}</h1>
              <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-2">
            {tabs.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50 border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'requests' && <AdminPriceRequests />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'customers' && <AdminCustomers />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

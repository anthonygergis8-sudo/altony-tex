'use client';

import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Button } from '@/components/ui/button';
import { Layers, Shirt, Users } from 'lucide-react';
import { motion } from 'framer-motion';

type TabKey = 'yarns' | 'fabrics' | 'about';

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t, isRTL } = useI18n();
  const { mode } = useTheme();

  const tabs: { key: TabKey; icon: typeof Layers; labelKey: 'yarns' | 'fabrics' | 'aboutUs' }[] = [
    { key: 'yarns', icon: Layers, labelKey: 'yarns' },
    { key: 'fabrics', icon: Shirt, labelKey: 'fabrics' },
    { key: 'about', icon: Users, labelKey: 'aboutUs' },
  ];

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        mode === 'dark'
          ? 'bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800'
          : 'bg-white/95 backdrop-blur-xl border-t border-neutral-200'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-screen-xl mx-auto flex justify-around items-center h-16 px-4">
        {tabs.map(({ key, icon: Icon, labelKey }) => {
          const isActive = activeTab === key;
          return (
            <motion.div key={key} className="relative flex-1">
              <Button
                variant="ghost"
                className={`w-full flex flex-col items-center gap-1 py-2 h-auto relative ${
                  mode === 'dark'
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                } ${isActive ? (mode === 'dark' ? 'text-white' : 'text-neutral-900') : ''}`}
                onClick={() => onTabChange(key)}
              >
                <motion.div
                  className="relative"
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl ${
                        mode === 'dark'
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20'
                          : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
                      }`}
                      style={{ margin: -6 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-5 w-5 relative z-10 ${isActive ? (mode === 'dark' ? 'text-amber-400' : 'text-emerald-600') : ''}`} />
                </motion.div>
                <span
                  className={`text-xs font-medium relative z-10 ${
                    isActive
                      ? mode === 'dark'
                        ? 'text-white'
                        : 'text-neutral-900'
                      : ''
                  }`}
                >
                  {t.navigation[labelKey]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className={`absolute top-0 w-1 h-1 rounded-full ${
                      mode === 'dark' ? 'bg-amber-400' : 'bg-emerald-600'
                    }`}
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}

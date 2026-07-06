'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useTheme } from '@/lib/theme/context';
import { useI18n } from '@/lib/i18n/context';
import { Header } from './header';
import { BottomNav } from './bottom-nav';
import { Footer } from './footer';
import { YarnsView } from '@/components/yarns/yarns-view';
import { FabricsView } from '@/components/fabrics/fabrics-view';
import { AboutView } from '@/components/about/about-view';
import { motion, AnimatePresence } from 'framer-motion';

type TabKey = 'yarns' | 'fabrics' | 'about';

interface MainLayoutProps {
  onNavigateAdmin?: () => void;
}

export function MainLayout({ onNavigateAdmin }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('yarns');
  const { mode } = useTheme();
  const { isRTL } = useI18n();

  const tabVariants = {
    initial: { opacity: 0, x: isRTL ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 20 : -20 },
  };

  return (
    <div
      className={`min-h-screen ${
        mode === 'dark' ? 'bg-[#121212]' : 'bg-[#F9F9F7]'
      } transition-colors duration-500`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Header onNavigateAdmin={onNavigateAdmin} />

      <main className="pb-20 pt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'yarns' && (
            <motion.div
              key="yarns"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <YarnsView />
            </motion.div>
          )}
          {activeTab === 'fabrics' && (
            <motion.div
              key="fabrics"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <FabricsView />
            </motion.div>
          )}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <AboutView />
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

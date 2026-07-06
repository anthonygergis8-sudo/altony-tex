'use client';

import { YarnCategoryInfo } from '@/lib/services/types';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface YarnCategoryCardProps {
  category: YarnCategoryInfo;
  index: number;
  onClick: () => void;
}

export function YarnCategoryCard({ category, index, onClick }: YarnCategoryCardProps) {
  const { language, isRTL } = useI18n();
  const { mode } = useTheme();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
        mode === 'dark'
          ? 'bg-neutral-900/80 border border-neutral-800/50'
          : 'bg-white border border-neutral-200'
      } shadow-lg transition-shadow hover:shadow-xl`}
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}
        />
        <img
          src={category.image}
          alt={category.name[language]}
          className="w-full h-full object-cover opacity-90"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            mode === 'dark'
              ? 'from-neutral-900 via-neutral-900/50 to-transparent'
              : 'from-white/90 via-white/30 to-transparent'
          }`}
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h3
              className={`text-lg font-bold ${
                mode === 'dark' ? 'text-white' : 'text-neutral-800'
              }`}
            >
              {category.name[language]}
            </h3>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`h-0.5 mt-1 rounded-full ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
              style={{ width: 40 }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-2 rounded-full ${
              mode === 'dark'
                ? 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20'
            } transition-colors`}
          >
            <ArrowIcon className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

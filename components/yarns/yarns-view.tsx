'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { YarnService } from '@/lib/services/yarn-service';
import { YarnCategoryInfo, YarnCategory } from '@/lib/services/types';
import { YarnCategoryCard } from './yarn-category-card';
import { YarnDetailSheet } from './yarn-detail-sheet';
import { motion } from 'framer-motion';
import { Layers, Loader2 } from 'lucide-react';

export function YarnsView() {
  const { t, language } = useI18n();
  const { mode } = useTheme();
  const [categories, setCategories] = useState<YarnCategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<YarnCategory | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const data = await YarnService.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleCategoryClick = (categoryId: YarnCategory) => {
    setSelectedCategory(categoryId);
    setSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2
            className={`h-8 w-8 ${mode === 'dark' ? 'text-amber-500' : 'text-emerald-500'}`}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div
          className={`p-2.5 rounded-xl ${
            mode === 'dark'
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
              : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
          }`}
        >
          <Layers
            className={`h-5 w-5 ${
              mode === 'dark' ? 'text-amber-400' : 'text-emerald-600'
            }`}
          />
        </div>
        <div>
          <h1
            className={`text-xl font-bold ${
              mode === 'dark' ? 'text-white' : 'text-neutral-800'
            }`}
          >
            {t.yarns.title}
          </h1>
          <p
            className={`text-sm ${
              mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {t.yarns.selectCategory}
          </p>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <YarnCategoryCard
            key={category.id}
            category={category}
            index={index}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>

      {/* Detail Sheet */}
      <YarnDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        categoryId={selectedCategory}
      />
    </div>
  );
}

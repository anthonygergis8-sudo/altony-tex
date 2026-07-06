'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { YarnService } from '@/lib/services/yarn-service';
import { YarnCategoryInfo, YarnCategory, YarnType } from '@/lib/services/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Check, Loader2, Building2 } from 'lucide-react';
import { openWhatsApp } from '@/lib/utils/whatsapp';
import { GoogleSheetsService } from '@/lib/services/google-sheets-service';
import { useAuth } from '@/lib/auth/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface YarnDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: YarnCategory | null;
}

export function YarnDetailSheet({ open, onOpenChange, categoryId }: YarnDetailSheetProps) {
  const { t, language, isRTL } = useI18n();
  const { mode } = useTheme();
  const { user } = useAuth();
  const [category, setCategory] = useState<YarnCategoryInfo | null>(null);
  const [yarns, setYarns] = useState<YarnType[]>([]);
  const [counts, setCounts] = useState<string[]>([]);
  const [selectedCount, setSelectedCount] = useState<string | null>(null);
  const [requestedManufacturer, setRequestedManufacturer] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceRequesting, setPriceRequesting] = useState(false);

  useEffect(() => {
    if (open && categoryId) {
      loadData();
    } else {
      setSelectedCount(null);
      setRequestedManufacturer('');
    }
  }, [open, categoryId]);

  const loadData = async () => {
    if (!categoryId) return;
    setLoading(true);
    const [categoryData, yarnsData, countsData] = await Promise.all([
      YarnService.getCategoryById(categoryId),
      YarnService.getYarnsByCategory(categoryId),
      YarnService.getAvailableCounts(categoryId),
    ]);
    setCategory(categoryData);
    setYarns(yarnsData);
    setCounts(countsData);
    setLoading(false);
  };

  const handleWhatsAppRequest = async () => {
    if (!categoryId || !selectedCount) return;

    const fullProductName = category?.name[language] || t.yarns.categories[categoryId] || categoryId;
    const productName = fullProductName;
    const username = user?.username || user?.name || '';
    const companyName = user?.companyName || '';
    const manufacturerName = requestedManufacturer.trim();

    setPriceRequesting(true);
    let sheetsResult: { ok: boolean; message: string } = { ok: false, message: '' };
    try {
      sheetsResult = await GoogleSheetsService.sendPriceRequest({
        username,
        phone: user?.phone || '',
        companyName,
        productName,
        variationValue: selectedCount,
        requestedManufacturer: manufacturerName,
        language,
      });
    } catch (error) {
      sheetsResult = { ok: false, message: error instanceof Error ? error.message : String(error) };
    } finally {
      setPriceRequesting(false);
    }
    alert(sheetsResult.message);

    const messageTemplate = t.yarns.whatsappMessage;
    const message = messageTemplate
      .replace('{username}', username)
      .replace('{company}', companyName)
      .replace('{product}', productName)
      .replace('{variation}', selectedCount)
      .replace('{manufacturer}', manufacturerName);

    openWhatsApp(message);
  };

  const getCategoryName = () => {
    if (!categoryId) return '';
    return category?.name[language] || t.yarns.categories[categoryId] || categoryId;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRTL ? 'left' : 'right'}
        className={`w-full sm:max-w-md ${
          mode === 'dark'
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-200'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2
                className={`h-8 w-8 ${mode === 'dark' ? 'text-amber-500' : 'text-emerald-500'}`}
              />
            </motion.div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle
                className={`${mode === 'dark' ? 'text-white' : 'text-neutral-800'}`}
              >
                {getCategoryName()}
              </SheetTitle>
              <SheetDescription>{t.yarns.selectCount}</SheetDescription>
            </SheetHeader>

            {/* Category Image */}
            {category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="my-4 rounded-xl overflow-hidden relative h-32 bg-neutral-200 dark:bg-neutral-800"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}
                />
                <img
                  src={category.image}
                  alt={getCategoryName()}
                  className="w-full h-full object-cover opacity-90"
                />
              </motion.div>
            )}

            {/* Count Selection */}
            <div className="my-6">
              <h3
                className={`text-sm font-semibold mb-3 ${
                  mode === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {t.yarns.selectCount}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <AnimatePresence>
                  {counts.map((count, index) => (
                    <motion.div
                      key={count}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Button
                        variant={selectedCount === count ? 'default' : 'outline'}
                        className={`w-full relative ${
                          selectedCount === count
                            ? mode === 'dark'
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                            : mode === 'dark'
                            ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                        onClick={() => setSelectedCount(count)}
                      >
                        {count}
                        {selectedCount === count && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 p-0.5 rounded-full bg-green-500"
                          >
                            <Check className="h-2.5 w-2.5 text-white" />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Yarn Details if available */}
            {yarns.length > 0 && (
              <div className="my-4">
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    mode === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Available Types
                </h3>
                {yarns.map((yarn, index) => (
                  <motion.div
                    key={yarn.id}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl mb-3 ${
                      mode === 'dark'
                        ? 'bg-neutral-800/50 border border-neutral-700/50'
                        : 'bg-neutral-50 border border-neutral-200'
                    }`}
                  >
                    <h4
                      className={`font-semibold ${
                        mode === 'dark' ? 'text-white' : 'text-neutral-800'
                      }`}
                    >
                      {yarn.name[language]}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}
                    >
                      {yarn.description[language]}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {yarn.availableCounts.map((c) => (
                        <Badge
                          key={c}
                          variant="secondary"
                          className={`text-xs ${
                            mode === 'dark'
                              ? 'bg-neutral-700 text-neutral-300'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Requested Manufacturer Input */}
            <div className="my-6">
              <Label
                htmlFor="requestedManufacturer"
                className={`text-sm font-semibold mb-3 block ${
                  mode === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}
              >
                {t.yarns.requestedManufacturer}
              </Label>
              <div className="relative">
                <Building2
                  className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 ${
                    isRTL ? 'right-3' : 'left-3'
                  } ${mode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}
                />
                <Input
                  id="requestedManufacturer"
                  type="text"
                  value={requestedManufacturer}
                  onChange={(e) => setRequestedManufacturer(e.target.value)}
                  placeholder={t.yarns.requestedManufacturerPlaceholder}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} ${
                    mode === 'dark'
                      ? 'bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500'
                      : 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400'
                  }`}
                />
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-inherit to-transparent pt-20">
              <Button
                disabled={!selectedCount || priceRequesting}
                onClick={handleWhatsAppRequest}
                className={`w-full h-12 font-semibold gap-2 ${
                  selectedCount && !priceRequesting
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : mode === 'dark'
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {priceRequesting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <MessageCircle className="h-5 w-5" />
                )}
                {t.common.requestPrice}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

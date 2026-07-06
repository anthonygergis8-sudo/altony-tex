'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { FabricService } from '@/lib/services/fabric-service';
import { FabricCollectionInfo, FabricCollection, FabricType } from '@/lib/services/fabric-service';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { openWhatsApp } from '@/lib/utils/whatsapp';
import { GoogleSheetsService } from '@/lib/services/google-sheets-service';
import { useAuth } from '@/lib/auth/context';
import { extractManufacturer, stripManufacturer } from '@/lib/utils/manufacturer';

export function FabricsView() {
  const { t, language, isRTL } = useI18n();
  const { mode } = useTheme();
  const { user } = useAuth();
  const [collections, setCollections] = useState<FabricCollectionInfo[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<FabricCollection | null>(null);
  const [fabrics, setFabrics] = useState<FabricType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fabricsLoading, setFabricsLoading] = useState(false);
  const [priceRequestingId, setPriceRequestingId] = useState<string | null>(null);

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      loadFabrics(selectedCollection);
    }
  }, [selectedCollection]);

  const loadCollections = async () => {
    setLoading(true);
    const data = await FabricService.getCollections();
    setCollections(data);
    if (data.length > 0) {
      setSelectedCollection(data[0].id);
    }
    setLoading(false);
  };

  const loadFabrics = async (collectionId: FabricCollection) => {
    setFabricsLoading(true);
    const data = await FabricService.getFabricsByCollection(collectionId);
    setFabrics(data);
    setFabricsLoading(false);
  };

  const handleWhatsAppRequest = async (fabric: FabricType) => {
    const fullProductName = fabric.name[language];
    const manufacturerName = extractManufacturer(fullProductName, language);
    const productName = stripManufacturer(fullProductName) || fullProductName;
    const variation = fabric.composition[language] || fabric.width || '';
    const username = user?.username || user?.name || '';
    const companyName = user?.companyName || '';

    setPriceRequestingId(fabric.id);
    let sheetsResult: { ok: boolean; message: string } = { ok: false, message: '' };
    try {
      sheetsResult = await GoogleSheetsService.sendPriceRequest({
        username,
        phone: user?.phone || '',
        companyName,
        productName,
        variationValue: variation,
        requestedManufacturer: manufacturerName,
        language,
      });
    } catch (error) {
      sheetsResult = { ok: false, message: error instanceof Error ? error.message : String(error) };
    } finally {
      setPriceRequestingId(null);
    }
    alert(sheetsResult.message);

    const messageTemplate = t.fabrics.whatsappMessage;
    const message = messageTemplate
      .replace('{username}', username)
      .replace('{company}', companyName)
      .replace('{product}', productName)
      .replace('{variation}', variation)
      .replace('{manufacturer}', manufacturerName);
    openWhatsApp(message);
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
          <Shirt
            className={`h-5 w-5 ${mode === 'dark' ? 'text-amber-400' : 'text-emerald-600'}`}
          />
        </div>
        <div>
          <h1
            className={`text-xl font-bold ${
              mode === 'dark' ? 'text-white' : 'text-neutral-800'
            }`}
          >
            {t.fabrics.title}
          </h1>
          <p
            className={`text-sm ${
              mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {t.fabrics.selectCollection}
          </p>
        </div>
      </motion.div>

      {/* Collection Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={selectedCollection === collection.id ? 'default' : 'outline'}
              className={`whitespace-nowrap ${
                selectedCollection === collection.id
                  ? mode === 'dark'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  : mode === 'dark'
                  ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
              onClick={() => setSelectedCollection(collection.id)}
            >
              {collection.name[language]}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Fabrics Grid */}
      <AnimatePresence mode="wait">
        {fabricsLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-[40vh]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2
                className={`h-6 w-6 ${mode === 'dark' ? 'text-amber-500' : 'text-emerald-500'}`}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key={selectedCollection || 'fabrics'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {fabrics.map((fabric, index) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden ${
                  mode === 'dark'
                    ? 'bg-neutral-900/80 border border-neutral-800/50'
                    : 'bg-white border border-neutral-200'
                } shadow-lg`}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={fabric.image}
                    alt={fabric.name[language]}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      mode === 'dark'
                        ? 'from-neutral-900 via-neutral-900/30 to-transparent'
                        : 'from-white/80 via-transparent to-transparent'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className={`text-lg font-bold ${
                      mode === 'dark' ? 'text-white' : 'text-neutral-800'
                    }`}
                  >
                    {fabric.name[language]}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {fabric.description[language]}
                  </p>

                  {/* Specs */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        mode === 'dark'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {fabric.composition[language]}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        mode === 'dark'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {fabric.width}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        mode === 'dark'
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {fabric.weight}
                    </Badge>
                  </div>

                  {/* CTA */}
                  <Button
                    disabled={priceRequestingId === fabric.id}
                    className={`w-full mt-4 h-11 gap-2 ${
                      mode === 'dark'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    }`}
                    onClick={() => handleWhatsAppRequest(fabric)}
                  >
                    {priceRequestingId === fabric.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                    {t.common.requestPrice}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

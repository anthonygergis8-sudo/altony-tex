'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AdminService } from '@/lib/services/admin-service';
import type { ProductRow } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Shirt, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminProducts() {
  const { t, language } = useI18n();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await AdminService.getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleToggle = async (id: number, current: boolean) => {
    setTogglingId(id);
    const success = await AdminService.toggleProductAvailability(id, !current);
    if (success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_available: !current } : p))
      );
    }
    setTogglingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-neutral-500">
        <Package className="h-12 w-12 mb-3 opacity-50" />
        <p>{t.admin.noProducts}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`rounded-2xl border p-4 bg-[#111] ${
            product.is_available
              ? 'border-neutral-800'
              : 'border-red-900/30 opacity-60'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name[language] || product.slug}
                  className={`w-full h-full object-cover ${!product.is_available ? 'grayscale' : ''}`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {product.type === 'yarn' ? (
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <Shirt className="h-3.5 w-3.5 text-blue-400" />
                )}
                <span className="text-xs text-neutral-500 uppercase">{product.type}</span>
              </div>
              <h3 className="font-semibold text-white text-sm truncate">
                {product.name[language] || product.slug}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {product.collection ? `· ${product.collection}` : ''}
                {product.width ? ` · ${product.width}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800/50">
            <div>
              {product.is_available ? (
                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                  {t.admin.available}
                </Badge>
              ) : (
                <Badge className="bg-red-500/15 text-red-400 border-red-500/30">
                  {t.admin.outOfStock}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {togglingId === product.id && (
                <Loader2 className="h-3.5 w-3.5 text-neutral-500 animate-spin" />
              )}
              <Switch
                checked={product.is_available}
                onCheckedChange={() => handleToggle(product.id, product.is_available)}
                disabled={togglingId === product.id}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

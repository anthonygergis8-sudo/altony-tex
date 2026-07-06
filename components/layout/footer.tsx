'use client';

import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Logo } from '@/components/brand/logo';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const { t, isRTL } = useI18n();
  const { mode } = useTheme();

  const contactItems = [
    { icon: MapPin, value: t.about.addressText },
    { icon: Phone, value: t.about.phoneNumbers },
    { icon: Mail, value: t.about.emailAddress },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`border-t ${
        mode === 'dark'
          ? 'bg-neutral-900/60 border-neutral-800'
          : 'bg-white/60 border-neutral-200'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <Logo size="sm" showText />
          <p
            className={`text-xs text-center max-w-sm ${
              mode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            {t.footer.tagline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {contactItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 text-xs ${
                  mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                <item.icon
                  className={`h-3.5 w-3.5 ${
                    mode === 'dark' ? 'text-amber-400' : 'text-emerald-600'
                  }`}
                />
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          <div
            className={`w-full pt-4 border-t text-center ${
              mode === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <p
              className={`text-xs ${
                mode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              &copy; {new Date().getFullYear()} {t.common.appNameFull} &mdash; {t.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

'use client';

import { useI18n } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { Logo } from '@/components/brand/logo';
import { motion } from 'framer-motion';
import { Users, Building, Target, Star, MapPin, Phone, Mail } from 'lucide-react';

export function AboutView() {
  const { t, isRTL } = useI18n();
  const { mode } = useTheme();

  const sections = [
    {
      icon: Building,
      title: t.about.ourStory,
      content: t.about.storyText,
      gradient:
        mode === 'dark'
          ? 'from-amber-500/20 to-orange-500/20'
          : 'from-emerald-500/10 to-teal-500/10',
      accent: mode === 'dark' ? 'text-amber-400' : 'text-emerald-600',
    },
    {
      icon: Target,
      title: t.about.ourMission,
      content: t.about.missionText,
      gradient:
        mode === 'dark'
          ? 'from-emerald-500/20 to-teal-500/20'
          : 'from-green-500/10 to-emerald-500/10',
      accent: mode === 'dark' ? 'text-emerald-400' : 'text-green-600',
    },
    {
      icon: Star,
      title: t.about.ourValues,
      content: t.about.valuesText,
      gradient:
        mode === 'dark'
          ? 'from-amber-500/20 to-yellow-500/20'
          : 'from-amber-500/10 to-yellow-500/10',
      accent: mode === 'dark' ? 'text-amber-400' : 'text-amber-600',
    },
  ];

  const contactItems = [
    {
      icon: MapPin,
      label: t.about.address,
      value: t.about.addressText,
      href: 'https://maps.google.com/?q=Shubra+El+Kheima',
    },
    {
      icon: Phone,
      label: t.about.phone,
      value: t.about.phoneNumbers,
      href: 'tel:+201201121119',
    },
    {
      icon: Mail,
      label: t.about.email,
      value: t.about.emailAddress,
      href: 'mailto:sales@altonytex.com',
    },
  ];

  return (
    <div className="px-4 py-4 max-w-screen-xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div
          className={`p-2.5 rounded-xl ${
            mode === 'dark'
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
              : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
          }`}
        >
          <Users
            className={`h-5 w-5 ${mode === 'dark' ? 'text-amber-400' : 'text-emerald-600'}`}
          />
        </div>
        <div>
          <h1
            className={`text-xl font-bold ${
              mode === 'dark' ? 'text-white' : 'text-neutral-800'
            }`}
          >
            {t.about.title}
          </h1>
          <p
            className={`text-sm ${
              mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {t.about.companyProfile}
          </p>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl overflow-hidden mb-6 ${
          mode === 'dark'
            ? 'bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 border border-neutral-700/50'
            : 'bg-gradient-to-br from-white to-neutral-50 border border-neutral-200'
        }`}
      >
        <div className="relative p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <Logo size="lg" animate />
          </motion.div>

          <h2
            className={`text-2xl font-bold mb-2 ${
              mode === 'dark'
                ? 'bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 bg-clip-text text-transparent'
            }`}
          >
            {t.common.appNameFull}
          </h2>

          <p
            className={`text-sm max-w-md mx-auto ${
              mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {t.footer.tagline}
          </p>
        </div>
      </motion.div>

      {/* Info Sections */}
      {sections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className={`rounded-2xl overflow-hidden mb-4 ${
            mode === 'dark'
              ? 'bg-neutral-900/80 border border-neutral-800/50'
              : 'bg-white border border-neutral-200'
          }`}
        >
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-xl bg-gradient-to-br ${section.gradient}`}
              >
                <section.icon className={`h-5 w-5 ${section.accent}`} />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  mode === 'dark' ? 'text-white' : 'text-neutral-800'
                }`}
              >
                {section.title}
              </h3>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                mode === 'dark' ? 'text-neutral-300' : 'text-neutral-600'
              }`}
            >
              {section.content}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl overflow-hidden ${
          mode === 'dark'
            ? 'bg-neutral-900/80 border border-neutral-800/50'
            : 'bg-white border border-neutral-200'
        }`}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-xl ${
                mode === 'dark'
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                  : 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
              }`}
            >
              <MapPin
                className={`h-5 w-5 ${
                  mode === 'dark' ? 'text-amber-400' : 'text-emerald-600'
                }`}
              />
            </div>
            <h3
              className={`text-lg font-semibold ${
                mode === 'dark' ? 'text-white' : 'text-neutral-800'
              }`}
            >
              {t.about.contactUs}
            </h3>
          </div>

          <div className="space-y-4">
            {contactItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.icon === MapPin ? '_blank' : undefined}
                rel={item.icon === MapPin ? 'noopener noreferrer' : undefined}
                whileHover={{ x: isRTL ? -4 : 4 }}
                className="flex items-start gap-3 group cursor-pointer"
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    mode === 'dark'
                      ? 'bg-neutral-800 group-hover:bg-amber-500/20'
                      : 'bg-neutral-100 group-hover:bg-emerald-500/10'
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 transition-colors ${
                      mode === 'dark'
                        ? 'text-neutral-400 group-hover:text-amber-400'
                        : 'text-neutral-500 group-hover:text-emerald-600'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      mode === 'dark' ? 'text-white' : 'text-neutral-800'
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`text-sm break-words ${
                      mode === 'dark'
                        ? 'text-neutral-400 group-hover:text-amber-300'
                        : 'text-neutral-500 group-hover:text-emerald-600'
                    } transition-colors`}
                  >
                    {item.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

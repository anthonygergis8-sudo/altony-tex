'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, dictionaries } from './dictionaries';

type Dictionary = typeof dictionaries.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language | null;
      if (saved && ['ar', 'en', 'zh'].includes(saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

  const t = dictionaries[language] as Dictionary;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

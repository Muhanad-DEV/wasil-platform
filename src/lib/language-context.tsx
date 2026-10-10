'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language, t as translateHelper, formatCurrency as formatCurHelper, formatDate as formatDateHelper } from './i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: keyof typeof translations) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('wasil_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLangState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
    } else {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('wasil_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isRtl = lang === 'ar';

  const t = (key: keyof typeof translations) => translateHelper(key, lang);
  const formatCurrency = (amount: number) => formatCurHelper(amount, lang);
  const formatDate = (date: string | Date) => formatDateHelper(date, lang);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        dir,
        t,
        formatCurrency,
        formatDate,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

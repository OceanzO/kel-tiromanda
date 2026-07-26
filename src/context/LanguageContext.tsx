'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import idTranslations from '@/i18n/id.json';
import enTranslations from '@/i18n/en.json';

type Language = 'id' | 'en';

type TranslationValue = string | string[] | Record<string, unknown>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

const translations: Record<Language, Record<string, unknown>> = {
  id: idTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): TranslationValue | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current as TranslationValue;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    const saved = localStorage.getItem('tiromanda-lang') as Language | null;
    if (saved && (saved === 'id' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tiromanda-lang', lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const value = getNestedValue(translations[language], key);
      if (typeof value === 'string') return value;
      return key;
    },
    [language]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const value = getNestedValue(translations[language], key);
      if (Array.isArray(value)) return value as string[];
      return [];
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
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

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "./config";
import { defaultLanguage, isRTL } from "./config";
import { getStoredLanguage, setStoredLanguage } from "./client";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ 
  children, 
  initialLanguage 
}: { 
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only update if stored language differs from initial
    const stored = getStoredLanguage();
    if (stored !== initialLanguage) {
      setLanguageState(stored);
    }
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  };

  // Always provide context with current language
  const contextValue = {
    language,
    setLanguage,
    isRTL: isRTL(language),
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

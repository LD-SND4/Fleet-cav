"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import languages from "@/locales/languages.json";

export type LanguageKey = keyof typeof languages;

type LanguageContextValue = {
  languageKey: LanguageKey;
  setLanguageKey: (languageKey: LanguageKey) => void;
};

const languageStorageKey = "fleetcav-language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [languageKey, setLanguageKeyState] = useState<LanguageKey>(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const savedLanguage = window.localStorage.getItem(languageStorageKey);

    if (savedLanguage === "en" || savedLanguage === "es") {
      return savedLanguage;
    }

    return "en";
  });

  function setLanguageKey(nextLanguageKey: LanguageKey) {
    setLanguageKeyState(nextLanguageKey);
    window.localStorage.setItem(languageStorageKey, nextLanguageKey);
  }

  const value = useMemo(() => ({ languageKey, setLanguageKey }), [languageKey]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}

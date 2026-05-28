"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

import languages from "@/locales/languages.json";

export type LanguageKey = keyof typeof languages;

type LanguageContextValue = {
  languageKey: LanguageKey;
  setLanguageKey: (languageKey: LanguageKey) => void;
};

const languageStorageKey = "fleetcav-language";
const languageChangeEvent = "fleetcav-language-change";
const LanguageContext = createContext<LanguageContextValue | null>(null);
const defaultLanguageKey: LanguageKey = "es";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const languageKey = useSyncExternalStore(subscribeToLanguage, getStoredLanguage, getDefaultLanguage);

  useEffect(() => {
    document.documentElement.lang = languageKey;
  }, [languageKey]);

  function setLanguageKey(nextLanguageKey: LanguageKey) {
    window.localStorage.setItem(languageStorageKey, nextLanguageKey);
    window.dispatchEvent(new Event(languageChangeEvent));
  }

  const value = useMemo(() => ({ languageKey, setLanguageKey }), [languageKey]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function getDefaultLanguage() {
  return defaultLanguageKey;
}

function getStoredLanguage() {
  const savedLanguage = window.localStorage.getItem(languageStorageKey);

  if (savedLanguage === "en" || savedLanguage === "es") {
    return savedLanguage;
  }

  return defaultLanguageKey;
}

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageChangeEvent, onStoreChange);
  };
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}

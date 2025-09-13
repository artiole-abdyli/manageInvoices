"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import en from "@/src/locales/en.json" assert { type: "json" };
import al from "@/src/locales/al.json" assert { type: "json" };

type Locale = "en" | "al";
type Dict = Record<string, string>;

const dictionaries: Record<Locale, Dict> = { en, al } as const;

type I18nContextType = {
  locale: Locale;
  t: (key: string, fallback?: string) => string;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  // Try to infer from URL (/en/... or /al/...) or localStorage
  useEffect(() => {
    try {
      const fromStorage = (localStorage.getItem("locale") as Locale | null) || undefined;
      const fromPath = typeof window !== "undefined" ? (window.location.pathname.split("/")[1] as Locale) : undefined;
      const next = fromStorage || (fromPath === "al" ? "al" : "en");
      setLocale(next);
    } catch {}
  }, []);

  const value = useMemo<I18nContextType>(() => ({
    locale,
    setLocale: (l: Locale) => {
      setLocale(l);
      try { localStorage.setItem("locale", l); } catch {}
    },
    t: (key: string, fallback?: string) => {
      const dict = dictionaries[locale] || {};
      return (dict as any)[key] ?? fallback ?? key;
    },
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}


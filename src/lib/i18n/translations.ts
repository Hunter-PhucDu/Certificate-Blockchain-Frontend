"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/providers/LocaleContext";
import { Locale } from "./config";

export type TranslationValue = string | { [key: string]: TranslationValue };

export interface TranslationDictionary {
  [key: string]: TranslationValue;
}

const dictionaries: Record<Locale, () => Promise<TranslationDictionary>> = {
  en: () => import("../locale/en.json").then((module) => module.default),
  vi: () => import("../locale/vi.json").then((module) => module.default),
};

export function useTranslations() {
  const { locale } = useLocale();
  const [translations, setTranslations] =
    useState<TranslationDictionary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const dict = await dictionaries[locale]();
        setTranslations(dict);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  const t = (key: string): string => {
    if (!translations || isLoading) {
      const parts = key.split(".");
      return parts[parts.length - 1];
    }

    const keys = key.split(".");
    let value: TranslationValue = translations;

    for (const k of keys) {
      if (typeof value !== "object" || !(k in value)) {
        return key.split(".").pop() || key;
      }
      value = value[k];
    }

    if (typeof value !== "string") {
      return key.split(".").pop() || key;
    }

    return value;
  };

  return { t, isLoading, locale };
}

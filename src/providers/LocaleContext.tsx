"use client";

import { createContext, useContext } from "react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

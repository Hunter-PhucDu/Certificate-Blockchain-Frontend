import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { fallbackLng, languages } from "@/lib/i18n/settings";

import commonEN from "@/lib/i18n/locales/en/en.json";
import commonVI from "@/lib/i18n/locales/vi/vi.json";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const storedLang = localStorage.getItem("language-store");
    if (storedLang) {
      try {
        const parsed = JSON.parse(storedLang);
        if (
          parsed.state &&
          parsed.state.currentLanguage &&
          languages.includes(parsed.state.currentLanguage)
        ) {
          return parsed.state.currentLanguage;
        }
      } catch {}
    }

    const browserLang = navigator.language.split("-")[0];

    if (browserLang && languages.includes(browserLang)) {
      return browserLang;
    }
  }
  return fallbackLng;
};

const initialLang = getInitialLanguage();
i18next.use(initReactI18next).init({
  resources: {
    en: { common: commonEN },
    vi: { common: commonVI },
  },
  lng: initialLang,
  fallbackLng,
  defaultNS: "common",
});

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: initialLang,
      setLanguage: (lang: string) => {
        if (languages.includes(lang)) {
          i18next.changeLanguage(lang);
          set({ currentLanguage: lang });
        }
      },
    }),
    {
      name: "language-store",
    },
  ),
);

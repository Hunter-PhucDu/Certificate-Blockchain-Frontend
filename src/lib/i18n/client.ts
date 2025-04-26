"use client";

import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next";
import { getOptions } from "./settings";

// Import language resources
import en from "./locales/en/common.json";
import vi from "./locales/vi/common.json";

const resources = {
  en: { common: en },
  vi: { common: vi },
};

i18next.use(initReactI18next).init({
  ...getOptions(),
  resources,
});

export function useTranslation(lng: string, ns: string, options = {}) {
  if (i18next.resolvedLanguage !== lng) i18next.changeLanguage(lng);
  return useTranslationOrg(ns, options);
}

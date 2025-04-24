import { createInstance } from "i18next";
import { getOptions } from "./settings";

// Import language resources
import en from "./locales/en/common.json";
import vi from "./locales/vi/common.json";

const resources = {
  en: { common: en },
  vi: { common: vi },
};

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance.init({
    ...getOptions(lng, ns),
    resources,
    lng,
  });
  return i18nInstance;
};

export async function getTranslation(
  lng: string,
  ns: string,
  options: { keyPrefix?: string } = {},
) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}

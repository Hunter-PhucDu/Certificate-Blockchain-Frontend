import type { TOptions } from "i18next";
import { useTranslation } from "react-i18next";
import { TxKeyPath } from "@/types/i18n";

export interface UseTranslateTypeExpose {
  translate: (key: TxKeyPath, options?: TOptions) => string;
}

export const useTranslate = (prefix?: string): UseTranslateTypeExpose => {
  const { t } = useTranslation();

  const translate = (key: TxKeyPath, options?: TOptions) => {
    const txKey = prefix ? `${prefix}.${key}` : key;

    return t(txKey, options);
  };

  return { translate };
};

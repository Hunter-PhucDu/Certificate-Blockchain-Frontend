import type { TxKeyPath } from "@/types";
import type { TOptions } from "i18next";
import { useTranslation } from "react-i18next";

export interface UseTranslateTypeExpose {
  tPrefix: (key: string, options?: TOptions) => string;
  translate: (key: TxKeyPath, options?: TOptions) => string;
}

export const useTranslate = (prefix?: string): UseTranslateTypeExpose => {
  const { t } = useTranslation();

  const tPrefix = (key: string, options?: TOptions) => {
    return t(prefix ? `${prefix}.${key}` : key, options);
  };

  const translate = (key: TxKeyPath, options?: TOptions) => {
    const _key = prefix ? `${prefix}.${key}` : key;
    return t(_key, options);
  };

  return { tPrefix, translate };
};

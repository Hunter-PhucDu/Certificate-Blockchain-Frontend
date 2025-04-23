"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";
import { useTheme } from "./Provider";
import {
  baseColors,
  lightThemeColors,
  darkThemeColors,
  tokens,
} from "@/configs/theme";

export function AntDesignProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();

  const currentTheme = isDarkMode ? darkThemeColors : lightThemeColors;

  const themeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: baseColors.primary.main,
      colorSuccess: baseColors.success.main,
      colorWarning: baseColors.warning.main,
      colorError: baseColors.error.main,
      colorInfo: baseColors.info.main,
      colorTextBase: currentTheme.text.primary,
      colorBgBase: currentTheme.background.primary,
      borderRadius: tokens.borderRadius.md,
    },
    components: {
      Layout: {
        headerBg: currentTheme.layout.header,
        bodyBg: currentTheme.layout.content,
        siderBg: currentTheme.layout.sidebar,
        footerBg: currentTheme.layout.footer,
      },
      Menu: {
        darkItemBg: darkThemeColors.layout.sidebar,
        darkItemColor: "rgba(255, 255, 255, 0.65)",
        darkItemSelectedBg: baseColors.primary.dark,
        darkItemSelectedColor: "#ffffff",
      },
      Button: {
        borderRadius: tokens.borderRadius.md,
      },
      Card: {
        borderRadius: tokens.borderRadius.lg,
      },
    },
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}

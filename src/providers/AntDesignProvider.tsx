"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";
import { useTheme } from "./Provider";
import {
  baseColors,
  lightThemeColors,
  darkThemeColors,
} from "@/config/constants/theme";

export function AntDesignProvider({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useTheme();

  const currentTheme = isDarkMode ? darkThemeColors : lightThemeColors;

  const themeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: baseColors.primary.main,
      borderRadius: 6,
    },
    motion: {
      motionUnit: 0.03,
      motionBase: 0,
      motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      motionEaseOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      motionEaseIn: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    components: {
      Layout: {
        headerBg: currentTheme.background.paper,
        footerBg: currentTheme.background.default,
        siderBg: currentTheme.background.sidebar,
        bodyBg: currentTheme.background.paper,
        siderRealWidth: 200,
        siderCollapsedWidth: 80,
      },
      Menu: {
        // Dark theme
        darkItemBg: currentTheme.background.sidebar,
        darkSubMenuItemBg: currentTheme.background.sidebar,
        darkPopupBg: currentTheme.background.sidebar,

        // Light theme
        itemBg: currentTheme.background.sidebar,
        subMenuItemBg: currentTheme.background.sidebar,
        popupBg: currentTheme.background.sidebar,
      },
    },
  };

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}

"use client";

import { CacheProvider } from "@emotion/react";
import React, { useState, useEffect, createContext, useContext } from "react";
import "@ant-design/v5-patch-for-react-19";
import { AntDesignProvider } from "./AntDesignProvider";
import createEmotionCache from "./createEmotionCache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { darkThemeColors, lightThemeColors } from "@/config/constants/theme";
import { ThemeProvider as AntdThemeProvider } from "antd-style";
import { ToastProvider } from "@/components/Elements/Toast";

const THEME_RESET_EVENT = "theme-reset";
export const resetThemeToLight = () => {
  window.dispatchEvent(new Event(THEME_RESET_EVENT));
  localStorage.setItem("theme", "light");
  document.body.classList.add("light-theme");
  document.body.classList.remove("dark-theme");
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const clientSideEmotionCache = createEmotionCache();

type Props = {
  children: React.ReactNode;
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentTheme: typeof lightThemeColors;
  getColor: (path: string) => string;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  currentTheme: lightThemeColors,
  getColor: () => "",
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const currentTheme = isDarkMode ? darkThemeColors : lightThemeColors;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
    }

    // Listen for theme reset events
    const handleThemeReset = () => {
      setIsDarkMode(false);
    };

    window.addEventListener(THEME_RESET_EVENT, handleThemeReset);

    return () => {
      window.removeEventListener(THEME_RESET_EVENT, handleThemeReset);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const getColor = (path: string) => {
    const keys = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = currentTheme;

    for (const key of keys) {
      if (result[key] === undefined) return "";
      result = result[key];
    }

    return result;
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        currentTheme,
        getColor,
      }}
    >
      <AntdThemeProvider
        appearance={isDarkMode ? "dark" : "light"}
        themeMode={isDarkMode ? "dark" : "light"}
        defaultThemeMode={isDarkMode ? "dark" : "light"}
        theme={{
          token: {
            colorPrimary: "#1890ff",
            colorBgContainer: currentTheme.background.paper,
            colorBgLayout: currentTheme.background.default,
            colorBgElevated: currentTheme.background.sidebar,
            colorText: currentTheme.text.primary,
            colorTextSecondary: currentTheme.text.secondary,
            colorTextDisabled: currentTheme.text.disabled,
            colorBorder: currentTheme.border.main,
            colorBorderSecondary: currentTheme.border.light,
          },
        }}
      >
        {children}
      </AntdThemeProvider>
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={clientSideEmotionCache}>
        <ThemeProvider>
          <AntDesignProvider>
            <ToastProvider>{children}</ToastProvider>
          </AntDesignProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  );
}

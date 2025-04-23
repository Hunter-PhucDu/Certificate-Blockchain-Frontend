"use client";

import { CacheProvider } from "@emotion/react";
import React, { useState, useEffect, createContext, useContext } from "react";
import { AntDesignProvider } from "./AntDesignProvider";
import createEmotionCache from "./createEmotionCache";
import LocaleProvider from "./LocaleProvider";

const clientSideEmotionCache = createEmotionCache();
type Props = {
  children: React.ReactNode;
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setIsDarkMode(storedTheme === "dark" || (!storedTheme && prefersDarkMode));
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: Props) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <LocaleProvider>
        <ThemeProvider>
          <AntDesignProvider>{children}</AntDesignProvider>
        </ThemeProvider>
      </LocaleProvider>
    </CacheProvider>
  );
}

"use client";

import React from "react";
import { ThemeProvider } from "./Provider";
import { AntDesignProvider } from "./AntDesignProvider";
import LocaleProvider from "./LocaleProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AntDesignProvider>{children}</AntDesignProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

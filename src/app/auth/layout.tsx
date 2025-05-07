"use client";

import { Box } from "@/components/Elements";
import { ReactNode, Suspense } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Suspense>{children}</Suspense>
    </Box>
  );
}

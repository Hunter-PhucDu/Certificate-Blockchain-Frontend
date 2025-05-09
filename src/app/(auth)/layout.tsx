"use client";
import { App } from "antd";
import { ReactNode, useState, useEffect, Suspense } from "react";
import Loader from "@/components/Elements/Loader";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const content = isClient ? (
    <Suspense fallback={<Loader />}>{children}</Suspense>
  ) : (
    <Loader />
  );

  return <App>{content}</App>;
}

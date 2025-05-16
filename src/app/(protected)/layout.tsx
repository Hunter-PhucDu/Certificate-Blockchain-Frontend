"use client";

import { ReactNode, useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { useAuthStore } from "@/stores/authStore";
import { redirect } from "next/navigation";
import Loader from "@/components/Elements/Loader";
import { usePathname } from "next/navigation";
import { App } from "antd";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, initializeFromStorage, setLoading } =
    useAuthStore();
  const pathname = usePathname();

  const [key, setKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    initializeFromStorage();
    setKey((prev) => prev + 1);
  }, [pathname, initializeFromStorage, setLoading]);

  if (isLoading) {
    return <Loader key={`loader-${key}`} />;
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <App>
      <Layout>{children}</Layout>
    </App>
  );
}

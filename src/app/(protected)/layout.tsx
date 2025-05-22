"use client";

import { ReactNode, useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import { useAuthStore } from "@/stores/authStore";
import { redirect } from "next/navigation";
import Loader from "@/components/Elements/Loader";
import { App } from "antd";
import { isAllowedHostname } from "@/config/constants/hosts";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, initializeFromStorage, setLoading } =
    useAuthStore();

  useEffect(() => {
    // Kiểm tra hostname
    if (typeof window !== "undefined" && !isAllowedHostname()) {
      redirect("/");
    }

    setLoading(true);
    initializeFromStorage();
  }, [initializeFromStorage, setLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <App>
      <Layout>{children}</Layout>
    </App>
  );
}

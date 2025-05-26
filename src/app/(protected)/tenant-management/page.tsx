"use client";

import TenantManagement from "@/features/tenant/TenantManagement";
import { redirect } from "next/navigation";
import { isMainDomain } from "@/config/constants/hosts";

export default function TenantManagementPage() {
  const isDomain = isMainDomain();
  if (!isDomain) {
    redirect("/");
  }

  return <TenantManagement />;
}

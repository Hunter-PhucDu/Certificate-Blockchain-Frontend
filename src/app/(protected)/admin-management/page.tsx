"use client";

import AdminManagement from "@/features/admin/AdminManagement";
import { redirect } from "next/navigation";
import { isMainDomain } from "@/config/constants/hosts";

export default function AdminManagementPage() {
  const isDomain = isMainDomain();
  if (!isDomain) {
    redirect("/");
  }

  return <AdminManagement />;
}

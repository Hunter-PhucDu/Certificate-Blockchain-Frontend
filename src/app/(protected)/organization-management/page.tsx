"use client";

import OrgManagement from "@/features/organization/OrgManagement";
import { redirect } from "next/navigation";
import { isMainDomain } from "@/config/constants/hosts";

export default function OrganizationManagementPage() {
  const isDomain = isMainDomain();
  if (!isDomain) {
    redirect("/");
  }

  return <OrgManagement />;
}

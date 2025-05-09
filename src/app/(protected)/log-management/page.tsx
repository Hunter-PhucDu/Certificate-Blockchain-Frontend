"use client";

import React from "react";
import LogManagement from "@/features/log/components/LogManagement";
import OrgLogManagement from "@/features/log/components/OrgLogManagement";
import { useAuthStore } from "@/stores/authStore";

const LogManagementPage: React.FC = () => {
  const { userRole } = useAuthStore();

  if (userRole === "ORGANIZATION") {
    return <OrgLogManagement />;
  }

  return <LogManagement />;
};

export default LogManagementPage;

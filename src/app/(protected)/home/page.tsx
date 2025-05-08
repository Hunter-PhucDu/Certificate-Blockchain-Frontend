"use client";

import React from "react";
import { useAuthStore } from "@/stores/authStore";
import AdminDashboard from "@/features/dashboard/AdminDashboard";
import OrganizationDashboard from "@/features/dashboard/OrganizationDashboard";

const DashboardPage = () => {
  const { userRole } = useAuthStore();

  return (
    <div style={{ padding: "24px" }}>
      {userRole === "SUPER_ADMIN" || userRole === "ADMIN" ? (
        <AdminDashboard />
      ) : (
        <OrganizationDashboard />
      )}
    </div>
  );
};

export default DashboardPage;

"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";

const DynamicAdminForgotPassword = dynamic(
  () => import("@/features/auth/admin-forgot-password/AdminForgotPassword"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function AdminForgotPasswordPage() {
  return <DynamicAdminForgotPassword />;
}

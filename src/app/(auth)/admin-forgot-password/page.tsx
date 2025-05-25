"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";
import { redirect } from "next/navigation";
import { isMainDomain } from "@/config/constants/hosts";

const DynamicAdminForgotPassword = dynamic(
  () => import("@/features/auth/admin-forgot-password/AdminForgotPassword"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function AdminForgotPasswordPage() {
  const isDomain = isMainDomain();
  if (!isDomain) {
    redirect("/");
  }

  return <DynamicAdminForgotPassword />;
}

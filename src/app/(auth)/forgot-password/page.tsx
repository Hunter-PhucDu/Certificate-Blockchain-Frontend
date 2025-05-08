"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";

const DynamicForgotPassword = dynamic(
  () => import("@/features/auth/forgot-password/OrganizationForgotPassword"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function ForgotPasswordPage() {
  return <DynamicForgotPassword />;
}

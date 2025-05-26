"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";
import { redirect } from "next/navigation";
import { isMainDomain } from "@/config/constants/hosts";

const DynamicAdminLogin = dynamic(
  () => import("@/features/auth/adminLogin/AdminLogin"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function LoginPage() {
  const isDomain = isMainDomain();
  if (!isDomain) {
    redirect("/");
  }

  return <DynamicAdminLogin />;
}

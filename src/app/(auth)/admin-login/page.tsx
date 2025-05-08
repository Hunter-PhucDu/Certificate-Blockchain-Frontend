"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";

const DynamicAdminLogin = dynamic(
  () => import("@/features/auth/adminLogin/AdminLogin"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function LoginPage() {
  return <DynamicAdminLogin />;
}

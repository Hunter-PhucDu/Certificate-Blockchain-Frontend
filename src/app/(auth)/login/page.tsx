"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";

const DynamicLogin = dynamic(
  () => import("@/features/auth/organizationLogin/OrganizationLogin"),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function LoginPage() {
  return <DynamicLogin />;
}

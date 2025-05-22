"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Elements/Loader";
import { isMainDomain } from "@/config/constants/hosts";
const LandingPage = dynamic(
  () => import("@/features/LandingPage/LandingPage"),
  {
    loading: () => <Loader />,
    ssr: false,
  },
);

const LandingPageOrg = dynamic(
  () => import("@/features/LandingPage/LandingPageOrg"),
  {
    loading: () => <Loader />,
    ssr: false,
  },
);

export default function Page() {
  const [isMain, setIsMain] = useState<boolean | null>(null);

  useEffect(() => {
    const main = isMainDomain();
    setIsMain(main);
  }, []);

  if (isMain === null) {
    return <Loader />;
  }
  return isMain ? <LandingPage /> : <LandingPageOrg />;
}

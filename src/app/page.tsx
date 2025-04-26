"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Elements/Loader";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeFromStorage, setLoading } =
    useAuthStore();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    initializeFromStorage();
    setKey((prev) => prev + 1);
  }, [initializeFromStorage, setLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        console.log("RootPage: redirecting to home");
        router.push("/home");
      } else {
        console.log("RootPage: redirecting to login");
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <Loader key={`loader-${key}`} />;
}

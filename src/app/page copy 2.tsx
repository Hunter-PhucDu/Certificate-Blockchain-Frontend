// "use client";

// import { useEffect, useState } from "react";
// import LandingPage from "@/features/LandingPage/LandingPage";
// import LandingPageOrg from "@/features/LandingPage/LandingPageOrg";
// import Loader from "@/components/Elements/Loader";
// import { useAuthStore } from "@/stores/authStore";
// import { useRouter } from "next/navigation";

// export default function Page() {
//   const [isMainDomain, setIsMainDomain] = useState<boolean | null>(null);
//   const { isAuthenticated, isLoading } = useAuthStore();
//   const router = useRouter();

//   useEffect(() => {
//     // Kiểm tra tên miền để chọn landing page phù hợp
//     const hostname = window.location.hostname;
//     const isMain = hostname === "authenticate.io.vn" || hostname === "localhost";
//     setIsMainDomain(isMain);

//     // Nếu đã đăng nhập, chuyển hướng đến trang home
//     if (isAuthenticated && !isLoading) {
//       router.push("/home");
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isMainDomain === null || isLoading) {
//     return <LandingPage />;
//   }

//   return isMainDomain ? <LandingPage /> : <LandingPageOrg />;
// }

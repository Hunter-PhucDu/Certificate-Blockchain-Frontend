import { apiService } from "@/lib/axios";
import type { ApiResponse } from "@/services/api/types";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface SignInBody {
  username: string;
  password: string;
}

export interface SignInData {
  accessToken: string;
  refreshToken: string;
}

const AUTH_ENDPOINTS = {
  LOGIN: "auth/admin/sign-in",
  LOGOUT: "/auth/logout",
};

export const AuthService = {
  adminSignIn: (body: SignInBody): Promise<SignInData> => {
    return apiService
      .post<ApiResponse<SignInData>>(AUTH_ENDPOINTS.LOGIN, body)
      .then((apiResp: ApiResponse<SignInData>) => apiResp.data);
  },

  logout: () => {
    return apiService.post(AUTH_ENDPOINTS.LOGOUT, {});
  },
};

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear the localStorage
      clearAuth();
      // Redirect to login page after successful logout
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Handle logout error (could add toast notification here)
    },
  });
};

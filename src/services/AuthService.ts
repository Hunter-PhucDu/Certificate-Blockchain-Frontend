"use client";

import { apiService } from "@/lib/axios";
import type { ApiResponse } from "@/services/api/types";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface OtpForgotPasswordRequestDto {
  email: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordLinkRequestDto {
  newPassword: string;
}

export interface ResetPasswordByAdminRequestDto {
  email: string;
  newPassword: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface ChangePasswordRequestDto {
  password: string;
  newPassword: string;
}

export interface ResendOtpForgotPasswordRequestDto {
  email: string;
}

export interface SendLinkResetPasswordRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordWithTokenRequestDto {
  newPassword: string;
}

export interface UnlockAccountRequestDto {
  organizationId: string;
}

const AUTH_ENDPOINTS = {
  LOGIN_ADMIN: "/auth/admin/sign-in",
  LOGIN_ORGANIZATION: "/auth/organization/sign-in",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  ADMIN_GET_OTP_FORGOT_PASSWORD: "/auth/admin/get-otp-forgot-password",
  ADMIN_FORGOT_PASSWORD: "/auth/admin/forgot-password",
  ADMIN_RESET_PASSWORD: "/auth/admin/reset-password",
  ADMIN_RESET_PASSWORD_BY_ADMIN: "/auth/admin/reset-password-by-admin",
  ORGANIZATION_GET_OTP_FORGOT_PASSWORD: "/auth/get-otp-forgot-password",
  ORGANIZATION_FORGOT_PASSWORD: "/auth/forgot-password",
  ORGANIZATION_RESET_PASSWORD: "/auth/reset-password",
  ADMIN_RESEND_OTP_FORGOT_PASSWORD: "/auth/admin/resend-otp-forgot-password",
  ORGANIZATION_RESEND_OTP_FORGOT_PASSWORD: "/auth/resend-otp-forgot-password",
  ADMIN_SEND_LINK_RESET_PASSWORD: "/auth/admin/send-link-reset-password",
  ORGANIZATION_SEND_LINK_RESET_PASSWORD: "/auth/send-link-reset-password",
  RESET_PASSWORD_WITH_TOKEN: (token: string) => `/auth/reset-password/${token}`,
  ORGANIZATION_RESET_PASSWORD_BY_ADMIN: "/auth/organization/reset-password",
  UNLOCK_ORGANIZATION_ACCOUNT: (organizationId: string) =>
    `/auth/unlock-account/${organizationId}`,
};

export const AuthService = {
  // Admin authentication
  adminLogin: (data: LoginRequestDto) => {
    return apiService.post<ApiResponse<LoginResponseDto>>(
      AUTH_ENDPOINTS.LOGIN_ADMIN,
      data,
    );
  },

  // Organization authentication
  organizationLogin: (data: LoginRequestDto) => {
    return apiService.post<ApiResponse<LoginResponseDto>>(
      AUTH_ENDPOINTS.LOGIN_ORGANIZATION,
      data,
    );
  },

  // Logout
  logout: () => {
    return apiService.post<ApiResponse<void>>(AUTH_ENDPOINTS.LOGOUT, {});
  },

  // Refresh token
  refreshToken: (data: RefreshTokenRequestDto) => {
    return apiService.post<ApiResponse<LoginResponseDto>>(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      data,
    );
  },

  // Admin forgot password flow
  adminGetOtpForgotPassword: (data: OtpForgotPasswordRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ADMIN_GET_OTP_FORGOT_PASSWORD,
      data,
    );
  },

  adminForgotPassword: (data: ForgotPasswordRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ADMIN_FORGOT_PASSWORD,
      data,
    );
  },

  adminResetPassword: (data: ResetPasswordLinkRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD,
      data,
    );
  },

  adminResetPasswordByAdmin: (data: ResetPasswordByAdminRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD_BY_ADMIN,
      data,
    );
  },

  // Organization forgot password flow
  organizationGetOtpForgotPassword: (data: OtpForgotPasswordRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ORGANIZATION_GET_OTP_FORGOT_PASSWORD,
      data,
    );
  },

  organizationForgotPassword: (data: ForgotPasswordRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ORGANIZATION_FORGOT_PASSWORD,
      data,
    );
  },

  organizationResetPassword: (data: ResetPasswordLinkRequestDto) => {
    return apiService.post<ApiResponse<void>>(
      AUTH_ENDPOINTS.ORGANIZATION_RESET_PASSWORD,
      data,
    );
  },

  async resetPasswordByAdmin(
    data: ResetPasswordByAdminRequestDto,
  ): Promise<void> {
    await apiService.put(AUTH_ENDPOINTS.ADMIN_RESET_PASSWORD_BY_ADMIN, data);
  },

  // Thêm các phương thức mới
  resendOtpForgotPasswordAdmin: (
    data: ResendOtpForgotPasswordRequestDto,
  ): Promise<void> => {
    return apiService.post(
      AUTH_ENDPOINTS.ADMIN_RESEND_OTP_FORGOT_PASSWORD,
      data,
    );
  },

  resendOtpForgotPasswordOrganization: (
    data: ResendOtpForgotPasswordRequestDto,
  ): Promise<void> => {
    return apiService.post(
      AUTH_ENDPOINTS.ORGANIZATION_RESEND_OTP_FORGOT_PASSWORD,
      data,
    );
  },

  sendLinkResetPasswordAdmin: (
    data: SendLinkResetPasswordRequestDto,
  ): Promise<void> => {
    return apiService.post(AUTH_ENDPOINTS.ADMIN_SEND_LINK_RESET_PASSWORD, data);
  },

  sendLinkResetPasswordOrganization: (
    data: SendLinkResetPasswordRequestDto,
  ): Promise<void> => {
    return apiService.post(
      AUTH_ENDPOINTS.ORGANIZATION_SEND_LINK_RESET_PASSWORD,
      data,
    );
  },

  resetPasswordWithToken: (
    token: string,
    data: ResetPasswordWithTokenRequestDto,
  ): Promise<void> => {
    return apiService.put(
      AUTH_ENDPOINTS.RESET_PASSWORD_WITH_TOKEN(token),
      data,
    );
  },

  resetPasswordOrganizationByAdmin: (
    data: ResetPasswordByAdminRequestDto,
  ): Promise<void> => {
    return apiService.put(
      AUTH_ENDPOINTS.ORGANIZATION_RESET_PASSWORD_BY_ADMIN,
      data,
    );
  },

  unlockOrganizationAccount: (organizationId: string): Promise<void> => {
    return apiService.put(
      AUTH_ENDPOINTS.UNLOCK_ORGANIZATION_ACCOUNT(organizationId),
      {},
    );
  },
};

// React Query hooks
export const useAdminLogin = () => {
  const router = useRouter();
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequestDto) => AuthService.adminLogin(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      router.push("/home");
    },
  });
};

export const useOrganizationLogin = () => {
  const router = useRouter();
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequestDto) => AuthService.organizationLogin(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      router.push("/home");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
  });
};

export const useRefreshToken = () => {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: RefreshTokenRequestDto) =>
      AuthService.refreshToken(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
    },
  });
};

export const useAdminGetOtpForgotPassword = () => {
  return useMutation({
    mutationFn: (data: OtpForgotPasswordRequestDto) =>
      AuthService.adminGetOtpForgotPassword(data),
  });
};

export const useAdminForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequestDto) =>
      AuthService.adminForgotPassword(data),
  });
};

export const useAdminResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordLinkRequestDto) =>
      AuthService.adminResetPassword(data),
  });
};

export const useOrganizationGetOtpForgotPassword = () => {
  return useMutation({
    mutationFn: (data: OtpForgotPasswordRequestDto) =>
      AuthService.organizationGetOtpForgotPassword(data),
  });
};

export const useOrganizationForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequestDto) =>
      AuthService.organizationForgotPassword(data),
  });
};

export const useOrganizationResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordLinkRequestDto) =>
      AuthService.organizationResetPassword(data),
  });
};

export const useAdminSendLinkResetPassword = () => {
  return useMutation({
    mutationFn: (data: SendLinkResetPasswordRequestDto) =>
      AuthService.sendLinkResetPasswordAdmin(data),
  });
};

export const useOrganizationSendLinkResetPassword = () => {
  return useMutation({
    mutationFn: (data: SendLinkResetPasswordRequestDto) =>
      AuthService.sendLinkResetPasswordOrganization(data),
  });
};

export const useResetPasswordWithToken = () => {
  return useMutation({
    mutationFn: (data: { token: string } & ResetPasswordWithTokenRequestDto) =>
      AuthService.resetPasswordWithToken(data.token, {
        newPassword: data.newPassword,
      }),
  });
};

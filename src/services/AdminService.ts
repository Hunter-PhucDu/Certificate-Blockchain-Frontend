"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, PaginatedResponse } from "./api/types";

export interface Admin {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreateBody {
  email: string;
  username: string;
  password: string;
}

export interface AdminUpdateBody {
  username: string;
}

export interface AdminListParams {
  page: number;
  size: number;
  search?: string;
}

export interface ChangePasswordBody {
  password: string;
  newPassword: string;
}

const ADMIN_ENDPOINTS = {
  ADMINS: "/admins",
  ADMIN: (id: string) => `/admins/${id}`,
  SEARCH_ADMINS: "/admins/search",
  CHANGE_PASSWORD: "/admins/change-password",
};

export const AdminService = {
  // Get admin details
  getAdmin: () => {
    return apiService.get<ApiResponse<Admin>>(ADMIN_ENDPOINTS.ADMINS);
  },

  // Get all admins with pagination
  getAdmins: (params: AdminListParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);

    return apiService.get<PaginatedResponse<Admin>>(
      `${ADMIN_ENDPOINTS.SEARCH_ADMINS}?${queryParams.toString()}`,
    );
  },

  // Create admin
  createAdmin: (data: AdminCreateBody) => {
    return apiService.post<ApiResponse<Admin>>(ADMIN_ENDPOINTS.ADMINS, data);
  },

  // Update admin
  updateAdmin: (data: AdminUpdateBody) => {
    return apiService.patch<ApiResponse<Admin>>(ADMIN_ENDPOINTS.ADMINS, data);
  },

  // Delete admin
  deleteAdmin: (id: string) => {
    return apiService.delete<ApiResponse<void>>(ADMIN_ENDPOINTS.ADMIN(id));
  },

  // Change password
  changePassword: (data: ChangePasswordBody) => {
    return apiService.put<ApiResponse<void>>(
      ADMIN_ENDPOINTS.CHANGE_PASSWORD,
      data,
    );
  },
};

// React Query hooks for admin operations
export const useAdmin = () => {
  return useQuery({
    queryKey: ["admin"],
    queryFn: () => AdminService.getAdmin(),
  });
};

export const useAdmins = (params: AdminListParams) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: () => AdminService.getAdmins(params),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminCreateBody) => AdminService.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminUpdateBody) => AdminService.updateAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordBody) => AdminService.changePassword(data),
  });
};

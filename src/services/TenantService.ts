"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, PaginatedResponse } from "./api/types";

export interface Tenant {
  organizationName: string;
  tenantName: string;
  subdomain: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantBody {
  organizationName: string;
  tenantName: string;
  subdomain: string;
}

export interface UpdateTenantBody {
  organizationName?: string;
  status?: string;
}

export interface TenantListParams {
  page: number;
  size: number;
  search?: string;
}

const TENANT_ENDPOINTS = {
  TENANTS: "/tenants",
  TENANT: (id: string) => `/tenants/${id}`,
  SEARCH_TENANTS: "/tenants/search",
};

export const TenantService = {
  // Get all unused tenants
  getAllTenants: () => {
    return apiService.get<ApiResponse<Tenant[]>>(TENANT_ENDPOINTS.TENANTS);
  },

  // Get tenant by ID
  getTenant: (id: string) => {
    return apiService.get<ApiResponse<Tenant>>(TENANT_ENDPOINTS.TENANT(id));
  },

  // Get tenants with pagination
  searchTenants: (params: TenantListParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);

    return apiService.get<PaginatedResponse<Tenant>>(
      `${TENANT_ENDPOINTS.SEARCH_TENANTS}?${queryParams.toString()}`,
    );
  },

  // Create tenant
  createTenant: (data: CreateTenantBody) => {
    return apiService.post<ApiResponse<Tenant>>(TENANT_ENDPOINTS.TENANTS, data);
  },

  // Update tenant
  updateTenant: (id: string, data: UpdateTenantBody) => {
    return apiService.patch<ApiResponse<Tenant>>(
      TENANT_ENDPOINTS.TENANT(id),
      data,
    );
  },

  // Delete tenant
  deleteTenant: (id: string) => {
    return apiService.delete<ApiResponse<void>>(TENANT_ENDPOINTS.TENANT(id));
  },
};

// React Query hooks
export const useAllTenants = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: () => TenantService.getAllTenants(),
  });
};

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ["tenant", id],
    queryFn: () => TenantService.getTenant(id),
    enabled: !!id,
  });
};

export const useSearchTenants = (params: TenantListParams) => {
  return useQuery({
    queryKey: ["tenants", "search", params],
    queryFn: () => TenantService.searchTenants(params),
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantBody) => TenantService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantBody }) =>
      TenantService.updateTenant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", variables.id] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TenantService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

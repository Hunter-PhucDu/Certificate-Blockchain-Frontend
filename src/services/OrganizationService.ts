"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "./api/types";

export interface Organization {
  tenantId: string;
  logo?: string;
  organizationName: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationBody {
  tenantId: string;
  organizationName: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface UpdateOrganizationBody {
  logo?: string | File;
  organizationName?: string;
  phone?: string;
  address?: string;
}

export interface OrganizationStatistics {
  totalOrganizations: number;
  organizationsWithout2FA: number;
  lockedOrganizations: number;
}

export interface MonthlyData {
  count: number;
  month: string;
}

export interface OrganizationMonthlyStatistics {
  code: string;
  data: MonthlyData[];
}

export interface OrganizationMonthlyStatisticsResponse {
  code: string;
  data: MonthlyData[];
}

const ORGANIZATION_ENDPOINTS = {
  ORGANIZATIONS: "/organizations",
  ORGANIZATION: (id: string) => `/organizations/${id}`,
  STATISTICS: "/organizations/dashboard/statistics",
  MONTHLY_STATISTICS: "/organizations/dashboard/monthly-statistics",
};

export const OrganizationService = {
  // Get all organizations
  getOrganizations: () => {
    return apiService.get<ApiResponse<Organization[]>>(
      ORGANIZATION_ENDPOINTS.ORGANIZATIONS,
    );
  },

  // Get organization by ID
  getOrganization: (id: string) => {
    return apiService.get<ApiResponse<Organization>>(
      ORGANIZATION_ENDPOINTS.ORGANIZATION(id),
    );
  },

  // Create organization
  createOrganization: (data: CreateOrganizationBody) => {
    return apiService.post<ApiResponse<Organization>>(
      ORGANIZATION_ENDPOINTS.ORGANIZATIONS,
      data,
    );
  },

  // Update organization
  updateOrganization: (id: string, data: UpdateOrganizationBody | FormData) => {
    return apiService.put<ApiResponse<Organization>>(
      ORGANIZATION_ENDPOINTS.ORGANIZATION(id),
      data,
    );
  },

  // Delete organization
  deleteOrganization: (id: string) => {
    return apiService.delete<ApiResponse<void>>(
      ORGANIZATION_ENDPOINTS.ORGANIZATION(id),
    );
  },

  // Get organization statistics
  getStatistics: () => {
    return apiService.get<ApiResponse<OrganizationStatistics>>(
      ORGANIZATION_ENDPOINTS.STATISTICS,
    );
  },

  // Get organization monthly statistics
  getMonthlyStatistics: () => {
    return apiService.get<ApiResponse<OrganizationMonthlyStatistics>>(
      ORGANIZATION_ENDPOINTS.MONTHLY_STATISTICS,
    );
  },
};

// React Query hooks
export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => OrganizationService.getOrganizations(),
  });
};

export const useOrganization = (id: string) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => OrganizationService.getOrganization(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationBody) =>
      OrganizationService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrganizationBody | FormData;
    }) => OrganizationService.updateOrganization(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.id],
      });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => OrganizationService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export const useOrganizationStatistics = () => {
  return useQuery({
    queryKey: ["organizations", "statistics"],
    queryFn: () => OrganizationService.getStatistics(),
  });
};

export const useOrganizationMonthlyStatistics = () => {
  return useQuery({
    queryKey: ["organizations", "monthly-statistics"],
    queryFn: async () => {
      const response = await OrganizationService.getMonthlyStatistics();
      return response.data;
    },
  });
};

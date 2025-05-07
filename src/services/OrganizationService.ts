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
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateOrganizationBody {
  logo?: string;
  organizationName?: string;
  phone?: string;
  address?: string;
}

const ORGANIZATION_ENDPOINTS = {
  ORGANIZATIONS: "/organizations",
  ORGANIZATION: (id: string) => `/organizations/${id}`,
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
  updateOrganization: (id: string, data: UpdateOrganizationBody) => {
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
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationBody }) =>
      OrganizationService.updateOrganization(id, data),
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

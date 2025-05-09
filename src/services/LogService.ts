"use client";

import { apiService } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Log {
  username: string;
  action: string;
  payload: string;
  role: "SUPER_ADMIN" | "ADMIN" | "ORGANIZATION";
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    totalItem: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface LogListParams {
  page: number;
  size: number;
  search?: string;
}

const LOG_ENDPOINTS = {
  SYSTEM_LOGS: "/logs/system",
  TENANT_LOGS: "/logs/tenant",
  TENANT_LOGS_BY_ID: (tenantId: string) => `/logs/tenant/${tenantId}`,
  ALL_LOGS: "/logs/all",
};

export const LogService = {
  // Get system logs
  getSystemLogs: (params: LogListParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);

    return apiService.get<PaginatedResponse<Log>>(
      `${LOG_ENDPOINTS.SYSTEM_LOGS}?${queryParams.toString()}`,
    );
  },

  // Get tenant logs by admin
  getTenantLogs: (params: LogListParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);

    return apiService.get<PaginatedResponse<Log>>(
      `${LOG_ENDPOINTS.TENANT_LOGS}?${queryParams.toString()}`,
    );
  },

  // Get tenant logs by tenant ID
  getTenantLogsById: (tenantId: string, params: LogListParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);

    return apiService.get<PaginatedResponse<Log>>(
      `${LOG_ENDPOINTS.TENANT_LOGS_BY_ID(tenantId)}?${queryParams.toString()}`,
    );
  },

  // Get all logs
  getAllLogs: () => {
    return apiService.get<Log[]>(LOG_ENDPOINTS.ALL_LOGS);
  },
};

// React Query hooks
export const useSystemLogs = (params: LogListParams) => {
  return useQuery({
    queryKey: ["logs", "system", params],
    queryFn: () => LogService.getSystemLogs(params),
  });
};

export const useTenantLogs = (params: LogListParams) => {
  return useQuery({
    queryKey: ["logs", "tenant", params],
    queryFn: () => LogService.getTenantLogs(params),
  });
};

export const useTenantLogsById = (tenantId: string, params: LogListParams) => {
  return useQuery({
    queryKey: ["logs", "tenant", tenantId, params],
    queryFn: () => LogService.getTenantLogsById(tenantId, params),
    enabled: !!tenantId,
  });
};

export const useAllLogs = () => {
  return useQuery({
    queryKey: ["logs", "all"],
    queryFn: () => LogService.getAllLogs(),
  });
};

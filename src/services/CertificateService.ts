"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, PaginatedResponse } from "./api/types";

export type CertificateValueType = "String" | "Number" | "Date" | "Boolean";

export interface CertificateValue {
  label: string;
  value: string;
  type: CertificateValueType;
  isUnique?: boolean;
}

export interface CertificateData {
  key: string;
  values: CertificateValue[];
}

export interface Certificate {
  id: string;
  blockId: string;
  txHash: string;
  groupId: string;
  certificateType: CertificateValueType;
  certificateData: CertificateData[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificateBody {
  groupId: string;
  certificateType: string;
  certificateData: CertificateData[];
}

export interface UpdateCertificateBody {
  certificateData: CertificateData[];
}

export interface BulkCreateCertificateBody {
  groupId: string;
  certificateType: string;
  certificatesData: CertificateData[][];
}

export interface BulkCreateCertificateResponse {
  txId: string;
  certificatesCount: number;
  certificateIds: string[];
}

export interface CertificateTypeStatistics {
  type: string;
  count: number;
}

export interface CertificateStatistics {
  total: number;
  issued: number;
  pending: number;
  revoked: number;
}

export interface CertificateListParams {
  page: number;
  size: number;
  search?: string;
}

const CERTIFICATE_ENDPOINTS = {
  CERTIFICATES: "/certificates",
  CERTIFICATE: (id: string) => `/certificates/${id}`,
  CERTIFICATE_BY_TX: (txHash: string) => `/certificates/tx/${txHash}`,
  STATISTICS: "/certificates/dashboard/statistics",
  BULK_CREATE: "/certificates/bulk",
};

export const CertificateService = {
  // Get all certificates without pagination
  getAllCertificates: () => {
    return apiService.get<ApiResponse<Certificate[]>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATES,
    );
  },

  // Get certificates with pagination
  getCertificates: (params: CertificateListParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.search) queryParams.append("search", params.search);

    return apiService.get<PaginatedResponse<Certificate>>(
      `${CERTIFICATE_ENDPOINTS.CERTIFICATES}?${queryParams.toString()}`,
    );
  },

  // Get certificate by ID
  getCertificate: (id: string) => {
    return apiService.get<ApiResponse<Certificate>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATE(id),
    );
  },

  // Get certificate by transaction hash
  getCertificateByTxHash: (txHash: string) => {
    return apiService.get<ApiResponse<Certificate>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATE_BY_TX(txHash),
    );
  },

  // Create certificate
  createCertificate: (data: CreateCertificateBody) => {
    return apiService.post<ApiResponse<Certificate>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATES,
      data,
    );
  },

  // Bulk create certificates
  bulkCreateCertificates: (data: BulkCreateCertificateBody) => {
    return apiService.post<ApiResponse<BulkCreateCertificateResponse>>(
      CERTIFICATE_ENDPOINTS.BULK_CREATE,
      data,
    );
  },

  // Update certificate
  updateCertificate: (id: string, data: UpdateCertificateBody) => {
    return apiService.put<ApiResponse<Certificate>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATE(id),
      data,
    );
  },

  // Delete certificate
  deleteCertificate: (id: string) => {
    return apiService.delete<ApiResponse<void>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATE(id),
    );
  },

  // Get certificate statistics
  getStatistics: () => {
    return apiService.get<ApiResponse<CertificateStatistics>>(
      CERTIFICATE_ENDPOINTS.STATISTICS,
    );
  },
};

// React Query hooks
export const useCertificates = (params?: CertificateListParams) => {
  return useQuery({
    queryKey: ["certificates", params],
    queryFn: () =>
      params
        ? CertificateService.getCertificates(params)
        : CertificateService.getAllCertificates(),
  });
};

export const useAllCertificates = () => {
  return useQuery({
    queryKey: ["certificates", "all"],
    queryFn: () => CertificateService.getAllCertificates(),
  });
};

export const useCertificate = (id: string) => {
  return useQuery({
    queryKey: ["certificate", id],
    queryFn: () => CertificateService.getCertificate(id),
    enabled: !!id,
  });
};

export const useCertificateByTxHash = (txHash: string) => {
  return useQuery({
    queryKey: ["certificate", "tx", txHash],
    queryFn: () => CertificateService.getCertificateByTxHash(txHash),
    enabled: !!txHash,
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCertificateBody) =>
      CertificateService.createCertificate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
};

export const useBulkCreateCertificates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateCertificateBody) =>
      CertificateService.bulkCreateCertificates(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCertificateBody }) =>
      CertificateService.updateCertificate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({
        queryKey: ["certificate", variables.id],
      });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CertificateService.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });
};

export const useCertificateStatistics = () => {
  return useQuery({
    queryKey: ["certificates", "statistics"],
    queryFn: () => CertificateService.getStatistics(),
  });
};

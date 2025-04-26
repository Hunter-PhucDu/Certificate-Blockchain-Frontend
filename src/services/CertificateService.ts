"use client";

import { apiService } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "./api/types";

export interface CertificateValue {
  label: string;
  value: string;
  type: string;
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
  certificateType: string;
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

const CERTIFICATE_ENDPOINTS = {
  CERTIFICATES: "/certificates",
  CERTIFICATE: (id: string) => `/certificates/${id}`,
  CERTIFICATE_BY_TX: (txHash: string) => `/certificates/tx/${txHash}`,
};

export const CertificateService = {
  // Get all certificates
  getCertificates: () => {
    return apiService.get<ApiResponse<Certificate[]>>(
      CERTIFICATE_ENDPOINTS.CERTIFICATES,
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
};

// React Query hooks
export const useCertificates = () => {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: () => CertificateService.getCertificates(),
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

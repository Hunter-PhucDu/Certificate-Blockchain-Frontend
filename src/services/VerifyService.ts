"use client";

import { apiService } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "./api/types";
import { Certificate } from "./CertificateService";

export interface CertificateMetadataItem {
  label: string;
  json_metadata: {
    certificateData: Record<
      string,
      Array<{
        type: string;
        label: string;
        value: string;
        isUnique: string;
      }>
    >;
    certificateType: string;
    certificateIndex?: string;
  };
}

export interface CertificateMetadataResponse {
  txHash: string;
  index: number;
  metadata?: CertificateMetadataItem[];
}

const VERIFY_ENDPOINTS = {
  VERIFY_TX: (txHash: string) => `/verify/tx/${txHash}`,
  VERIFY_METADATA: (txHash: string) => `/verify/metadata/${txHash}`,
  SEARCH_BY_VALUE: "/verify/search-by-value",
};

export const VerifyService = {
  // Get certificate details by transaction hash
  getCertificateByTxHash: (txHash: string) => {
    return apiService.get<ApiResponse<CertificateMetadataItem[]>>(
      VERIFY_ENDPOINTS.VERIFY_TX(txHash),
    );
  },

  // Get certificate metadata by transaction hash
  getCertificateMetadata: (txHash: string, index?: number) => {
    const queryParams = new URLSearchParams();
    if (index !== undefined) queryParams.append("index", index.toString());

    const url = `${VERIFY_ENDPOINTS.VERIFY_METADATA(txHash)}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return apiService.get<ApiResponse<CertificateMetadataResponse>>(url);
  },

  // Search certificate by value
  searchCertificateByValue: (searchValue: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("searchValue", searchValue);

    return apiService.get<ApiResponse<Certificate[]>>(
      `${VERIFY_ENDPOINTS.SEARCH_BY_VALUE}?${queryParams.toString()}`,
    );
  },
};

// React Query hooks
export const useCertificateByTxHash = (txHash: string) => {
  return useQuery({
    queryKey: ["verify", "tx", txHash],
    queryFn: () => VerifyService.getCertificateByTxHash(txHash),
    enabled: !!txHash,
  });
};

export const useCertificateMetadata = (txHash: string, index?: number) => {
  return useQuery({
    queryKey: ["verify", "metadata", txHash, index],
    queryFn: () => VerifyService.getCertificateMetadata(txHash, index),
    enabled: !!txHash,
  });
};

export const useSearchCertificateByValue = (searchValue: string) => {
  return useQuery({
    queryKey: ["verify", "search", searchValue],
    queryFn: () => VerifyService.searchCertificateByValue(searchValue),
    enabled: !!searchValue,
  });
};

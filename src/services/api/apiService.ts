/**
 * Base API service with react-query integration
 */
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { apiService as axiosService } from "@/lib/axios";
import { ApiResponse, PaginatedResponse, QueryFilterOptions } from "./types";

/**
 * Base API service with methods for different request types integrated with react-query
 */
export const apiService = {
  /**
   * Use a GET query with react-query
   */
  useGet: <TData, TError = Error>(
    endpoint: string,
    queryKey: unknown[],
    options?: UseQueryOptions<ApiResponse<TData>, TError, TData>,
  ) => {
    return useQuery<ApiResponse<TData>, TError, TData>({
      queryKey: queryKey,
      queryFn: async () => axiosService.get<ApiResponse<TData>>(endpoint),
      select: (data) => data.data,
      ...options,
    });
  },

  /**
   * Use a GET query for paginated data with react-query
   */
  useGetPaginated: <TData, TError = Error>(
    endpoint: string,
    queryKey: unknown[],
    filters?: QueryFilterOptions,
    options?: UseQueryOptions<
      PaginatedResponse<TData>,
      TError,
      PaginatedResponse<TData>
    >,
  ) => {
    // Build query string from filters
    const queryParams = filters ? new URLSearchParams() : null;
    if (filters && queryParams) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams?.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return useQuery<PaginatedResponse<TData>, TError, PaginatedResponse<TData>>(
      {
        queryKey: [...queryKey, filters],
        queryFn: async () => axiosService.get<PaginatedResponse<TData>>(url),
        ...options,
      },
    );
  },

  /**
   * Use a POST mutation with react-query
   */
  usePost: <TData, TVariables, TError = Error>(
    endpoint: string,
    options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
  ) => {
    return useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn: (variables) =>
        axiosService.post<ApiResponse<TData>>(endpoint, variables),
      ...options,
    });
  },

  /**
   * Use a PUT mutation with react-query
   */
  usePut: <TData, TVariables, TError = Error>(
    endpoint: string,
    options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
  ) => {
    return useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn: (variables) =>
        axiosService.put<ApiResponse<TData>>(endpoint, variables),
      ...options,
    });
  },

  /**
   * Use a PATCH mutation with react-query
   */
  usePatch: <TData, TVariables, TError = Error>(
    endpoint: string,
    options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
  ) => {
    return useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn: (variables) =>
        axiosService.patch<ApiResponse<TData>>(endpoint, variables),
      ...options,
    });
  },

  /**
   * Use a DELETE mutation with react-query
   */
  useDelete: <TData, TVariables = string | number, TError = Error>(
    endpoint: string,
    options?: UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
  ) => {
    return useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn: (id) => {
        const url =
          typeof id === "string" || typeof id === "number"
            ? `${endpoint}/${id}`
            : endpoint;
        return axiosService.delete<ApiResponse<TData>>(url);
      },
      ...options,
    });
  },

  /**
   * Direct access to the axios service for custom requests
   */
  axios: axiosService,
};

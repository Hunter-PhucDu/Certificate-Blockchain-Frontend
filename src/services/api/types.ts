/**
 * Common types for API requests and responses
 */

// Pagination parameters for API requests
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// Standard paginated response from API
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// Standard API response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

// Error response from API
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

// Query filter options
export interface QueryFilterOptions extends PaginationParams {
  search?: string;
  [key: string]: unknown;
}

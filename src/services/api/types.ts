/**
 * Common types for API requests and responses
 */

// Pagination parameters for API requests
export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

// Metadata for paginated responses
export interface MetadataResponseDto {
  size: number;
  page: number;
  totalItem: number;
  totalPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Standard paginated response from API with metadata
export interface PaginatedResponse<T> {
  code: string;
  data: T[];
  metadata: MetadataResponseDto;
}

// Standard API response
export interface ApiResponse<T> {
  code: string;
  data: T;
  message?: string;
}

// Error response from API
export interface ApiErrorResponse {
  code: string;
  message: string;
  error?: string;
  statusCode?: number;
}

// Query filter options
export interface QueryFilterOptions extends PaginationParams {
  [key: string]: unknown;
}

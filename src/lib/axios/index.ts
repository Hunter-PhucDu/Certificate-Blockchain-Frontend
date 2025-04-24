/**
 * API service layer for making HTTP requests using Axios
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { HTTP_STATUS } from "@/config/constants/httpStatus";

// Define interface for API error responses
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  // Add other potential error fields your API might return
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";

/**
 * Create a configured Axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor for API calls
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response interceptor for API calls
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can do global response handling here
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    // Handle different error statuses
    if (response) {
      const status = response.status;

      // Handle specific status codes
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          console.error("Unauthorized access");
          // You can redirect to login or refresh token here
          break;
        case HTTP_STATUS.FORBIDDEN:
          console.error("Forbidden access");
          break;
        case HTTP_STATUS.NOT_FOUND:
          console.error("Resource not found");
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          console.error("Server error");
          break;
        default:
          console.error(`API error: ${status}`);
      }

      // Extract error message from response if available
      const errorData = response.data as ApiErrorResponse;
      const errorMessage = errorData.message || `API error: ${status}`;
      return Promise.reject(new Error(errorMessage));
    }

    // Handle network errors or other issues
    if (error.message === "Network Error") {
      console.error("Network error - make sure API is running");
    }

    return Promise.reject(error);
  },
);

/**
 * API service with methods for different request types
 */
export const apiService = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(endpoint, config).then((response) => response.data),

  /**
   * POST request
   */
  post: <T>(endpoint: string, data: unknown, config?: AxiosRequestConfig) =>
    axiosInstance
      .post<T>(endpoint, data, config)
      .then((response) => response.data),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, data: unknown, config?: AxiosRequestConfig) =>
    axiosInstance
      .put<T>(endpoint, data, config)
      .then((response) => response.data),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, data: unknown, config?: AxiosRequestConfig) =>
    axiosInstance
      .patch<T>(endpoint, data, config)
      .then((response) => response.data),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(endpoint, config).then((response) => response.data),

  /**
   * Get the Axios instance for custom requests
   */
  getInstance: () => axiosInstance,
};

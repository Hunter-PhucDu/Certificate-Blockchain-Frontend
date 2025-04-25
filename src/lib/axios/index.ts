/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { HTTP_STATUS } from "@/config/constants/httpStatus";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

let isRefreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  queue = [];
};

axiosInstance.interceptors.request.use((cfg) => {
  const at = useAuthStore.getState().accessToken;
  if (at) cfg.headers.Authorization = `Bearer ${at}`;
  return cfg;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError & { config?: any }) => {
    const auth = useAuthStore.getState();
    const req = err.config!;
    if (err.response?.status === HTTP_STATUS.UNAUTHORIZED && !req._retry) {
      if (isRefreshing) {
        return new Promise<any>((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((t: unknown) => {
          const token = t as string;
          req.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(req);
        });
      }

      req._retry = true;
      isRefreshing = true;

      return new Promise<any>((resolve, reject) => {
        axiosInstance
          .post("/auth/refresh", { refreshToken: auth.refreshToken })
          .then(({ data }) => {
            const { accessToken, refreshToken } = data;
            auth.setTokens(accessToken, refreshToken);
            processQueue(null, accessToken);
            req.headers["Authorization"] = `Bearer ${accessToken}`;
            resolve(axiosInstance(req));
          })
          .catch((e) => {
            processQueue(e, null);
            auth.clearAuth();
            window.location.href = "/login";
            reject(e);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(err);
  },
);

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

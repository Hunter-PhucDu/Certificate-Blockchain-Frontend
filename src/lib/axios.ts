/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { HTTP_STATUS } from "@/config/constants/httpStatus";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
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

instance.interceptors.request.use((cfg) => {
  const at = useAuthStore.getState().accessToken;
  if (at) cfg.headers.Authorization = `Bearer ${at}`;
  return cfg;
});

instance.interceptors.response.use(
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
          return instance(req);
        });
      }

      req._retry = true;
      isRefreshing = true;

      return new Promise<any>((resolve, reject) => {
        instance
          .post("/auth/refresh", { refreshToken: auth.refreshToken })
          .then(({ data }) => {
            const { accessToken, refreshToken } = data;
            auth.setTokens(accessToken, refreshToken);
            processQueue(null, accessToken);
            req.headers["Authorization"] = `Bearer ${accessToken}`;
            resolve(instance(req));
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

export const axiosService = {
  get: <T>(url: string) => instance.get<T>(url).then((r) => r.data),
  post: <T>(url: string, body?: any) =>
    instance.post<T>(url, body).then((r) => r.data),
  put: <T>(url: string, body?: any) =>
    instance.put<T>(url, body).then((r) => r.data),
  patch: <T>(url: string, body?: any) =>
    instance.patch<T>(url, body).then((r) => r.data),
  delete: <T>(url: string) => instance.delete<T>(url).then((r) => r.data),
  raw: instance,
};

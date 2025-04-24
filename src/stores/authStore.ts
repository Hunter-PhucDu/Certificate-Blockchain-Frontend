import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface JwtPayload {
  _id: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
  email?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  initializeFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    const payload = jwtDecode<JwtPayload>(accessToken);

    set({
      accessToken,
      refreshToken,
      user: {
        id: payload._id,
        email: payload.email ?? "",
        name: payload.username,
        role: payload.role,
      },
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
  },

  initializeFromStorage: () => {
    const at = localStorage.getItem("access_token");
    const rt = localStorage.getItem("refresh_token");
    if (at && rt) {
      try {
        const payload = jwtDecode<JwtPayload>(at);
        if (Date.now() < payload.exp * 1000) {
          set({
            accessToken: at,
            refreshToken: rt,
            user: {
              id: payload._id,
              email: payload.email ?? "",
              name: payload.username,
              role: payload.role,
            },
            isAuthenticated: true,
          });
          return;
        }
      } catch {
        // token invalid
      }
    }
    get().clearAuth();
  },
}));

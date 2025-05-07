import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { resetThemeToLight } from "@/providers/Provider";

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
  isLoading: boolean; // Add loading state
  setUser: (user: User | null) => void;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  initializeFromStorage: () => void;
  setLoading: (isLoading: boolean) => void;
  userRole: string | null; // Add userRole property
}

const MINIMUM_LOADING_TIME = 50;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  refreshToken:
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null,
  userRole: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) => set({ isLoading }),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    const payload = jwtDecode<JwtPayload>(accessToken);

    setTimeout(() => {
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
        isLoading: false,
        userRole: payload.role,
      });
    }, MINIMUM_LOADING_TIME);
  },

  logout: () => {
    localStorage.removeItem("access_token");
    setTimeout(() => {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }, MINIMUM_LOADING_TIME);
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Reset theme to light mode using the global function
    resetThemeToLight();

    setTimeout(() => {
      set({
        user: null,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
    }, MINIMUM_LOADING_TIME);
  },

  initializeFromStorage: () => {
    set({ isLoading: true });

    const startTime = Date.now();

    const at = localStorage.getItem("access_token");
    const rt = localStorage.getItem("refresh_token");

    const completeInitialization = () => {
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
              isLoading: false,
              userRole: payload.role,
            });
            return;
          }
        } catch {
          // token invalid
        }
      }
      set({ isLoading: false });
      get().clearAuth();
    };

    // Ensure loading appears for a minimum duration
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

    setTimeout(completeInitialization, remainingTime);
  },
}));

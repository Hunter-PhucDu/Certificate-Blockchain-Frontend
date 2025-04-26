import { create } from "zustand";

type Type = "success" | "error" | "warning" | "info";

// Types
export interface ToastState {
  message: string;
  type: Type;
  setToast: (toast: { message: string; type: Type; isOpen: boolean }) => void;
  clearToast: () => void;
  isOpen: boolean;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  setToast: (toast) => set({ ...toast }),
  clearToast: () => set({ isOpen: false }),
  isOpen: false,
}));

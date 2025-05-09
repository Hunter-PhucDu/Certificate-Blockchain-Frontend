"use client";

import React from "react";
import { notification } from "antd";
import { createContext, useContext } from "react";

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const toast = {
    success: (message: string) => {
      api.success({
        message: "Thành công",
        description: message,
        placement: "topRight",
      });
    },
    error: (message: string) => {
      api.error({
        message: "Lỗi",
        description: message,
        placement: "topRight",
      });
    },
    info: (message: string) => {
      api.info({
        message: "Thông tin",
        description: message,
        placement: "topRight",
      });
    },
    warning: (message: string) => {
      api.warning({
        message: "Cảnh báo",
        description: message,
        placement: "topRight",
      });
    },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};

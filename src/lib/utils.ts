"use client";

export const isAllowedHostname = (): boolean => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  return hostname === "authenticate.io.vn" || hostname === "localhost";
};

export const getHostname = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.location.hostname;
};

"use client";

const HOSTNAME = process.env.NEXT_PUBLIC_HOSTNAME_URL || "localhost";

export const isAllowedHostname = (): boolean => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  return (
    hostname === "localhost" ||
    hostname === HOSTNAME ||
    hostname.endsWith(`.${HOSTNAME}`)
  );
};

export const getHostname = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.location.hostname;
};

export const isMainDomain = (): boolean => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;

  return hostname === HOSTNAME || hostname === "localhost";
};

export const isSubdomain = (): boolean => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;

  return (
    hostname !== HOSTNAME &&
    hostname !== "localhost" &&
    hostname.endsWith(`.${HOSTNAME}`)
  );
};

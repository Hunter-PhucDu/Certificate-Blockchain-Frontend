"use client";

/**
 * Danh sách hostname được phép truy cập
 */
export const ALLOWED_HOSTNAMES = ["authenticate.io.vn", "localhost"];

/**
 * Kiểm tra xem hostname hiện tại có nằm trong danh sách cho phép không
 * @returns true nếu hostname được cho phép, false nếu không
 */
export const isAllowedHostname = (): boolean => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  return ALLOWED_HOSTNAMES.includes(hostname);
};

/**
 * Lấy hostname hiện tại
 * @returns hostname hiện tại hoặc null nếu đang chạy trên server
 */
export const getHostname = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.location.hostname;
};

/**
 * Kiểm tra xem hostname có phải là domain chính không
 * Domain chính: localhost hoặc authenticate.io.vn
 * Subdomain: sub1.authenticate.io.vn, sub2.authenticate.io.vn, v.v.
 * @returns true nếu là domain chính, false nếu là subdomain
 */
export const isMainDomain = (): boolean => {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");

  // Domain chính là localhost hoặc authenticate.io.vn (có 3 phần)
  return (
    hostname === "localhost" ||
    (hostname.includes("authenticate.io.vn") && hostnameParts.length === 3)
  );
};

/**
 * Kiểm tra xem hostname có phải là subdomain không
 * @returns true nếu là subdomain, false nếu là domain chính
 */
export const isSubdomain = (): boolean => {
  return !isMainDomain();
};

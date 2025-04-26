"use client";

import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  sub: string;
  role?: string;
  email?: string;
  tenantId?: string;
  exp: number;
}

export const getTokenData = (token: string | null): JWTPayload | null => {
  if (!token) return null;

  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to check token expiration:", error);
    return true;
  }
};

export const getUserRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Failed to get user role from token:", error);
    return null;
  }
};

export const isAdmin = (token: string | null): boolean => {
  const role = getUserRoleFromToken(token);
  return role === "admin";
};

export const isOrganization = (token: string | null): boolean => {
  const role = getUserRoleFromToken(token);
  return role === "organization";
};

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService, SignInBody } from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [form, setForm] = useState<SignInBody>({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const setTokens = useAuthStore((s) => s.setTokens);
  const initialize = useAuthStore((s) => s.initializeFromStorage);
  const router = useRouter();

  useEffect(() => {
    initialize();
    if (useAuthStore.getState().isAuthenticated) {
      router.replace("/");
    }
  }, [initialize, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { accessToken, refreshToken } = await AuthService.adminSignIn(form);
      setTokens(accessToken, refreshToken);
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Đăng nhập thất bại",
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Admin Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "8px 16px" }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

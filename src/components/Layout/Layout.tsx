"use client";

import React, { useEffect, useState } from "react";
import { Layout as AntLayout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "@/providers/Provider";
import {
  lightThemeColors,
  darkThemeColors,
  shadows,
  tokens,
} from "@/config/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { setupInactivityLogout } from "@/lib/inactivity";

const { Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const { isDarkMode } = useTheme();
  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;
  const currentShadow = isDarkMode ? shadows.dark.small : shadows.light.small;

  const logout = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const cleanupIdle = setupInactivityLogout(() => {
      alert("Không hoạt động 30 phút. Đăng xuất.");
      logout();
    });
    return () => {
      cleanupIdle();
    };
  }, [logout]);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <AntLayout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s",
          background: themeColors.background.default,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: "88px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: tokens.spacing.lg,
              background: themeColors.background.paper,
              borderRadius: tokens.borderRadius.lg,
              boxShadow: currentShadow,
              color: themeColors.text.primary,
              transition: "all 0.3s",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Certificate Blockchain ©{new Date().getFullYear()}
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;

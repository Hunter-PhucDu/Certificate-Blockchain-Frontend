"use client";

import React, { useState } from "react";
import { Layout as AntLayout, Breadcrumb } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "@/providers/Provider";
import {
  lightThemeColors,
  darkThemeColors,
  shadows,
  tokens,
} from "@/configs/theme";

const { Content, Footer } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  // Choose theme colors based on current mode
  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;
  const currentShadow = isDarkMode ? shadows.dark.small : shadows.light.small;

  // Define breadcrumb items with the new items prop format
  const breadcrumbItems = [{ title: "Home" }, { title: "Dashboard" }];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <AntLayout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s",
          background: themeColors.layout.content,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: "88px 16px 0", overflow: "initial" }}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{
              margin: "16px 0",
              color: themeColors.text.secondary,
            }}
          />
          <div
            style={{
              padding: tokens.spacing.lg,
              minHeight: "calc(100vh - 180px)",
              background: themeColors.background.primary,
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
            background: themeColors.layout.footer,
            color: themeColors.text.secondary,
          }}
        >
          Certificate Blockchain ©{new Date().getFullYear()}
        </Footer>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;

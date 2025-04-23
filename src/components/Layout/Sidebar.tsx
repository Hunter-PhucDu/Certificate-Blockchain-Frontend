"use client";

import React from "react";
import { Layout, Menu } from "antd";
import { useMenuItems } from "./routeConfig";
import { useTheme } from "@/providers/Provider";
import { darkThemeColors, lightThemeColors } from "@/configs/theme";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { isDarkMode } = useTheme();
  const menuItems = useMenuItems();

  // Choose theme colors
  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="dark" // Keep sidebar dark for better contrast in both modes
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001,
        background: themeColors.layout.sidebar,
        transition: "all 0.2s",
        boxShadow: isDarkMode ? "none" : "2px 0 8px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="logo"
        style={{
          height: 32,
          margin: 16,
          background: isDarkMode
            ? "rgba(255, 255, 255, 0.15)"
            : "rgba(255, 255, 255, 0.3)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          overflow: "hidden",
          letterSpacing: collapsed ? 0 : 1,
        }}
      >
        {!collapsed && "CERTIFICATE"}
        {collapsed && "C"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={collapsed ? [] : ["sub1", "sub2"]}
        items={menuItems}
        style={{
          borderRight: 0,
          background: themeColors.layout.sidebar,
        }}
      />
    </Sider>
  );
};

export default Sidebar;

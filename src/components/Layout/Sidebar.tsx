"use client";

import React from "react";
import { Divider, Layout, Menu } from "antd";
import { useMenuItems } from "./routeConfig";
import { useTheme } from "@/providers/Provider";
import { Box } from "../Elements";
import UserInfo from "./UserInfo";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { isDarkMode } = useTheme();
  const menuItems = useMenuItems();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="dark"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001,
        transition: "all 0.2s",
        boxShadow: isDarkMode
          ? "1px 0 8px rgba(255, 255, 255, 0.08)"
          : "2px 0 8px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        themeColor="text.primary"
        style={{
          height: 48,
          margin: 3,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          overflow: "hidden",
        }}
      >
        <UserInfo collapsed={collapsed} />
      </Box>
      <Divider style={{ marginTop: 13 }} />
      <Menu
        mode="inline"
        selectedKeys={["1"]}
        defaultOpenKeys={collapsed ? [] : ["sub1", "sub2"]}
        items={menuItems}
        style={{
          borderRight: 0,
        }}
      />
    </Sider>
  );
};

export default Sidebar;

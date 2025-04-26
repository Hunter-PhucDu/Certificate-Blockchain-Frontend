"use client";

import React from "react";
import type { MenuProps } from "antd";
import {
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  DesktopOutlined,
  SettingOutlined,
  KeyOutlined,
  AppstoreOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";

type MenuItem = Required<MenuProps>["items"][number];

interface MenuItemWithPath {
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode;
  path?: string;
}

function getItem(
  labelKey: string,
  key: React.Key,
  path: string,
  icon?: React.ReactNode,
  children?: MenuItemWithPath[],
): MenuItemWithPath {
  return {
    key,
    icon,
    children,
    label: path ? <Link href={path}>{labelKey}</Link> : labelKey,
    path,
  } as MenuItemWithPath;
}

export const useMenuItems = (): MenuItem[] => {
  const { t } = useTranslation();
  const { userRole } = useAuthStore();

  // Common menu items for all users
  const commonItems = [
    getItem(t("common.dashboard"), "dashboard", "/home", <PieChartOutlined />),
    getItem(
      t("common.certificates"),
      "certificates",
      "/certificates",
      <DesktopOutlined />,
    ),
    getItem(t("common.settings"), "settings", "/settings", <SettingOutlined />),
    getItem(
      t("common.changePassword"),
      "change-password",
      "/change-password",
      <KeyOutlined />,
    ),
  ];

  // Admin-specific menu items
  const adminItems = [
    ...commonItems,
    getItem(t("common.users.title"), "users", "", <UserOutlined />, [
      getItem(
        t("common.users.administrators"),
        "admins",
        "/users/administrators",
      ),
      getItem(t("common.users.organizations"), "orgs", "/users/organizations"),
    ]),
    getItem(
      t("common.organizations.title"),
      "organizations",
      "",
      <TeamOutlined />,
      [
        getItem(
          t("common.organizations.list"),
          "org-list",
          "/organizations/list",
        ),
        getItem(
          t("common.organizations.create"),
          "org-create",
          "/organizations/create",
        ),
      ],
    ),
    getItem(t("common.tenants"), "tenants", "/tenants", <BankOutlined />),
  ];

  // Organization-specific menu items
  const organizationItems = [
    ...commonItems,
    getItem(t("common.groups"), "groups", "/groups", <AppstoreOutlined />),
    getItem(t("common.documents"), "documents", "/documents", <FileOutlined />),
  ];

  // Return appropriate menu items based on user role
  if (userRole === "admin") {
    return adminItems;
  }

  return organizationItems; // Default to organization items
};

// Export standalone routes for direct use in sidebar component
export const sidebarRoutes = [
  {
    key: "dashboard",
    label: "common.dashboard",
    path: "/home",
    icon: <PieChartOutlined />,
  },
  {
    key: "certificates",
    label: "common.certificates",
    path: "/certificates",
    icon: <DesktopOutlined />,
  },
  {
    key: "users",
    label: "common.users.title",
    path: "",
    icon: <UserOutlined />,
    children: [
      {
        key: "admins",
        label: "common.users.administrators",
        path: "/users/administrators",
        icon: null,
      },
      {
        key: "orgs",
        label: "common.users.organizations",
        path: "/users/organizations",
        icon: null,
      },
    ],
  },
  {
    key: "organizations",
    label: "common.organizations.title",
    path: "",
    icon: <TeamOutlined />,
    children: [
      {
        key: "org-list",
        label: "common.organizations.list",
        path: "/organizations/list",
        icon: null,
      },
      {
        key: "org-create",
        label: "common.organizations.create",
        path: "/organizations/create",
        icon: null,
      },
    ],
  },
  {
    key: "groups",
    label: "common.groups",
    path: "/groups",
    icon: <AppstoreOutlined />,
  },
  {
    key: "documents",
    label: "common.documents",
    path: "/documents",
    icon: <FileOutlined />,
  },
  {
    key: "settings",
    label: "common.settings",
    path: "/settings",
    icon: <SettingOutlined />,
  },
  {
    key: "change-password",
    label: "common.changePassword",
    path: "/change-password",
    icon: <KeyOutlined />,
  },
];

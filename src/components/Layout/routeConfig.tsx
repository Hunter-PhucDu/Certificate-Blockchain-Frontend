"use client";

import React from "react";
import type { MenuProps } from "antd";
import {
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  HistoryOutlined,
  FileProtectOutlined,
  CloudServerOutlined,
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

  const commonItems = [
    getItem(t("common.dashboard"), "dashboard", "/home", <PieChartOutlined />),
    getItem(t("common.settings"), "settings", "/settings", <SettingOutlined />),
  ];

  const adminItems = [
    ...commonItems,
    getItem(
      t("common.logManagement"),
      "logs",
      "/log-management",
      <HistoryOutlined />,
    ),
    getItem(
      t("common.users.administrators"),
      "admins",
      "/admin-management",
      <UserOutlined />,
    ),
    getItem(
      t("common.organizations.title"),
      "organizations",
      "/organization-management",
      <TeamOutlined />,
    ),
    getItem(
      t("common.tenants.title"),
      "tenants",
      "/tenant-management",
      <CloudServerOutlined />,
    ),
  ];

  const organizationItems = [
    ...commonItems,
    getItem(
      t("common.logManagement"),
      "logs",
      "/log-management",
      <HistoryOutlined />,
    ),
    getItem(
      t("common.certificates.title"),
      "certificates",
      "/certificates",
      <FileProtectOutlined />,
    ),
  ];

  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return adminItems;
  }

  return organizationItems;
};

export const sidebarRoutes = [
  {
    key: "dashboard",
    label: "common.dashboard",
    path: "/home",
    icon: <PieChartOutlined />,
  },
  {
    key: "logs",
    label: "common.logManagement",
    path: "/log-management",
    icon: <HistoryOutlined />,
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
        path: "/admin-management",
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
        path: "/organization-management",
        icon: null,
      },
    ],
  },
  {
    key: "tenants",
    label: "common.tenants.title",
    path: "/tenant-management",
    icon: <CloudServerOutlined />,
  },
  {
    key: "certificates",
    label: "common.certificates.title",
    path: "/certificates",
    icon: <FileProtectOutlined />,
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
];

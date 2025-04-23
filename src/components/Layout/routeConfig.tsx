"use client";

import React from "react";
import type { MenuProps } from "antd";
import {
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/translations";

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
  const label = labelKey;

  return {
    key,
    icon,
    children,
    label: path ? <Link href={path}>{label}</Link> : label,
    path,
  } as MenuItemWithPath;
}

export const useMenuItems = (): MenuItem[] => {
  const { t } = useTranslations();

  return [
    getItem(t("common.dashboard"), "1", "/home", <PieChartOutlined />),
    getItem(
      t("common.certificates"),
      "2",
      "/certificates",
      <DesktopOutlined />,
    ),
    getItem(t("common.users.title"), "sub1", "", <UserOutlined />, [
      getItem(t("common.users.students"), "3", "/users/students"),
      getItem(t("common.users.teachers"), "4", "/users/teachers"),
      getItem(t("common.users.administrators"), "5", "/users/administrators"),
    ]),
    getItem(t("common.organizations.title"), "sub2", "", <TeamOutlined />, [
      getItem(t("common.organizations.schools"), "6", "/organizations/schools"),
      getItem(
        t("common.organizations.universities"),
        "7",
        "/organizations/universities",
      ),
    ]),
    getItem(t("common.documents"), "9", "/documents", <FileOutlined />),
  ];
};

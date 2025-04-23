"use client";

import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Button, Layout, Avatar, Space, Dropdown, theme } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/providers/Provider";
import { useLocale } from "@/providers/LocaleContext";
import {
  baseColors,
  lightThemeColors,
  darkThemeColors,
  shadows,
} from "@/configs/theme";
import { useTranslations } from "@/lib/i18n/translations";
import { localeNames, Locale } from "@/lib/i18n/config";

const { Header: AntHeader } = Layout;
const { useToken } = theme;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslations();
  const { token } = useToken();

  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;
  const currentShadow = isDarkMode ? shadows.dark.small : shadows.light.small;

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: t("common.profile"),
    },
    {
      key: "settings",
      label: t("common.settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("common.logout"),
      danger: true,
    },
  ];

  const languageMenuItems: MenuProps["items"] = Object.entries(localeNames).map(
    ([localeKey, localeName]) => ({
      key: localeKey,
      label: localeName,
      onClick: () => setLocale(localeKey as Locale),
      className: locale === localeKey ? "ant-dropdown-menu-item-active" : "",
    }),
  );

  return (
    <AntHeader
      style={{
        padding: 0,
        background: themeColors.layout.header,
        color: themeColors.text.primary,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        right: 0,
        width: `calc(100% - ${collapsed ? 80 : 200}px)`,
        zIndex: 1000,
        boxShadow: currentShadow,
        transition: "all 0.2s",
        height: 64,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
          color: themeColors.text.secondary,
        }}
      />
      <div style={{ paddingRight: 24 }}>
        <Space size="middle" align="center">
          <span
            style={{
              color: themeColors.text.primary,
              fontWeight: 500,
              fontSize: "16px",
            }}
          >
            {t("common.welcome")}
          </span>

          {/* Language Switcher */}
          <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
            <Button
              type="text"
              icon={<GlobalOutlined />}
              style={{
                fontSize: "16px",
                color: token.colorPrimary,
              }}
            />
          </Dropdown>

          {/* Theme Switcher */}
          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{
              fontSize: "16px",
              color: isDarkMode ? token.colorPrimaryActive : token.colorPrimary,
            }}
          />

          {/* User Menu */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              style={{
                backgroundColor: baseColors.primary.main,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;

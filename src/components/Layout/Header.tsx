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
import {
  baseColors,
  lightThemeColors,
  darkThemeColors,
  shadows,
} from "@/config/constants/theme";
import { languages } from "@/lib/i18n/settings";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/stores/languageStore";

const { Header: AntHeader } = Layout;
const { useToken } = theme;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguageStore();
  const { isDarkMode, toggleTheme } = useTheme();
  const { token } = useToken();

  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;
  const currentShadow = isDarkMode ? shadows.dark.small : shadows.light.small;

  const handleLanguageChange = (newLocale: string) => {
    setLanguage(newLocale);
  };

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

  const languageMenuItems: MenuProps["items"] = languages.map((locale) => ({
    key: locale,
    label: locale.toUpperCase(),
    onClick: () => handleLanguageChange(locale),
    className:
      locale === currentLanguage ? "ant-dropdown-menu-item-active" : "",
  }));

  return (
    <AntHeader
      style={{
        padding: 0,
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

          <Button
            type="text"
            icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{
              fontSize: "16px",
              color: isDarkMode ? token.colorPrimaryActive : token.colorPrimary,
            }}
          />

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

"use client";

import React from "react";
import { Button, Dropdown, Modal } from "antd";
import { LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useLogout } from "@/services/AuthService";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
`;

interface LogoutButtonProps {
  username?: string;
  variant?: "button" | "dropdown" | "menu-item";
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  username,
  variant = "button",
  className,
}) => {
  const { t } = useTranslation();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Modal.confirm({
      title: t("common.confirmLogout"),
      content: t("common.logoutConfirmMessage"),
      onOk: () => logoutMutation.mutate(),
      okText: t("common.yes"),
      cancelText: t("common.no"),
    });
  };

  // Simple button variant
  if (variant === "button") {
    return (
      <StyledButton
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className={className}
        type="text"
        danger
      >
        {t("common.logout")}
      </StyledButton>
    );
  }

  // Dropdown variant with user information
  if (variant === "dropdown") {
    const items = [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: t("common.profile"),
      },
      {
        key: "change-password",
        label: t("common.changePassword"),
        onClick: () => (window.location.href = "/change-password"),
      },
      {
        type: "divider" as const,
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: t("common.logout"),
        danger: true,
        onClick: handleLogout,
      },
    ];

    return (
      <Dropdown menu={{ items }} trigger={["click"]} className={className}>
        <Button type="text">
          <span>{username || t("common.account")}</span>
          <DownOutlined style={{ marginLeft: 8 }} />
        </Button>
      </Dropdown>
    );
  }

  // Menu item variant (for sidebar)
  return (
    <div
      onClick={handleLogout}
      className={className}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      <LogoutOutlined style={{ marginRight: 8 }} />
      {t("common.logout")}
    </div>
  );
};

export default LogoutButton;

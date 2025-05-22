"use client";

import React from "react";
import { Card, Typography, Avatar, Space } from "antd";
import { UserOutlined, IdcardOutlined } from "@ant-design/icons";
import { useTheme } from "@/providers/Provider";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { baseColors } from "@/config/constants/theme";

const { Title } = Typography;

const ProfilePreview = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Card
      title={
        <Space>
          <IdcardOutlined />
          {t("common.profile")}
        </Space>
      }
      style={{
        width: "100%",
        borderRadius: "8px",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(255, 255, 255, 0.08)"
          : "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Avatar
          style={{
            backgroundColor: baseColors.primary.main,
            width: "120px",
            height: "120px",
            fontSize: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "16px",
          }}
          icon={<UserOutlined />}
        />
        <Title level={3} style={{ margin: "8px 0" }}>
          {user.name}
        </Title>
      </div>
    </Card>
  );
};

export default ProfilePreview;

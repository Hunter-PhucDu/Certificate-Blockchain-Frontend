"use client";

import React from "react";
import { Form, Input, Button, Card, Space, App } from "antd";
import { LockOutlined, SaveOutlined, KeyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/providers/Provider";
import { useAuthStore } from "@/stores/authStore";
import { useChangePassword } from "@/services/AdminService";
import { useChangeOrganizationPassword } from "@/services/OrganizationService";

interface PasswordChangeValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordChangeForm = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();
  const { message } = App.useApp();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isOrganization = user?.role === "ORGANIZATION";

  const adminPasswordMutation = useChangePassword();
  const orgPasswordMutation = useChangeOrganizationPassword();

  const handleSubmit = async (values: PasswordChangeValues) => {
    try {
      const payload = {
        password: values.currentPassword,
        newPassword: values.newPassword,
      };

      if (isAdmin) {
        await adminPasswordMutation.mutateAsync(payload);
      } else if (isOrganization) {
        await orgPasswordMutation.mutateAsync(payload);
      }

      message.success("Cập nhật mật khẩu thành công");
      form.resetFields();
    } catch (error) {
      message.error(t("common.changePassword.error"));
      console.error("Failed to change password:", error);
    }
  };

  const isLoading = isAdmin
    ? adminPasswordMutation.isPending
    : orgPasswordMutation.isPending;

  return (
    <Card
      title={
        <Space>
          <KeyOutlined />
          {t("common.changePassword.title")}
        </Space>
      }
      style={{
        width: "100%",
        borderRadius: "8px",
        marginTop: "24px",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(255, 255, 255, 0.08)"
          : "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="currentPassword"
          label={t("common.changePassword.currentPassword")}
          rules={[
            {
              required: true,
              message: t("common.changePassword.currentPasswordRequired"),
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("common.changePassword.currentPassword")}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label={t("common.changePassword.newPassword")}
          rules={[
            {
              required: true,
              message: t("common.changePassword.newPasswordRequired"),
            },
            {
              min: 6,
              message: t("common.changePassword.passwordMinLength"),
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("common.changePassword.newPassword")}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t("common.changePassword.confirmPassword")}
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: t("common.changePassword.confirmPasswordRequired"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("common.changePassword.passwordMismatch")),
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t("common.changePassword.confirmPassword")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isLoading}
            style={{ width: "100%" }}
          >
            {t("common.update")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PasswordChangeForm;

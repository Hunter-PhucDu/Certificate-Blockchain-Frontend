"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { ChangePasswordBody, useChangePassword } from "@/services/AdminService";

const { Title, Paragraph } = Typography;

const ChangePasswordContainer = styled.div`
  padding: 24px;
  max-width: 500px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  margin-bottom: 24px;
`;

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const changePasswordMutation = useChangePassword();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ChangePasswordBody) => {
    try {
      setLoading(true);
      await changePasswordMutation.mutateAsync(values);
      message.success("Mật khẩu đã được thay đổi thành công");
      // Reset form after successful submission
      form.resetFields();
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        "Không thể thay đổi mật khẩu, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChangePasswordContainer>
      <StyledCard>
        <HeaderContainer>
          <Title level={3}>{t("common.changePassword")}</Title>
          <Paragraph type="secondary">
            Đổi mật khẩu cho tài khoản của bạn
          </Paragraph>
        </HeaderContainer>

        <Form<ChangePasswordBody>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="password"
            label={t("common.currentPassword")}
            rules={[
              { required: true, message: t("common.currentPasswordRequired") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("common.currentPassword")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={t("common.newPassword")}
            rules={[
              { required: true, message: t("common.newPasswordRequired") },
              { min: 8, message: t("common.passwordMinLength") },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("common.newPassword")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t("common.confirmPassword")}
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: t("common.confirmPasswordRequired") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("common.passwordsMustMatch")),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("common.confirmPassword")}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={changePasswordMutation.isPending || loading}
              style={{ width: "100%" }}
            >
              {t("common.changePassword")}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </ChangePasswordContainer>
  );
};

export default ChangePasswordPage;

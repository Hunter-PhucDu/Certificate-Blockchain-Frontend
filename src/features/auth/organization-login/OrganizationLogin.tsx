"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Checkbox, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LoginRequestDto, useOrganizationLogin } from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import Loader from "@/components/Elements/Loader";

const { Title, Paragraph, Text } = Typography;

const OrganizationLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #051937, #004d7a, #008793, #00bf72);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  padding: 20px;

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const OrganizationLoginPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [form] = Form.useForm();
  const organizationLoginMutation = useOrganizationLogin();
  const [loading, setLoading] = useState(false);
  const {
    isAuthenticated,
    isLoading,
    initializeFromStorage,
    setLoading: setAuthLoading,
  } = useAuthStore();

  useEffect(() => {
    setAuthLoading(true);
    initializeFromStorage();
  }, [initializeFromStorage, setAuthLoading]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (values: LoginRequestDto) => {
    try {
      setLoading(true);
      await organizationLoginMutation.mutateAsync(values);
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        "Đăng nhập thất bại, vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <OrganizationLoginContainer>
      <StyledCard>
        <HeaderContainer>
          <Title level={2} style={{ marginBottom: "8px", fontWeight: 600 }}>
            {t("common.organizationLogin")}
          </Title>
          <Paragraph type="secondary">
            Đăng nhập với tài khoản tổ chức để truy cập hệ thống chứng chỉ
          </Paragraph>
        </HeaderContainer>

        <Form<LoginRequestDto>
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ username: "", password: "" }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: t("common.usernameRequired") }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder={t("common.username")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t("common.passwordRequired") }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder={t("common.password")}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Checkbox>{t("common.rememberMe")}</Checkbox>
              <Link href="/organization-forgot-password">
                <Text type="secondary" style={{ cursor: "pointer" }}>
                  {t("common.forgotPassword")}
                </Text>
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={organizationLoginMutation.isPending || loading}
            >
              {t("common.login")}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="link"
              block
              onClick={() => router.push("/admin-login")}
            >
              {t("common.switchToAdminLogin")}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </OrganizationLoginContainer>
  );
};

export default OrganizationLoginPage;

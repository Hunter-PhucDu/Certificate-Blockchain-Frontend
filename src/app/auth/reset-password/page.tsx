"use client";

import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  ResetPasswordWithTokenRequestDto,
  useResetPasswordWithToken,
} from "@/services/AuthService";

const { Title, Paragraph } = Typography;

const ResetPasswordContainer = styled.div`
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
  max-width: 450px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("Reset Password Page Mounted");
    console.log("Token:", token);
  }, [token]);

  const resetPasswordMutation = useResetPasswordWithToken();

  const handleResetPassword = async (
    values: ResetPasswordWithTokenRequestDto,
  ) => {
    if (!token) {
      message.error("Token không hợp lệ hoặc đã hết hạn.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, ...values });
      message.success("Mật khẩu đã được đặt lại thành công.");
      router.push("/login");
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        "Không thể đặt lại mật khẩu. Vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  if (!token) {
    return (
      <ResetPasswordContainer>
        <StyledCard>
          <HeaderContainer>
            <Title level={2} style={{ marginBottom: "8px", fontWeight: 600 }}>
              {t("common.resetPassword")}
            </Title>
            <Paragraph type="secondary">
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </Paragraph>
          </HeaderContainer>
        </StyledCard>
      </ResetPasswordContainer>
    );
  }

  return (
    <ResetPasswordContainer>
      <StyledCard>
        <HeaderContainer>
          <Title level={2} style={{ marginBottom: "8px", fontWeight: 600 }}>
            {t("common.resetPassword")}
          </Title>
          <Paragraph type="secondary">
            Vui lòng nhập mật khẩu mới của bạn
          </Paragraph>
        </HeaderContainer>

        <Form<ResetPasswordWithTokenRequestDto>
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: t("common.passwordRequired") },
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
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: t("common.confirmPasswordRequired"),
              },
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
              block
              loading={resetPasswordMutation.isPending}
            >
              {t("common.resetPassword")}
            </Button>
          </Form.Item>
        </Form>
      </StyledCard>
    </ResetPasswordContainer>
  );
};

export default ResetPasswordPage;

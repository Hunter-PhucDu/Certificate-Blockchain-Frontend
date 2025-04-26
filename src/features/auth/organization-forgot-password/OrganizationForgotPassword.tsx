"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Steps, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  OtpForgotPasswordRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordLinkRequestDto,
  useOrganizationGetOtpForgotPassword,
  useOrganizationForgotPassword,
  useOrganizationResetPassword,
} from "@/services/AuthService";

const { Title, Paragraph } = Typography;

const ForgotPasswordContainer = styled.div`
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

const StyledSteps = styled(Steps)`
  margin-bottom: 32px;
`;

const OrganizationForgotPasswordPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [emailForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [resetForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");

  const getOtpMutation = useOrganizationGetOtpForgotPassword();
  const verifyOtpMutation = useOrganizationForgotPassword();
  const resetPasswordMutation = useOrganizationResetPassword();

  const handleRequestOtp = async (values: OtpForgotPasswordRequestDto) => {
    try {
      await getOtpMutation.mutateAsync(values);
      setEmail(values.email);
      message.success("Mã OTP đã được gửi đến email của bạn.");
      setCurrentStep(1);
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        "Không thể gửi OTP. Vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  const handleVerifyOtp = async (values: ForgotPasswordRequestDto) => {
    try {
      await verifyOtpMutation.mutateAsync({ ...values, email });
      message.success("Xác thực OTP thành công.");
      setCurrentStep(2);
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        "Mã OTP không hợp lệ. Vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  const handleResetPassword = async (values: ResetPasswordLinkRequestDto) => {
    try {
      await resetPasswordMutation.mutateAsync(values);
      message.success("Mật khẩu đã được cập nhật thành công.");
      router.push("/organization-login");
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form<OtpForgotPasswordRequestDto>
            form={emailForm}
            layout="vertical"
            onFinish={handleRequestOtp}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t("common.emailRequired") },
                { type: "email", message: t("common.invalidEmail") },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t("common.email")}
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={getOtpMutation.isPending}
              >
                {t("common.sendOtp")}
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="link"
                block
                onClick={() => router.push("/organization-login")}
              >
                {t("common.backToLogin")}
              </Button>
            </Form.Item>
          </Form>
        );
      case 1:
        return (
          <Form<ForgotPasswordRequestDto>
            form={otpForm}
            layout="vertical"
            onFinish={handleVerifyOtp}
          >
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: t("common.otpRequired") },
                { min: 6, max: 6, message: t("common.invalidOtp") },
              ]}
            >
              <Input
                placeholder={t("common.enterOtp")}
                size="large"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={verifyOtpMutation.isPending}
              >
                {t("common.verifyOtp")}
              </Button>
              <Button
                type="link"
                block
                onClick={() => {
                  setCurrentStep(0);
                  emailForm.resetFields();
                }}
              >
                {t("common.resendOtp")}
              </Button>
            </Form.Item>
          </Form>
        );
      case 2:
        return (
          <Form<ResetPasswordLinkRequestDto>
            form={resetForm}
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
        );
      default:
        return null;
    }
  };

  return (
    <ForgotPasswordContainer>
      <StyledCard>
        <HeaderContainer>
          <Title level={2} style={{ marginBottom: "8px", fontWeight: 600 }}>
            {t("common.forgotPassword")}
          </Title>
          <Paragraph type="secondary">
            Khôi phục mật khẩu tổ chức của bạn
          </Paragraph>
        </HeaderContainer>

        <StyledSteps
          current={currentStep}
          direction="horizontal"
          items={[
            { title: t("common.enterEmail") },
            { title: t("common.verifyOtp") },
            { title: t("common.resetPassword") },
          ]}
        />

        {renderStepContent()}
      </StyledCard>
    </ForgotPasswordContainer>
  );
};

export default OrganizationForgotPasswordPage;

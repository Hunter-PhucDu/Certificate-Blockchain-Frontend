/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Form, Input, Button, Card, Typography, Steps, Col } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  OtpForgotPasswordRequestDto,
  useOrganizationGetOtpForgotPassword,
  useOrganizationSendLinkResetPassword,
} from "@/services/AuthService";
import OtpInputComponent from "@/components/Elements/OtpInput";
import { useToast } from "@/components/Elements/Toast";
import { BlockchainLoginBackground } from "@/components/BlockchainUI";
import styled from "@emotion/styled";

const { Title, Paragraph } = Typography;

const steps = [
  {
    title: "Nhập email",
    description: "Nhập email của bạn",
  },
  {
    title: "Xác thực OTP",
    description: "Nhập mã OTP",
  },
];

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }

  .ant-card-body {
    padding: 2rem;
  }
`;

const FormCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
`;

const OrganizationForgotPasswordPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [emailForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const getOtpMutation = useOrganizationGetOtpForgotPassword();
  const sendLinkMutation = useOrganizationSendLinkResetPassword();

  const handleRequestOtp = async (values: OtpForgotPasswordRequestDto) => {
    getOtpMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Mã OTP đã được gửi đến email của bạn");
        setEmail(values.email);
        setCurrentStep(1);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Có lỗi xảy ra khi gửi mã OTP",
        );
      },
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    sendLinkMutation.mutate(
      { otp, email },
      {
        onSuccess: () => {
          toast.success("Xác thực OTP thành công");
          router.push("/login");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Mã OTP không hợp lệ");
        },
      },
    );
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
                { required: true, message: "Email là bắt buộc" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
              style={{ marginBottom: 30 }}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={"Email"}
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
                {"Gửi mã OTP"}
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="link" block onClick={() => router.push("/login")}>
                {"Quay lại đăng nhập"}
              </Button>
            </Form.Item>
          </Form>
        );
      case 1:
        return (
          <div>
            <OtpInputComponent
              value={otp}
              onChange={setOtp}
              length={6}
              isDisabled={sendLinkMutation.isPending}
            />

            <Form.Item style={{ marginTop: "20px" }}>
              <Button
                type="primary"
                size="large"
                block
                loading={sendLinkMutation.isPending}
                onClick={handleVerifyOtp}
              >
                {"Gửi liên kết khôi phục mật khẩu"}
              </Button>
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BlockchainLoginBackground tagline="Hệ thống xác thực chứng chỉ blockchain dành cho tổ chức giáo dục và doanh nghiệp">
      <FormCol>
        <StyledCard>
          <div className="text-center mb-6">
            <Title level={2} className="mb-2 font-semibold">
              Quên mật khẩu
            </Title>
            <Paragraph type="secondary">
              Khôi phục mật khẩu tổ chức của bạn
            </Paragraph>
          </div>

          <Steps current={currentStep} items={steps} className="mb-8" />

          <div className="mt-8">{renderStepContent()}</div>
        </StyledCard>
      </FormCol>
    </BlockchainLoginBackground>
  );
};

export default OrganizationForgotPasswordPage;

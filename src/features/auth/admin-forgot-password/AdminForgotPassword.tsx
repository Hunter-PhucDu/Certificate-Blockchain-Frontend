"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Steps, Col } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  OtpForgotPasswordRequestDto,
  useAdminGetOtpForgotPassword,
  useAdminSendLinkResetPassword,
} from "@/services/AuthService";
import OtpInputComponent from "@/components/Elements/OtpInput";
import { useToast } from "@/components/Elements/Toast";
import { BlockchainLoginBackground } from "@/components/BlockchainUI";
import styled from "@emotion/styled";

const { Title, Paragraph } = Typography;

const steps = [
  {
    title: "Lấy mã OTP",
  },
  {
    title: "Xác thực mã OTP",
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

const AdminForgotPasswordPage = () => {
  const router = useRouter();
  const [emailForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const getOtpMutation = useAdminGetOtpForgotPassword();
  const sendLinkMutation = useAdminSendLinkResetPassword();

  const handleRequestOtp = async (values: OtpForgotPasswordRequestDto) => {
    getOtpMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Mã OTP đã được gửi đến email của bạn");
        setEmail(values.email);
        setCurrentStep(1);
      },
      onError: () => {
        toast.error("Đã xảy ra lỗi khi gửi mã OTP.");
      },
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số mã OTP");
      return;
    }

    sendLinkMutation.mutate(
      { otp, email },
      {
        onSuccess: () => {
          toast.success("Xác thực mã OTP thành công");
        },
        onError: () => {
          toast.error("Mã OTP không hợp lệ");
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
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Vui lòng nhập email hợp lệ!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
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
                Gửi mã OTP
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="link"
                block
                onClick={() => router.push("/admin-login")}
              >
                Quay lại đăng nhập
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
                Verify OTP
              </Button>
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BlockchainLoginBackground tagline="Hệ thống xác thực chứng chỉ blockchain an toàn, minh bạch và đáng tin cậy">
      <FormCol>
        <StyledCard>
          <div className="text-center mb-6">
            <Title level={2} className="mb-2 font-semibold">
              Quên mật khẩu
            </Title>
            <Paragraph type="secondary">
              Khôi phục mật khẩu quản trị viên
            </Paragraph>
          </div>

          <Steps current={currentStep} items={steps} className="mb-8" />

          <div className="mt-8">{renderStepContent()}</div>
        </StyledCard>
      </FormCol>
    </BlockchainLoginBackground>
  );
};

export default AdminForgotPasswordPage;

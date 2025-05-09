"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Steps, Row } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  OtpForgotPasswordRequestDto,
  useAdminGetOtpForgotPassword,
  useAdminSendLinkResetPassword,
} from "@/services/AuthService";
import OtpInputComponent from "@/components/Elements/OtpInput";
import { useToast } from "@/components/Elements/Toast";

const { Title, Paragraph } = Typography;

const steps = [
  {
    title: "Get OTP",
  },
  {
    title: "Verify OTP",
  },
];

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
        toast.success("OTP code has been sent to your email");
        setEmail(values.email);
        setCurrentStep(1);
      },
      onError: () => {
        toast.error("An error occurred while sending the OTP code.");
      },
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter full 6 OTP digits");
      return;
    }

    sendLinkMutation.mutate(
      { otp, email },
      {
        onSuccess: () => {
          toast.success("OTP authentication successful");
        },
        onError: () => {
          toast.error("Invalid OTP code");
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
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
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
                Send OTP
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="link"
                block
                onClick={() => router.push("/admin-login")}
              >
                Back to Login
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

            <Form.Item>
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
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        background: "url('/login-bg.jpg') no-repeat center/cover",
      }}
    >
      <Card className="w-full max-w-[450px]">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2 font-semibold">
            Forgot Password
          </Title>
          <Paragraph type="secondary">
            Recover your administrator password
          </Paragraph>
        </div>

        <Steps current={currentStep} items={steps} className="mb-16" />

        <div className="mt-8">{renderStepContent()}</div>
      </Card>
    </Row>
  );
};

export default AdminForgotPasswordPage;

"use client";

import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Form, Input, Button, Card, Typography, Steps } from "antd";
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
              <Button type="link" block onClick={() => router.push("/login")}>
                {t("common.backToLogin")}
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
                {t("common.sendResetLink")}
              </Button>
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5">
      <Card className="w-full max-w-[450px]">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2 font-semibold">
            {t("common.forgotPassword")}
          </Title>
          <Paragraph type="secondary">
            Khôi phục mật khẩu tổ chức của bạn
          </Paragraph>
        </div>

        <Steps current={currentStep} items={steps} className="mb-16" />

        <div className="mt-8">{renderStepContent()}</div>
      </Card>
    </div>
  );
};

export default OrganizationForgotPasswordPage;

"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography, Col } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useChangePassword } from "@/services/AdminService";
import { useToast } from "@/components/Elements/Toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BlockchainBackground } from "@/components/BlockchainUI";
import styled from "@emotion/styled";

const { Title } = Typography;

interface ChangePasswordForm {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

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

const ChangePassword = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const changePasswordMutation = useChangePassword();

  const onFinish = async (values: ChangePasswordForm) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t("common.changePassword.passwordMismatch"));
      return;
    }

    setLoading(true);
    try {
      await changePasswordMutation.mutateAsync({
        password: values.password,
        newPassword: values.newPassword,
      });
      toast.success(t("common.changePassword.success"));
      router.push("/auth/login");
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        t("common.changePassword.error");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlockchainBackground tagline="Hệ thống xác thực chứng chỉ blockchain an toàn và minh bạch">
      <FormCol>
        <StyledCard>
          <Title level={2} className="text-center mb-6">
            {t("common.changePassword.title")}
          </Title>
          <Form
            name="change-password"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="password"
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
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
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
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
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
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                size="large"
                loading={loading}
              >
                {t("common.changePassword.title")}
              </Button>
            </Form.Item>
          </Form>
        </StyledCard>
      </FormCol>
    </BlockchainBackground>
  );
};

export default ChangePassword;

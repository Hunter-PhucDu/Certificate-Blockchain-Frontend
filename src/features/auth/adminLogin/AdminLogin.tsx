"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Checkbox,
  Card,
  Typography,
  Row,
  Col,
  Button,
  Spin,
} from "antd";
import { MailOutlined, LockOutlined, BlockOutlined } from "@ant-design/icons";
import { AuthService, LoginRequestDto } from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/Elements/Toast";
import Link from "next/link";
import styled from "@emotion/styled";
import { BlockchainBackground } from "@/components/BlockchainUI";

const { Title, Paragraph, Text } = Typography;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
  }

  .ant-card-body {
    padding: 2rem;
  }
`;

const LoginButton = styled(Button)`
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(45, 79, 163, 0.25);
  transition: all 0.3s ease;
  letter-spacing: 1px;

  &:hover,
  &:focus {
    background: linear-gradient(135deg, #1a3a6a 0%, #3d5fb3 100%);
    box-shadow: 0 6px 15px rgba(45, 79, 163, 0.35);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(45, 79, 163, 0.2);
  }
`;

const StyledInput = styled(Input)`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  padding-left: 15px;

  &:hover,
  &:focus {
    border-color: #2d4fa3;
    box-shadow: 0 0 0 2px rgba(45, 79, 163, 0.1);
  }

  .ant-input-prefix {
    margin-right: 10px;
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  padding-left: 15px;

  &:hover,
  &:focus {
    border-color: #2d4fa3;
    box-shadow: 0 0 0 2px rgba(45, 79, 163, 0.1);
  }

  .ant-input-prefix {
    margin-right: 10px;
  }
`;

const ForgotPasswordLink = styled(Link)`
  color: #2d4fa3;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #0f2852;
    text-decoration: underline;
  }
`;

const LoginFormCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 5;
`;

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    initializeFromStorage,
    setLoading,
    setTokens,
  } = useAuthStore();

  const [submitting, setSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  useEffect(() => {
    setLoading(true);
    initializeFromStorage();
  }, [initializeFromStorage, setLoading]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/home");
    }
  });

  const onFinish = async (values: LoginRequestDto) => {
    setSubmitting(true);
    try {
      const resp = await AuthService.adminLogin(values);
      const { accessToken, refreshToken } = resp.data;
      setTokens(accessToken, refreshToken);
      toast.success("Đăng nhập thành công!");
      router.replace("/home");
    } catch (error: unknown) {
      const resp = error as {
        response?: { data?: { data?: { message?: string } } };
      };
      const msg =
        resp?.response?.data?.data?.message ||
        "Đăng nhập thất bại, vui lòng thử lại.";
      toast.error(msg);
      setLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldsChange = () => {
    if (!formTouched) setFormTouched(true);
  };

  if (isLoading) {
    return (
      <BlockchainBackground tagline="Hệ thống xác thực chứng chỉ blockchain an toàn, minh bạch và đáng tin cậy">
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <Spin size="large" />
          <Title level={4} style={{ color: "white", marginTop: 20 }}>
            Đang tải...
          </Title>
        </div>
      </BlockchainBackground>
    );
  }

  return (
    <BlockchainBackground tagline="Hệ thống xác thực chứng chỉ blockchain an toàn, minh bạch và đáng tin cậy">
      <LoginFormCol xs={24} md={12}>
        <StyledCard>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <BlockOutlined
              style={{
                fontSize: 40,
                color: "#0F2852",
                marginBottom: 16,
                animation: "pulse 2s infinite ease-in-out",
              }}
            />
            <Title
              level={2}
              style={{
                marginBottom: 8,
                color: "#0F2852",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              Đăng Nhập Admin
            </Title>
            <Paragraph
              type="secondary"
              style={{
                fontSize: "16px",
                marginBottom: 20,
              }}
            >
              Quản lý chứng chỉ trên nền tảng blockchain
            </Paragraph>
          </div>

          <Form<LoginRequestDto>
            layout="vertical"
            initialValues={{ username: "", password: "" }}
            onFinish={onFinish}
            size="large"
            onFieldsChange={handleFieldsChange}
            className={formTouched ? "form-touched" : ""}
          >
            <Form.Item
              name="username"
              label={<Text strong>Tên người dùng</Text>}
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <StyledInput
                prefix={<MailOutlined style={{ color: "#2D4FA3" }} />}
                placeholder="Nhập tên người dùng"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text strong>Mật khẩu</Text>}
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <StyledPasswordInput
                prefix={<LockOutlined style={{ color: "#2D4FA3" }} />}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                <ForgotPasswordLink href="/admin-forgot-password">
                  Quên mật khẩu?
                </ForgotPasswordLink>
              </Row>
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }}>
              <LoginButton
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
              >
                ĐĂNG NHẬP
              </LoginButton>
            </Form.Item>
          </Form>
        </StyledCard>
      </LoginFormCol>
    </BlockchainBackground>
  );
}

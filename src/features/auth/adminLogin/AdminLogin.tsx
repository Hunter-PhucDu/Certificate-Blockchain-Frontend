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
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { AuthService, LoginRequestDto } from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/Elements/Toast";
import Link from "next/link";

const { Title, Paragraph } = Typography;

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

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        background: "url('/login-bg.jpg') no-repeat center/cover",
      }}
    >
      <Col xs={20} sm={16} md={12} lg={8} xl={6}>
        <Card
          hoverable
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
            Login
          </Title>
          <Paragraph
            type="secondary"
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            Login to access the certificate management system
          </Paragraph>

          <Form<LoginRequestDto>
            layout="vertical"
            initialValues={{ username: "", password: "" }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter Username" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={"Username"}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={"Password"}
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Checkbox>{"Remember Me"}</Checkbox>
                <Link href="/admin-forgot-password">{"Forgot Password"}</Link>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={submitting}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

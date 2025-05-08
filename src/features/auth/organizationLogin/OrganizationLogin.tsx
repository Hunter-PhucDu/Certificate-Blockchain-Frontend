"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  Row,
  Col,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Elements/Toast";
import { LoginRequestDto, useOrganizationLogin } from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function OrganizationLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [form] = Form.useForm<LoginRequestDto>();
  const organizationLogin = useOrganizationLogin();
  const {
    isAuthenticated,
    isLoading,
    initializeFromStorage,
    setLoading: setAuthLoading,
  } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAuthLoading(true);
    initializeFromStorage();
  }, [initializeFromStorage, setAuthLoading]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  const onFinish = async (values: LoginRequestDto) => {
    setSubmitting(true);
    try {
      await organizationLogin.mutateAsync(values);
      toast.success("Đăng nhập thành công");
      router.replace("/home");
    } catch (error: unknown) {
      const resp = error as {
        response?: { data?: { data?: { message?: string } } };
      };
      const msg =
        resp?.response?.data?.data?.message ||
        "Đăng nhập thất bại, vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return null;

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
          style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
        >
          <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
            {"Organization Login"}
          </Title>
          <Paragraph
            type="secondary"
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            {"Đăng nhập với tài khoản tổ chức để truy cập hệ thống chứng chỉ"}
          </Paragraph>

          <Form
            form={form}
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
                placeholder="Username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter Password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Row justify="space-between" align="middle">
                <Checkbox>{"Remember Me"}</Checkbox>
                <Link href="/forgot-password">{"Forgot Password"}</Link>
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
                {"Login"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

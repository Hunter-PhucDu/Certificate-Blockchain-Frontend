"use client";

import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useChangePassword } from "@/services/AdminService";
import { useToast } from "@/components/Elements/Toast";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface ChangePasswordForm {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const changePasswordMutation = useChangePassword();

  const onFinish = async (values: ChangePasswordForm) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    setLoading(true);
    try {
      await changePasswordMutation.mutateAsync({
        password: values.password,
        newPassword: values.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      router.push("/auth/login");
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        errorResponse?.response?.data?.message ||
        "Đổi mật khẩu thất bại, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-8">
          Đổi mật khẩu
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
                message: "Vui lòng nhập mật khẩu hiện tại",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu hiện tại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới",
              },
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu mới",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
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
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;

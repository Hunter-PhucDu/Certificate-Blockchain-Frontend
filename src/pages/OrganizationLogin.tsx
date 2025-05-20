import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, SwapOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import BlockchainBackground from "../components/BlockchainUI/BlockchainBackground";
import BlockchainFormElements from "../components/BlockchainUI/BlockchainFormElements";

const OrganizationLogin: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    // TODO: Implement actual login logic
    console.log("Success:", values);
    message.success("Đăng nhập thành công!");
    navigate("/organization/dashboard");
  };

  return (
    <BlockchainBackground>
      <BlockchainFormElements
        title="Đăng nhập Tổ chức"
        onFinish={onFinish}
        switchLoginText="Chuyển đến đăng nhập admin"
        switchLoginHref="/admin-login"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Tên đăng nhập"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </BlockchainFormElements>
    </BlockchainBackground>
  );
};

export default OrganizationLogin;

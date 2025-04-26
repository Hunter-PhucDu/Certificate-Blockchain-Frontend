/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Form, Input, Checkbox, Card, Typography } from "antd";
import { AuthService, SignInBody } from "@/services/AuthService";
import { useAuthStore } from "@/stores/authStore";
import Loader from "@/components/Elements/Loader";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  StyledSignForm,
  StyledRememberMe,
  StyledSignLink,
  StyledSignTextGrey,
  StyledSignLinkTag,
  SignInButton,
} from "./index.styled";
import styled, { keyframes } from "styled-components";

const { Title } = Typography;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 0.8; }
  100% { opacity: 0.6; }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #051937, #004d7a, #008793, #00bf72);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  position: relative;
  overflow: hidden;

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    z-index: 0;
  }

  &::before {
    top: -100px;
    right: -100px;
    animation: ${float} 6s ease-in-out infinite;
  }

  &::after {
    bottom: -100px;
    left: -100px;
    animation: ${float} 8s ease-in-out infinite;
  }
`;

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: ${pulse} 4s infinite;
  z-index: 0;
  backdrop-filter: blur(1px);
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  z-index: 1;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  }

  .ant-card-head {
    border-bottom: none;
    padding-bottom: 0;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const SignIn = () => {
  const { t } = useTranslation();
  const {
    isAuthenticated,
    isLoading,
    initializeFromStorage,
    setLoading,
    setTokens,
  } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const [key, setKey] = useState(0);

  const [circles, setCircles] = useState<
    { top: string; left: string; size: string; delay: string }[]
  >([]);

  useEffect(() => {
    const newCircles = Array.from({ length: 8 }, (_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 200 + 50}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setCircles(newCircles);
  }, []);

  useEffect(() => {
    setLoading(true);
    initializeFromStorage();
    setKey((prev) => prev + 1);
  }, [pathname, initializeFromStorage, setLoading]);

  if (isAuthenticated && !isLoading) {
    redirect("/home");
  }

  const signInUser = async (values: SignInBody) => {
    setError(null);
    setLoading(true);
    try {
      const { accessToken, refreshToken } =
        await AuthService.adminSignIn(values);
      setTokens(accessToken, refreshToken);
    } catch (error: unknown) {
      setError(`Đăng nhập thất bại, ${error}`);
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Loader key={`loader-${key}`} />;
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onGoToForgetPassword = () => {
    redirect("/forget-password");
  };

  return (
    <LoginContainer>
      {circles.map((circle, i) => (
        <Circle
          key={i}
          style={{
            top: circle.top,
            left: circle.left,
            width: circle.size,
            height: circle.size,
            animationDelay: circle.delay,
          }}
        />
      ))}

      <StyledCard>
        <HeaderContainer>
          <Title level={2} style={{ marginBottom: "8px", fontWeight: 600 }}>
            Đăng nhập
          </Title>
          <Typography.Paragraph type="secondary">
            Đăng nhập để truy cập hệ thống quản lý chứng chỉ
          </Typography.Paragraph>
        </HeaderContainer>

        <StyledSignForm
          name="basic"
          initialValues={{
            remember: true,
            username: "",
            password: "",
          }}
          onFinish={signInUser}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            className="form-field"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder={t("common.username")} size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            className="form-field"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder={t("common.password")} size="large" />
          </Form.Item>

          <StyledRememberMe>
            <Checkbox>{t("common.rememberMe")}</Checkbox>

            <StyledSignLink onClick={onGoToForgetPassword}>
              {t("common.forgetPassword")}
            </StyledSignLink>
          </StyledRememberMe>

          {error && (
            <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
          )}

          <div className="form-btn-field">
            <SignInButton type="primary" htmlType="submit" size="large">
              {t("common.login")}
            </SignInButton>
          </div>

          <div className="form-field-action">
            <StyledSignTextGrey>
              {t("common.dontHaveAccount")}
            </StyledSignTextGrey>
            <StyledSignLinkTag href="/signup">
              {t("common.signup")}
            </StyledSignLinkTag>
          </div>
        </StyledSignForm>
      </StyledCard>
    </LoginContainer>
  );
};

export default SignIn;

import React from "react";
import { Card, Typography, Row, Col } from "antd";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import {
  BlockchainBackground,
  BlockchainFormElements,
  BlockchainIllustration,
} from "@/components/BlockchainUI";

const { Title } = Typography;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 1200px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 2rem !important;
  color: #0f2852 !important;
  font-weight: 700 !important;
`;

const OrganizationLogin: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      // TODO: Implement login logic
      console.log("Login values:", values);
      router.push("/organization/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlockchainBackground>
      <LoginContainer>
        <StyledCard>
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <BlockchainIllustration
                imageSrc="/images/organization-login-illustration.svg"
                alt="Organization Login Illustration"
              />
            </Col>
            <Col xs={24} lg={12}>
              <StyledTitle level={2}>Đăng nhập Tổ chức</StyledTitle>
              <BlockchainFormElements
                onFinish={handleLogin}
                loading={loading}
                formType="login"
                switchLoginPath="/admin/login"
                switchLoginText="Đăng nhập với tư cách admin"
                forgotPasswordPath="/organization/forgot-password"
              />
            </Col>
          </Row>
        </StyledCard>
      </LoginContainer>
    </BlockchainBackground>
  );
};

export default OrganizationLogin;

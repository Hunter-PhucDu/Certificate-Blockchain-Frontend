"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Layout,
  Typography,
  List,
  Card,
  Empty,
  Spin,
  Divider,
  Row,
  Col,
  Badge,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  BlockOutlined,
  CheckCircleOutlined,
  BuildOutlined,
  GlobalOutlined,
  VerifiedOutlined,
  FileProtectOutlined,
  LockOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useSearchSubdomains } from "@/services/TenantService";
import styled from "@emotion/styled";
import Link from "next/link";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const StyledHeader = styled(Header)`
  background: rgba(3, 4, 58, 0.95);
  backdrop-filter: blur(8px);
  position: fixed;
  width: 100%;
  z-index: 100;
  padding: 0 50px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #0f2852 0%, #1a3a6a 50%, #2d4fa3 100%);
  padding: 180px 0 160px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("/images/blockchain-pattern.png");
    background-size: cover;
    opacity: 0.1;
    z-index: 1;
    animation: pulse 10s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    0% {
      opacity: 0.05;
      transform: scale(1);
    }
    100% {
      opacity: 0.2;
      transform: scale(1.05);
    }
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;

const FloatingGraphic = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 8s infinite ease-in-out;
  }

  .circle:nth-of-type(1) {
    width: 150px;
    height: 150px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .circle:nth-of-type(2) {
    width: 80px;
    height: 80px;
    top: 60%;
    left: 20%;
    animation-delay: 1s;
  }

  .circle:nth-of-type(3) {
    width: 100px;
    height: 100px;
    top: 40%;
    right: 15%;
    animation-delay: 2s;
  }

  .circle:nth-of-type(4) {
    width: 120px;
    height: 120px;
    bottom: 20%;
    right: 10%;
    animation-delay: 3s;
  }

  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 900px;
  margin: 0 auto;

  h1 {
    font-size: 48px;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 1s ease-out;
  }

  p {
    font-size: 18px;
    margin-bottom: 40px;
    animation: fadeIn 1.5s ease-out;
  }

  button {
    animation: fadeIn 2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SearchSection = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 40px;
  margin-top: -70px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

// Feature card enhancements
const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 160px;
    background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-12px) rotateX(5deg);
    box-shadow: 0 20px 40px rgba(45, 79, 163, 0.15);
    border-color: rgba(45, 79, 163, 0.2);

    &:before {
      opacity: 0.05;
    }

    .ant-card-cover {
      transform: translateZ(20px);

      .gradient-icon {
        transform: rotateY(180deg) scale(1.1);
      }
    }

    .ant-card-body {
      transform: translateZ(30px);
    }

    &:after {
      transform: scaleX(1);
    }
  }

  .ant-card-cover {
    padding: 30px;
    background: linear-gradient(135deg, #fafbff 0%, #f5f7fa 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 160px;
    transition: transform 0.5s ease;
    position: relative;
    z-index: 1;

    .gradient-icon {
      font-size: 56px;
      background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
    }
  }

  .ant-card-body {
    padding: 28px;
    position: relative;
    z-index: 1;
    transition: transform 0.5s ease;

    .ant-card-meta-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #1a1a1a;
      position: relative;

      &:after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, #0f2852 0%, #2d4fa3 100%);
        transition: width 0.3s ease;
      }
    }

    .ant-card-meta-description {
      color: #666;
      font-size: 15px;
      line-height: 1.6;
    }
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0f2852 0%, #2d4fa3 100%);
    transform: scaleX(0);
    transition: transform 0.5s ease;
    transform-origin: left;
  }

  &:hover .ant-card-meta-title:after {
    width: 60px;
  }
`;

const StyledFooter = styled(Footer)`
  background-color: #001529;
  color: rgba(255, 255, 255, 0.65);
  padding: 48px 24px 24px;
`;

const GradientIcon = styled.div`
  font-size: 48px;
  background: linear-gradient(135deg, #0b486b 0%, #3b8d99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const OrganizationItem = styled(List.Item)`
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  margin-bottom: 12px;

  &:hover {
    background-color: #f5f8ff;
    transform: translateX(5px);
    border-color: #d7e3fc;
  }
`;

const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #52c41a;
    box-shadow: 0 0 0 1px #fff;
  }
`;

const SearchContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f9fafc;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c5c5c5;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`;

const AnimatedBox = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  color: white;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 80%
    );
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

// Blockchain-themed styled components
const BlockchainParticle = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(65, 132, 255, 0.8);
  z-index: 1;
  animation-name: particleAnimation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  @keyframes particleAnimation {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      transform: translateY(-800px) translateX(400px);
      opacity: 0;
    }
  }
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CardanoGradient = styled.div`
  position: absolute;
  width: 60%;
  height: 60%;
  right: -20%;
  top: 20%;
  background: radial-gradient(
    circle,
    rgba(0, 51, 173, 0.4) 0%,
    rgba(14, 42, 71, 0) 70%
  );
  border-radius: 50%;
  animation: pulse-gradient 15s ease-in-out infinite alternate;

  @keyframes pulse-gradient {
    0% {
      opacity: 0.3;
      transform: scale(1);
    }
    100% {
      opacity: 0.7;
      transform: scale(1.2);
    }
  }
`;

const StatsSection = styled.div`
  background: linear-gradient(180deg, #f9fafc 0%, #ffffff 100%);
  padding: 80px 0;
  text-align: center;
  position: relative;

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 30px 20px;
    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .value {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .label {
      font-size: 16px;
      color: #666;
    }
  }
`;

const EnhancedAnimatedBox = styled(AnimatedBox)`
  margin: 0 50px 40px;
  border-radius: 24px;
  padding: 50px;
  background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);

  &:before {
    animation: rotate 30s linear infinite;
  }

  .blockchain-visual {
    position: relative;
    height: 200px;

    .block {
      position: absolute;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(0, 153, 255, 0.3);
      backdrop-filter: blur(5px);

      &.block-1 {
        top: 20px;
        left: 0;
        animation: float 4s ease-in-out infinite;
      }

      &.block-2 {
        top: 50px;
        left: 80px;
        animation: float 4s ease-in-out infinite 1s;
      }

      &.block-3 {
        top: 80px;
        left: 160px;
        animation: float 4s ease-in-out infinite 2s;
      }

      .icon {
        font-size: 24px;
        color: white;
      }
    }

    .connection {
      position: absolute;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      z-index: 0;

      &.connection-1 {
        width: 70px;
        top: 50px;
        left: 50px;
        transform: rotate(15deg);
      }

      &.connection-2 {
        width: 70px;
        top: 70px;
        left: 130px;
        transform: rotate(15deg);
      }
    }
  }
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  margin-right: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #1890ff;
    transform: translateY(-3px);
    color: white;
  }
`;

// Process section enhancements
const ProcessSection = styled.div`
  padding: 100px 0;
  background: #fff;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: linear-gradient(180deg, #f7fafc 0%, #ffffff 100%);
    z-index: 0;
  }

  .process-container {
    position: relative;
    z-index: 1;

    &:after {
      content: "";
      position: absolute;
      top: 35%;
      left: 15%;
      right: 15%;
      height: 2px;
      background: linear-gradient(
        90deg,
        rgba(45, 79, 163, 0) 0%,
        rgba(45, 79, 163, 0.2) 10%,
        rgba(45, 79, 163, 0.2) 90%,
        rgba(45, 79, 163, 0) 100%
      );
      z-index: 0;
    }
  }
`;

const ProcessCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  height: 100%;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  z-index: 1;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(45, 79, 163, 0.2);

    .step-number {
      transform: scale(1.1);
      background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
      color: white;

      &:after {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
    }

    .step-icon {
      transform: rotate(360deg);
      color: #2d4fa3;
    }

    .step-arrow {
      transform: translateX(5px);
      opacity: 1;
    }

    &:before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(45, 79, 163, 0.03) 0%,
      transparent 70%
    );
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
    transition: all 0.4s ease;
    pointer-events: none;
  }

  .step-number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f0f5ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    color: #0f2852;
    margin-bottom: 24px;
    position: relative;
    transition: all 0.4s ease;

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid #0f2852;
      opacity: 0;
      transition: all 0.4s ease;
    }
  }

  .step-icon {
    font-size: 32px;
    margin-bottom: 20px;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    color: #0f2852;
  }

  .step-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1a1a1a;
  }

  .step-description {
    color: #666;
    font-size: 15px;
    line-height: 1.6;
  }

  .step-arrow {
    position: absolute;
    top: 35%;
    right: -32px;
    color: #2d4fa3;
    font-size: 24px;
    z-index: 2;
    transition: all 0.3s ease;
    opacity: 0.7;
  }
`;

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  // Use the hook to search for subdomains
  const { data: subdomainData, isLoading } = useSearchSubdomains({
    page,
    size: 5,
    search: searchValue.trim() !== "" ? searchValue : undefined,
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const navigateToOrganization = (subdomain: string) => {
    // Open in the same tab
    window.location.href = `https://${subdomain}`;
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StyledHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SafetyCertificateOutlined
              style={{ fontSize: 24, color: "white", marginRight: 12 }}
            />
            <Text strong style={{ color: "white", fontSize: 18 }}>
              Authenticate.io
            </Text>
          </div>
          <div>
            <Button type="link" ghost style={{ color: "white" }}>
              Về Chúng Tôi
            </Button>
            <Button type="link" ghost style={{ color: "white" }}>
              Công Nghệ
            </Button>
            <Button type="link" ghost style={{ color: "white" }}>
              Đối Tác
            </Button>
          </div>
        </div>
      </StyledHeader>

      <Content>
        <HeroSection>
          <FloatingGraphic>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </FloatingGraphic>

          <ParticleContainer>
            {[...Array(15)].map((_, i) => (
              <BlockchainParticle
                key={i}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </ParticleContainer>

          <CardanoGradient />

          <HeroContent>
            <Title
              level={1}
              style={{
                color: "white",
                fontSize: 54,
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              Hệ Thống Xác Thực Chứng Chỉ <br />
              Trên Nền Tảng Blockchain
            </Title>
            <Paragraph
              style={{
                color: "white",
                fontSize: 18,
                maxWidth: 800,
                margin: "0 auto 40px",
              }}
            >
              Nền tảng phân tán, bảo mật và minh bạch giúp các tổ chức quản lý
              và xác minh chứng chỉ một cách đáng tin cậy.
            </Paragraph>
            <>
              <Button
                ghost
                size="large"
                style={{
                  height: 50,
                  paddingInline: 30,
                  borderRadius: 8,
                  fontSize: 16,
                }}
              >
                <Link href="https://docs.cardano.org/">Tìm Hiểu Thêm</Link>
              </Button>
            </>
          </HeroContent>
        </HeroSection>

        <SearchSection>
          <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
            Tìm Kiếm Tổ Chức
          </Title>
          <Paragraph
            style={{
              textAlign: "center",
              marginBottom: 30,
              fontSize: 16,
              color: "#666",
            }}
          >
            Nhập tên tổ chức để truy cập vào hệ thống xác thực chứng chỉ của họ
          </Paragraph>

          <Input.Search
            placeholder="Tìm kiếm tên tổ chức..."
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Tìm Kiếm
              </Button>
            }
            size="large"
            onSearch={handleSearch}
            style={{ marginBottom: "30px" }}
          />

          <SearchContainer>
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Đang tìm kiếm...</p>
              </div>
            ) : subdomainData &&
              subdomainData.data &&
              subdomainData.data.length > 0 ? (
              <List
                dataSource={subdomainData.data}
                renderItem={(item) => (
                  <OrganizationItem>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={48}
                          style={{ backgroundColor: "#0F2852" }}
                        >
                          {item.organizationName.charAt(0)}
                        </Avatar>
                      }
                      title={item.organizationName}
                      description={item.subdomain}
                    />
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigateToOrganization(item.subdomain)}
                    >
                      Truy cập
                    </Button>
                  </OrganizationItem>
                )}
                pagination={{
                  onChange: (page) => setPage(page),
                  current: page,
                  pageSize: 5,
                  total: subdomainData.metadata?.totalItem,
                  showSizeChanger: false,
                }}
              />
            ) : searchValue ? (
              <Empty
                description="Không tìm thấy tổ chức nào phù hợp"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <SearchOutlined style={{ fontSize: 40, color: "#d9d9d9" }} />
                <p style={{ color: "#8c8c8c", marginTop: 16 }}>
                  Nhập tên tổ chức để tìm kiếm
                </p>
              </div>
            )}
          </SearchContainer>
        </SearchSection>

        <StatsSection>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
              Tin Tưởng Bởi Các Tổ Chức Hàng Đầu
            </Title>
            <Paragraph
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#666",
                marginBottom: 50,
              }}
            >
              Hệ thống chúng tôi đang phục vụ hàng trăm tổ chức với hàng triệu
              chứng chỉ được xác thực
            </Paragraph>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={6}>
                <div className="stat-card">
                  <div className="value">10+</div>
                  <div className="label">Tổ Chức</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="stat-card">
                  <div className="value">500K+</div>
                  <div className="label">Chứng Chỉ</div>
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="stat-card">
                  <div className="value">99.9%</div>
                  <div className="label">Uptime</div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="stat-card">
                  <div className="value">1M+</div>
                  <div className="label">Lượt Xác Thực</div>
                </div>
              </Col>
            </Row>
          </div>
        </StatsSection>

        <div style={{ padding: "100px 50px", background: "#f7fafc" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
              Tại Sao Chọn Authenticate.io
            </Title>
            <Paragraph
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#666",
                marginBottom: 60,
                maxWidth: 700,
                margin: "0 auto 60px",
              }}
            >
              Nền tảng Authenticate.io cung cấp giải pháp toàn diện cho việc
              quản lý và xác thực chứng chỉ
            </Paragraph>

            <Row gutter={[32, 32]}>
              <Col xs={24} sm={12} md={8}>
                <FeatureCard
                  cover={
                    <GradientIcon>
                      <BlockOutlined />
                    </GradientIcon>
                  }
                >
                  <Card.Meta
                    title="Công Nghệ Blockchain"
                    description="Sử dụng blockchain Cardano để đảm bảo tính bất biến và minh bạch cho mọi chứng chỉ được cấp trên hệ thống."
                  />
                </FeatureCard>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <FeatureCard
                  cover={
                    <GradientIcon>
                      <CheckCircleOutlined />
                    </GradientIcon>
                  }
                >
                  <Card.Meta
                    title="Xác Thực Tức Thời"
                    description="Xác minh tính chính xác của chứng chỉ ngay lập tức với quy trình xác thực đơn giản và hiệu quả."
                  />
                </FeatureCard>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <FeatureCard
                  cover={
                    <GradientIcon>
                      <SafetyCertificateOutlined />
                    </GradientIcon>
                  }
                >
                  <Card.Meta
                    title="Bảo Mật Cao Cấp"
                    description="Dữ liệu được mã hóa và lưu trữ an toàn, chỉ những người có quyền mới có thể truy cập và quản lý."
                  />
                </FeatureCard>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <FeatureCard
                  cover={
                    <GradientIcon>
                      <BuildOutlined />
                    </GradientIcon>
                  }
                >
                  <Card.Meta
                    title="Tùy Chỉnh Linh Hoạt"
                    description="Mỗi tổ chức có thể tùy chỉnh giao diện và quy trình cấp chứng chỉ theo nhu cầu riêng."
                  />
                </FeatureCard>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <FeatureCard
                  cover={
                    <GradientIcon>
                      <GlobalOutlined />
                    </GradientIcon>
                  }
                >
                  <Card.Meta
                    title="Truy Cập Toàn Cầu"
                    description="Chứng chỉ có thể được xác minh từ bất kỳ đâu trên thế giới, bất kỳ lúc nào."
                  />
                </FeatureCard>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <FeatureCard
                  cover={
                    <GradientIcon>
                      <StyledBadge count={5}>
                        <CheckCircleOutlined style={{ fontSize: 36 }} />
                      </StyledBadge>
                    </GradientIcon>
                  }
                >
                  <Card.Meta
                    title="Đối Tác Tin Cậy"
                    description="Hợp tác với nhiều tổ chức giáo dục và doanh nghiệp uy tín trên toàn quốc."
                  />
                </FeatureCard>
              </Col>
            </Row>
          </div>
        </div>

        <ProcessSection>
          <div
            className="process-container"
            style={{ maxWidth: 1200, margin: "0 auto", padding: "0 50px" }}
          >
            <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
              Quy Trình Hoạt Động
            </Title>
            <Paragraph
              style={{
                textAlign: "center",
                fontSize: 16,
                color: "#666",
                marginBottom: 60,
                maxWidth: 700,
                margin: "0 auto 60px",
              }}
            >
              Hiểu rõ cách chúng tôi sử dụng công nghệ blockchain để đảm bảo
              tính toàn vẹn của chứng chỉ
            </Paragraph>

            <Row gutter={[64, 32]} justify="center">
              <Col xs={24} sm={12} md={6}>
                <ProcessCard>
                  <div className="step-number">1</div>
                  <div className="step-icon">
                    <FileProtectOutlined />
                  </div>
                  <div className="step-title">Tạo Chứng Chỉ</div>
                  <div className="step-description">
                    Tổ chức tạo chứng chỉ với thông tin chi tiết và yêu cầu cụ
                    thể.
                  </div>
                  <div className="step-arrow">
                    <ArrowRightOutlined />
                  </div>
                </ProcessCard>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <ProcessCard>
                  <div className="step-number">2</div>
                  <div className="step-icon">
                    <LockOutlined />
                  </div>
                  <div className="step-title">Mã Hóa Dữ Liệu</div>
                  <div className="step-description">
                    Thông tin chứng chỉ được mã hóa và chuyển đổi thành mã hash
                    an toàn.
                  </div>
                  <div className="step-arrow">
                    <ArrowRightOutlined />
                  </div>
                </ProcessCard>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <ProcessCard>
                  <div className="step-number">3</div>
                  <div className="step-icon">
                    <BlockOutlined />
                  </div>
                  <div className="step-title">Lưu Trữ Blockchain</div>
                  <div className="step-description">
                    Mã hash được lưu trữ trên blockchain Cardano, đảm bảo tính
                    bất biến.
                  </div>
                  <div className="step-arrow">
                    <ArrowRightOutlined />
                  </div>
                </ProcessCard>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <ProcessCard>
                  <div className="step-number">4</div>
                  <div className="step-icon">
                    <VerifiedOutlined />
                  </div>
                  <div className="step-title">Xác Thực Nhanh Chóng</div>
                  <div className="step-description">
                    Chứng chỉ có thể được xác thực ngay lập tức bằng mã QR hoặc
                    ID.
                  </div>
                </ProcessCard>
              </Col>
            </Row>
          </div>
        </ProcessSection>

        <EnhancedAnimatedBox>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Row align="middle" gutter={[32, 32]}>
              <Col xs={24} md={16}>
                <Title level={2} style={{ color: "white", marginBottom: 16 }}>
                  Công Nghệ Blockchain Cardano
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 16,
                    lineHeight: 1.8,
                  }}
                >
                  Chúng tôi sử dụng nền tảng blockchain Cardano, được biết đến
                  với tính bảo mật cao và hiệu suất vượt trội. Cardano sử dụng
                  thuật toán đồng thuận Proof-of-Stake (PoS) thân thiện với môi
                  trường và tối ưu hóa cho ứng dụng doanh nghiệp. Mỗi chứng chỉ
                  được lưu trữ vĩnh viễn trên blockchain, không thể bị xóa hoặc
                  chỉnh sửa.
                </Paragraph>
                <div className="blockchain-visual">
                  <div className="connection connection-1"></div>
                  <div className="connection connection-2"></div>
                  <div className="block block-1">
                    <div className="icon">01</div>
                  </div>
                  <div className="block block-2">
                    <div className="icon">02</div>
                  </div>
                  <div className="block block-3">
                    <div className="icon">03</div>
                  </div>
                </div>
                <Button
                  type="primary"
                  ghost
                  size="large"
                  style={{ marginTop: 30 }}
                >
                  Tìm hiểu thêm
                </Button>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <BlockOutlined
                  style={{ fontSize: 160, color: "rgba(255,255,255,0.15)" }}
                />
              </Col>
            </Row>
          </div>
        </EnhancedAnimatedBox>
      </Content>

      <StyledFooter>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: "white" }}>
                Authenticate.io
              </Title>
              <Paragraph style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                Hệ thống xác thực chứng chỉ trên nền tảng blockchain, đảm bảo
                tính minh bạch và bảo mật cho các tổ chức và cá nhân.
              </Paragraph>
              <div style={{ marginTop: 20 }}>
                <SocialLink
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubOutlined />
                </SocialLink>
                <SocialLink
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterOutlined />
                </SocialLink>
                <SocialLink
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinOutlined />
                </SocialLink>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Title level={4} style={{ color: "white" }}>
                Liên Kết
              </Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <Link href="#" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Về Chúng Tôi
                </Link>
                <Link href="#" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Công Nghệ
                </Link>
                <Link href="#" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Đối Tác
                </Link>
                <Link href="#" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Hỗ Trợ
                </Link>
                <Link
                  href="/admin-login"
                  style={{ color: "rgba(255, 255, 255, 0.65)" }}
                >
                  Đăng Nhập
                </Link>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <Title level={4} style={{ color: "white" }}>
                Liên Hệ
              </Title>
              <div
                style={{ color: "rgba(255, 255, 255, 0.65)", marginBottom: 16 }}
              >
                <MailOutlined style={{ marginRight: 10 }} />{" "}
                phucpv.k62cntta@utb.edu.vn
              </div>
              <div
                style={{ color: "rgba(255, 255, 255, 0.65)", marginBottom: 16 }}
              >
                <PhoneOutlined style={{ marginRight: 10 }} /> +84 123 456 789
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                <EnvironmentOutlined style={{ marginRight: 10 }} /> Tòa nhà ABC,
                Đường XYZ, Hà Nội, Việt Nam
              </div>
            </Col>
          </Row>

          <Divider
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              margin: "32px 0",
            }}
          />

          <div
            style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)" }}
          >
            © {new Date().getFullYear()} Authenticate.io. All rights reserved.
          </div>
        </div>
      </StyledFooter>
    </Layout>
  );
}

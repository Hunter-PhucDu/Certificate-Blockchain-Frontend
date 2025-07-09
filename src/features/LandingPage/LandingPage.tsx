"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Layout,
  Typography,
  Card,
  Spin,
  Row,
  Col,
  Divider,
  List,
  Empty,
  Badge,
  Avatar,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  SafetyCertificateOutlined,
  BlockOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined,
  CheckCircleOutlined,
  BuildOutlined,
  GlobalOutlined,
  FileProtectOutlined,
  LockOutlined,
  VerifiedOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useSearchSubdomains } from "@/services/TenantService";
import styled from "@emotion/styled";
import Link from "next/link";
import {
  BlockchainAnimation,
  ConnectionLines,
  EnhancedAnimatedBox,
  GradientIcon,
  NetworkNodes,
  ProcessCard,
  ProcessSection,
  SocialLink,
  StyledFooter,
} from "./BlockchainUI";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const StyledHeader = styled(Header)`
  background: rgba(3, 4, 58, 0.95);
  backdrop-filter: blur(8px);
  position: fixed;
  width: 100%;
  height: 80px;
  z-index: 100;
  padding: 0 50px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
`;

const HeroSection = styled.div`
  min-height: 65vh; /* Reduced from 75vh to 65vh */
  background: linear-gradient(135deg, #0a1f3f 0%, #152a4d 50%, #1e3871 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 30px 0; /* Reduced from 40px to 30px */

  @media (max-height: 700px) {
    min-height: 55vh; /* Added responsive height */
  }

  @media (max-height: 600px) {
    min-height: 50vh; /* Added responsive height */
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 15% 50%,
        rgba(25, 65, 135, 0.2) 0%,
        transparent 25%
      ),
      radial-gradient(
        circle at 85% 30%,
        rgba(30, 100, 200, 0.15) 0%,
        transparent 30%
      ),
      radial-gradient(
        circle at 50% 80%,
        rgba(40, 80, 160, 0.15) 0%,
        transparent 20%
      ),
      url("/images/blockchain-pattern.svg");
    background-size: cover;
    background-position: center;
    background-blend-mode: soft-light;
    z-index: 1;
    opacity: 0.9;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(to right, rgba(15, 40, 82, 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(15, 40, 82, 0.04) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 5;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  margin: 0 auto;
  padding: 0 15px;
  text-align: center;

  h1 {
    color: white;
    font-size: 36px; /* Reduced from 38px to 36px */
    font-weight: 700;
    margin-bottom: 14px; /* Reduced from 16px to 14px */
    text-align: center;
    text-shadow: 0 0 10px rgba(65, 132, 255, 0.5);
    animation: fadeIn 1s ease-out;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 500;
    max-width: 600px;
    text-align: center;
    margin-bottom: 20px; /* Reduced from 24px to 20px */
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    line-height: 1.5;
    animation: fadeIn 1.5s ease-out;
  }

  @media (max-width: 576px) {
    h1 {
      font-size: 30px; /* Reduced for small screens */
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }

  @media (max-height: 700px) {
    h1 {
      font-size: 32px;
      margin-bottom: 12px;
    }

    p {
      font-size: 15px;
      margin-bottom: 16px;
      line-height: 1.4;
    }
  }

  @media (max-height: 600px) {
    h1 {
      font-size: 28px;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      margin-bottom: 14px;
      line-height: 1.3;
    }
  }
`;

const SearchSection = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 35px 25px;
  margin-top: -50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;

  @media (max-width: 576px) {
    padding: 25px 15px;
    margin-top: -40px;
    border-radius: 12px;
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

export const OrganizationItem = styled(List.Item)`
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

export const StyledBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #52c41a;
    box-shadow: 0 0 0 1px #fff;
  }
`;

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

const ChatButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #0f2852 0%, #2d4fa3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:hover::after {
    opacity: 1;
    visibility: visible;
    right: 80px;
  }
`;

export default function LandingPage() {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

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
    window.location.href = `https://${subdomain}`;
  };

  const navigateToFacebook = () => {
    window.open(
      "https://www.facebook.com/profile.php?id=688732870981481",
      "_blank",
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <StyledHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 15px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              flex: 1,
            }}
          >
            <SafetyCertificateOutlined
              style={{
                fontSize: 24,
                color: "white",
                marginRight: 12,
                flexShrink: 0,
              }}
            />
            <Text
              strong
              style={{
                color: "white",
                fontSize: 18,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Authenticate.io.vn
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
            className="desktop-nav"
          >
            <Button
              type="link"
              style={{ color: "white", padding: "0 8px", fontSize: "14px" }}
            >
              Về Chúng Tôi
            </Button>
            <Button
              type="link"
              style={{ color: "white", padding: "0 8px", fontSize: "14px" }}
            >
              Công Nghệ
            </Button>
            <Button
              type="link"
              style={{ color: "white", padding: "0 8px", fontSize: "14px" }}
            >
              Đối Tác
            </Button>
          </div>
        </div>
      </StyledHeader>

      <Content style={{ paddingTop: "80px" }}>
        <style jsx global>{`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }

            .ant-layout-header {
              height: 70px !important;
              padding: 0 15px !important;
            }

            .ant-layout-content {
              padding-top: 70px !important;
            }

            .ant-typography h1 {
              font-size: 28px !important;
              line-height: 1.2 !important;
            }

            .ant-typography h2 {
              font-size: 24px !important;
            }

            .ant-typography h3 {
              font-size: 20px !important;
            }

            .search-section {
              margin: 0 10px !important;
              padding: 20px 15px !important;
            }

            .features-section {
              padding: 40px 15px !important;
            }

            .process-section {
              padding: 40px 15px !important;
            }
          }

          @media (max-width: 576px) {
            .ant-layout-header {
              height: 65px !important;
              padding: 0 10px !important;
            }

            .ant-layout-content {
              padding-top: 65px !important;
            }

            .ant-typography h1 {
              font-size: 24px !important;
            }

            .ant-typography h2 {
              font-size: 22px !important;
            }

            .ant-typography h3 {
              font-size: 18px !important;
            }

            .ant-btn {
              font-size: 14px !important;
            }

            .ant-col {
              padding: 0 8px !important;
            }

            .ant-row {
              margin: 0 -8px !important;
            }

            .search-section {
              margin: 0 5px !important;
              padding: 15px 10px !important;
            }
          }
        `}</style>
        <HeroSection
          style={{
            background:
              "linear-gradient(135deg, #0a1f3f 0%, #152a4d 50%, #1e3871 100%)",
          }}
        >
          <BlockchainAnimation>
            <NetworkNodes />
            <div className="block">0x8F3E...</div>
            <div className="block">0xA72B...</div>
            <div className="block">0x6D9C...</div>
            <div className="block">0x3F1A...</div>
            <div className="block">0xB45D...</div>
            <div className="block">0x2E7F...</div>

            {/* Chain connections */}
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>

            {/* Static network nodes */}
            <div
              className="network-node"
              style={{ top: "15%", left: "25%", opacity: "0.3" }}
            ></div>
            <div
              className="network-node"
              style={{ top: "30%", left: "45%", opacity: "0.25" }}
            ></div>
            <div
              className="network-node"
              style={{ top: "60%", left: "35%", opacity: "0.3" }}
            ></div>
            <div
              className="network-node"
              style={{ top: "25%", left: "75%", opacity: "0.2" }}
            ></div>
            <div
              className="network-node"
              style={{ top: "50%", left: "85%", opacity: "0.25" }}
            ></div>
            <div
              className="network-node"
              style={{ top: "70%", left: "65%", opacity: "0.3" }}
            ></div>

            {/* Network lines */}
            <div
              className="network-line"
              style={{
                top: "15%",
                left: "25%",
                width: "22%",
                transform: "rotate(20deg)",
                opacity: "0.1",
              }}
            ></div>
            <div
              className="network-line"
              style={{
                top: "30%",
                left: "45%",
                width: "18%",
                transform: "rotate(-15deg)",
                opacity: "0.12",
              }}
            ></div>
            <div
              className="network-line"
              style={{
                top: "60%",
                left: "35%",
                width: "33%",
                transform: "rotate(15deg)",
                opacity: "0.08",
              }}
            ></div>
            <div
              className="network-line"
              style={{
                top: "25%",
                left: "75%",
                width: "12%",
                transform: "rotate(35deg)",
                opacity: "0.15",
              }}
            ></div>
            <div
              className="network-line"
              style={{
                top: "50%",
                left: "65%",
                width: "20%",
                transform: "rotate(-10deg)",
                opacity: "0.1",
              }}
            ></div>

            {/* Particles */}
            <div
              className="particle"
              style={{
                top: "20%",
                left: "30%",
                animationDuration: "18s",
                opacity: "0.4",
              }}
            ></div>
            <div
              className="particle"
              style={{
                top: "40%",
                left: "60%",
                animationDuration: "15s",
                animationDelay: "2s",
                opacity: "0.35",
              }}
            ></div>
            <div
              className="particle"
              style={{
                top: "65%",
                left: "25%",
                animationDuration: "20s",
                animationDelay: "1s",
                opacity: "0.4",
              }}
            ></div>
            <div
              className="particle"
              style={{
                top: "15%",
                left: "70%",
                animationDuration: "22s",
                animationDelay: "3s",
                opacity: "0.3",
              }}
            ></div>
            <div
              className="particle particle-data"
              style={{
                top: "55%",
                left: "75%",
                animationDuration: "16s",
                animationDelay: "4s",
                opacity: "0.5",
              }}
            ></div>
            <div
              className="particle particle-data"
              style={{
                top: "35%",
                left: "40%",
                animationDuration: "18s",
                animationDelay: "2.5s",
                opacity: "0.45",
              }}
            ></div>

            {/* Digital rain effect */}
            <div className="digital-rain">
              <div
                className="rain-column"
                style={{
                  left: "10%",
                  animationDuration: "18s",
                  height: "12%",
                  opacity: "0.2",
                }}
              ></div>
              <div
                className="rain-column"
                style={{
                  left: "25%",
                  animationDuration: "15s",
                  height: "10%",
                  animationDelay: "3s",
                  opacity: "0.15",
                }}
              ></div>
              <div
                className="rain-column"
                style={{
                  left: "45%",
                  animationDuration: "20s",
                  height: "8%",
                  animationDelay: "1.5s",
                  opacity: "0.2",
                }}
              ></div>
              <div
                className="rain-column"
                style={{
                  left: "65%",
                  animationDuration: "17s",
                  height: "11%",
                  animationDelay: "4s",
                  opacity: "0.18",
                }}
              ></div>
              <div
                className="rain-column"
                style={{
                  left: "85%",
                  animationDuration: "19s",
                  height: "13%",
                  animationDelay: "2.5s",
                  opacity: "0.15",
                }}
              ></div>
            </div>
          </BlockchainAnimation>
          <ConnectionLines>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </ConnectionLines>

          <HeroContent>
            <Title
              level={1}
              style={{
                color: "white",
                fontSize: 42,
                marginBottom: 20,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Hệ Thống Xác Thực Chứng Chỉ <br />
              Trên Nền Tảng Blockchain
            </Title>
            <Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: 16,
                maxWidth: 650,
                margin: "0 auto 32px",
                textShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                lineHeight: 1.6,
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
                <Link href="https://cardano.org/">Tìm Hiểu Thêm</Link>
              </Button>
            </>
          </HeroContent>
        </HeroSection>

        <SearchSection className="search-section">
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

        <div
          className="features-section"
          style={{ padding: "100px 50px", background: "#f7fafc" }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 16 }}>
              Tại Sao Chọn authenticate.io.vn
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
              Nền tảng authenticate.io.vn cung cấp giải pháp toàn diện cho việc
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
            className="process-container process-section"
            style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}
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
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
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
                  <Link href="https://cardano.org/">Tìm Hiểu Thêm</Link>
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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: "white" }}>
                Authenticate.io.vn
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
            © {new Date().getFullYear()} Authenticate.io.vn. All rights
            reserved.
          </div>
        </div>
      </StyledFooter>

      <Tooltip title="Liên hệ với chúng tôi" placement="left">
        <ChatButton onClick={navigateToFacebook}>
          <MessageOutlined style={{ fontSize: 24 }} />
        </ChatButton>
      </Tooltip>
    </Layout>
  );
}

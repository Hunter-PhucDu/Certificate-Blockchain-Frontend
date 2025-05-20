"use client";

import React, { useState, useEffect } from "react";
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
  Collapse,
  Result,
  Alert,
  Table,
} from "antd";
import {
  SearchOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  BlockOutlined,
  ScanOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { useSearchCertificateByValue } from "@/services/VerifyService";
import styled from "@emotion/styled";
import Link from "next/link";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 120px 0 80px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("/grid.svg") center center;
    opacity: 0.1;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 70%
    );
    animation: pulse 8s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
      transform: scale(1);
    }
    100% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
`;

const BlockchainAnimation = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  overflow: hidden;

  .block {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: monospace;
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
    animation: floatBlock 12s infinite linear;
    opacity: 0.7;
  }

  .block:nth-child(1) {
    top: 15%;
    left: 10%;
    animation-delay: 0s;
  }

  .block:nth-child(2) {
    top: 35%;
    left: 20%;
    animation-delay: 2s;
  }

  .block:nth-child(3) {
    top: 65%;
    left: 15%;
    animation-delay: 4s;
  }

  .block:nth-child(4) {
    top: 25%;
    right: 15%;
    animation-delay: 1s;
  }

  .block:nth-child(5) {
    top: 50%;
    right: 10%;
    animation-delay: 3s;
  }

  .block:nth-child(6) {
    bottom: 20%;
    right: 20%;
    animation-delay: 5s;
  }

  .chain {
    position: absolute;
    height: 2px;
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.3),
      rgba(59, 130, 246, 0.8),
      rgba(59, 130, 246, 0.3)
    );
    animation: pulseChain 4s infinite;
  }

  .chain:nth-child(7) {
    width: 120px;
    top: 18%;
    left: 15%;
    transform: rotate(30deg);
  }

  .chain:nth-child(8) {
    width: 150px;
    top: 40%;
    left: 25%;
    transform: rotate(-20deg);
  }

  .chain:nth-child(9) {
    width: 100px;
    bottom: 30%;
    left: 20%;
    transform: rotate(15deg);
  }

  .chain:nth-child(10) {
    width: 130px;
    top: 30%;
    right: 20%;
    transform: rotate(-25deg);
  }

  .chain:nth-child(11) {
    width: 120px;
    top: 55%;
    right: 15%;
    transform: rotate(20deg);
  }

  .chain:nth-child(12) {
    width: 140px;
    bottom: 25%;
    right: 25%;
    transform: rotate(-15deg);
  }

  @keyframes floatBlock {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-15px) rotate(5deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }

  @keyframes pulseChain {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

const TechGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
  z-index: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
  animation: gridAnimation 20s linear infinite;

  @keyframes gridAnimation {
    0% {
      transform: rotateX(10deg) translateZ(0);
    }
    100% {
      transform: rotateX(10deg) translateZ(100px);
    }
  }
`;

const ConnectionLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;

  .line {
    position: absolute;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(59, 130, 246, 0.5),
      transparent
    );
    animation: moveLine 8s linear infinite;
    opacity: 0;
  }

  .line:nth-child(1) {
    width: 30%;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .line:nth-child(2) {
    width: 20%;
    top: 40%;
    right: 20%;
    animation-delay: 2s;
  }

  .line:nth-child(3) {
    width: 25%;
    bottom: 30%;
    left: 30%;
    animation-delay: 4s;
  }

  .line:nth-child(4) {
    width: 15%;
    bottom: 20%;
    right: 10%;
    animation-delay: 6s;
  }

  @keyframes moveLine {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

const OrgLogo = styled.div`
  height: 100px;
  width: 100px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 48px;
  margin-top: -60px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 10;
  position: relative;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);

  &:hover {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
`;

const CertificateCard = styled(Card)`
  margin-top: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  .ant-card-body {
    padding: 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(59, 130, 246, 0.03),
      transparent
    );
    transform: translateX(-100%);
    animation: cardShine 3s infinite;
  }

  @keyframes cardShine {
    0% {
      transform: translateX(-100%) rotate(25deg);
    }
    100% {
      transform: translateX(100%) rotate(25deg);
    }
  }
`;

const CertificateHeader = styled.div`
  padding: 32px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 100%
    );
    animation: shine 3s infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(rgba(59, 130, 246, 0.2) 2px, transparent 2px),
      radial-gradient(rgba(59, 130, 246, 0.15) 2px, transparent 2px);
    background-size: 30px 30px;
    background-position:
      0 0,
      15px 15px;
    opacity: 0.3;
  }
`;

const CertificateDetail = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const StyledFooter = styled(Footer)`
  background-color: #0f172a;
  color: white;
  padding: 48px 24px;
  text-align: center;
`;

const BlockchainBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(37, 99, 235, 0.1);
  color: #3b82f6;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);

  .anticon {
    margin-right: 8px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:hover,
  &:focus-within {
    box-shadow: 0 8px 30px rgba(37, 99, 235, 0.2);
    border-color: rgba(59, 130, 246, 0.5);
    transform: translateY(-2px);
  }
`;

const SearchInput = styled(Input)`
  flex: 1;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  height: 56px;
  font-size: 16px;
  padding: 0 24px;

  .ant-input {
    background: transparent !important;
    color: #333;
    height: 56px;
    border-radius: 0;
    padding: 0 24px;
    font-size: 16px;
    border: none !important;
    box-shadow: none !important;

    &:hover,
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
  }

  .ant-input-prefix {
    margin-right: 12px;
    color: #3b82f6;
  }
`;

const SearchButton = styled(Button)`
  height: 56px;
  border-radius: 0 28px 28px 0;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  padding: 0 32px;
  box-shadow: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  &:hover::after {
    animation: shine 1.5s ease;
  }

  @keyframes shine {
    0% {
      left: -50%;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      left: 150%;
      opacity: 0;
    }
  }
`;

const FeatureSection = styled.div`
  padding: 100px 50px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: linear-gradient(180deg, #f7fafc 0%, #ffffff 100%);
    z-index: 0;
  }
`;

const FeatureCard = styled(Card)`
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  height: 100%;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);

    .icon-wrapper {
      transform: translateY(-5px);
    }

    &::before {
      opacity: 1;
      transform: scale(1);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.05) 0%,
      transparent 100%
    );
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s ease;
  }

  .ant-card-head {
    border-bottom: none;
    padding: 24px;
  }

  .ant-card-body {
    padding: 0 24px 24px;
  }

  .icon-wrapper {
    transition: transform 0.3s ease;
  }
`;

export default function LandingPageOrg() {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  // Extract organization name from subdomain
  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];
    if (subdomain && subdomain !== "localhost" && subdomain !== "www") {
      setOrganizationName(subdomain.toUpperCase());
    } else {
      setOrganizationName("UTB");
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getBackgroundColor = () => {
    const heroHeight = 600;
    const searchHeight = 400;

    if (scrollPosition < heroHeight) {
      return "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
    } else if (scrollPosition < heroHeight + searchHeight) {
      return "linear-gradient(135deg, #1e293b 0%, #334155 100%)";
    } else {
      return "linear-gradient(135deg, #334155 0%, #475569 100%)";
    }
  };

  const {
    data: certificateData,
    isLoading,
    isError,
  } = useSearchCertificateByValue(searchQuery);

  const handleSearch = () => {
    if (searchValue.trim()) {
      setSearchQuery(searchValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const detailsCollapseItems =
    certificateData?.data && certificateData.data.length > 0
      ? [
          {
            key: "1",
            label: "Thông Tin Chi Tiết Chứng Chỉ",
            children: (
              <div
                className="detail-list"
                style={{
                  padding: "16px 24px",
                  background: "#fafafa",
                  borderRadius: 8,
                }}
              >
                {certificateData.data[0].certificateData.map((sec) =>
                  sec.values.map((item) => (
                    <Row
                      key={item.label}
                      gutter={[8, 8]}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #e8e8e8",
                        borderRadius: 4,
                      }}
                    >
                      <Col flex="none">
                        <Text
                          type="secondary"
                          style={{ minWidth: 140, fontWeight: 500 }}
                        >
                          {item.label}:
                        </Text>
                      </Col>
                      <Col flex="auto">
                        <Text>{item.value}</Text>
                      </Col>
                    </Row>
                  )),
                )}
              </div>
            ),
            extra: (
              <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 20 }} />
            ),
          },
          {
            key: "2",
            label: "Thông Tin Blockchain",
            children: (
              <Table
                dataSource={[
                  {
                    key: "1",
                    property: "Transaction Hash",
                    value: certificateData.data[0].txHash,
                  },
                  {
                    key: "2",
                    property: "Block ID",
                    value: certificateData.data[0].blockId,
                  },
                  {
                    key: "3",
                    property: "Thời gian xác thực",
                    value: certificateData.data[0].createdAt
                      ? new Date(
                          certificateData.data[0].createdAt,
                        ).toLocaleString("vi-VN")
                      : "",
                  },
                ]}
                columns={[
                  {
                    title: "Thuộc tính",
                    dataIndex: "property",
                    key: "property",
                  },
                  {
                    title: "Giá trị",
                    dataIndex: "value",
                    key: "value",
                  },
                ]}
                pagination={false}
                size="small"
              />
            ),
          },
        ]
      : [];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#1a365d",
          padding: "0 50px",
          height: "80px",
          position: "fixed",
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <SafetyCertificateOutlined
              style={{ fontSize: 28, color: "#60a5fa", marginRight: 12 }}
            />
            <Text strong style={{ color: "white", fontSize: 20 }}>
              {organizationName} | Authenticate.io
            </Text>
          </div>
          <div>
            <Link href="/login">
              <Button
                type="primary"
                size="large"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                  border: "none",
                  height: "44px",
                  padding: "0 24px",
                  borderRadius: "22px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                }}
              >
                Đăng Nhập
              </Button>
            </Link>
          </div>
        </div>
      </Header>

      <Content style={{ paddingTop: "80px" }}>
        <HeroSection style={{ background: getBackgroundColor() }}>
          <TechGrid />
          <BlockchainAnimation>
            <div className="block">0x8F3E...</div>
            <div className="block">0xA72B...</div>
            <div className="block">0x6D9C...</div>
            <div className="block">0x3F1A...</div>
            <div className="block">0xB45D...</div>
            <div className="block">0x2E7F...</div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
            <div className="chain"></div>
          </BlockchainAnimation>
          <ConnectionLines>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </ConnectionLines>

          <OrgLogo>
            <Text style={{ fontSize: 40, fontWeight: "bold", color: "white" }}>
              {organizationName?.charAt(0)}
            </Text>
          </OrgLogo>

          <Title
            style={{
              color: "white",
              fontSize: 48,
              marginBottom: 24,
              position: "relative",
              zIndex: 2,
            }}
          >
            {organizationName}
          </Title>

          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 18,
              maxWidth: 800,
              margin: "0 auto",
              lineHeight: 1.6,
              position: "relative",
              zIndex: 2,
            }}
          >
            Hệ thống xác thực chứng chỉ trên nền tảng blockchain
          </Paragraph>
        </HeroSection>

        <SearchSection>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            <ScanOutlined style={{ marginRight: 12, color: "#3b82f6" }} />
            Xác Thực Chứng Chỉ
          </Title>

          <Paragraph
            style={{ textAlign: "center", marginBottom: 32, fontSize: 16 }}
          >
            Nhập mã số chứng chỉ, CCCD/CMND hoặc mã định danh để tra cứu
          </Paragraph>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <SearchContainer>
              <SearchInput
                placeholder="Nhập mã số chứng chỉ, CCCD/CMND hoặc mã định danh..."
                size="large"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                prefix={<SearchOutlined />}
                variant="borderless"
              />
              <SearchButton
                type="primary"
                size="large"
                onClick={handleSearch}
                loading={isLoading}
              >
                Tra Cứu
              </SearchButton>
            </SearchContainer>
          </div>

          {isLoading && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
              <p style={{ marginTop: 16 }}>Đang tìm kiếm chứng chỉ...</p>
            </div>
          )}

          {isError && !isLoading && (
            <Alert
              message="Không thể tìm kiếm"
              description="Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại sau."
              type="error"
              showIcon
            />
          )}

          {!isLoading &&
            !isError &&
            certificateData?.data &&
            certificateData.data.length === 0 &&
            searchQuery && (
              <Result
                status="warning"
                title="Không tìm thấy chứng chỉ"
                subTitle="Không tìm thấy chứng chỉ nào ứng với thông tin bạn cung cấp. Vui lòng kiểm tra lại thông tin và thử lại."
                icon={<FileDoneOutlined />}
              />
            )}

          {!isLoading &&
            !isError &&
            certificateData?.data &&
            certificateData.data.length > 0 && (
              <CertificateCard>
                <CertificateHeader>
                  <FileDoneOutlined style={{ fontSize: 36 }} />
                  <Title
                    level={4}
                    style={{ color: "white", margin: "16px 0 0" }}
                  >
                    Chứng Chỉ Đã Xác Thực
                  </Title>
                  <BlockchainBadge>
                    <BlockOutlined /> Đã xác thực trên Blockchain
                  </BlockchainBadge>
                </CertificateHeader>

                {certificateData.data.map((certificate, index) => (
                  <div key={index}>
                    <CertificateDetail>
                      <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Loại Chứng Chỉ</Text>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {certificate.certificateType}
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Ngày Cấp</Text>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {new Date(certificate.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Mã Chứng Chỉ</Text>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {certificate.id}
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Mã Giao Dịch Blockchain</Text>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 500,
                              wordBreak: "break-all",
                            }}
                          >
                            {certificate.txHash}
                          </div>
                        </Col>
                      </Row>
                    </CertificateDetail>

                    <div style={{ padding: 20 }}>
                      <Collapse
                        defaultActiveKey={["1"]}
                        items={detailsCollapseItems}
                      />
                    </div>
                  </div>
                ))}
              </CertificateCard>
            )}

          {!searchQuery && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <QrcodeOutlined
                style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
              />
              <Paragraph style={{ color: "#8c8c8c" }}>
                Nhập thông tin để tìm kiếm và xác thực chứng chỉ
              </Paragraph>
            </div>
          )}
        </SearchSection>

        <FeatureSection style={{ background: getBackgroundColor() }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <FeatureCard
                title={
                  <div style={{ textAlign: "center" }}>
                    <div className="icon-wrapper">
                      <SafetyCertificateOutlined
                        style={{
                          fontSize: 32,
                          marginBottom: 16,
                          color: "#3b82f6",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 500 }}>
                      Uy Tín và Bảo Mật
                    </div>
                  </div>
                }
              >
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "#64748b",
                  }}
                >
                  Chứng chỉ được xác thực trên blockchain, đảm bảo tính chính
                  xác và không thể làm giả.
                </Paragraph>
              </FeatureCard>
            </Col>

            <Col xs={24} md={8}>
              <FeatureCard
                title={
                  <div style={{ textAlign: "center" }}>
                    <div className="icon-wrapper">
                      <BlockOutlined
                        style={{
                          fontSize: 32,
                          marginBottom: 16,
                          color: "#3b82f6",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 500 }}>
                      Công Nghệ Blockchain
                    </div>
                  </div>
                }
              >
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "#64748b",
                  }}
                >
                  Sử dụng công nghệ phân tán giúp minh bạch hóa quy trình cấp và
                  xác thực chứng chỉ.
                </Paragraph>
              </FeatureCard>
            </Col>

            <Col xs={24} md={8}>
              <FeatureCard
                title={
                  <div style={{ textAlign: "center" }}>
                    <div className="icon-wrapper">
                      <ScanOutlined
                        style={{
                          fontSize: 32,
                          marginBottom: 16,
                          color: "#3b82f6",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 500 }}>
                      Xác Thực Ngay Lập Tức
                    </div>
                  </div>
                }
              >
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "#64748b",
                  }}
                >
                  Tra cứu và xác thực chứng chỉ ngay lập tức, mọi lúc mọi nơi
                  với kết quả chính xác.
                </Paragraph>
              </FeatureCard>
            </Col>
          </Row>
        </FeatureSection>
      </Content>

      <StyledFooter>
        <Row justify="center" align="middle">
          <Col>
            <SafetyCertificateOutlined
              style={{ fontSize: 28, marginRight: 12, color: "#3b82f6" }}
            />
            <Text strong style={{ color: "white", fontSize: 18 }}>
              {organizationName} | Authenticate.io
            </Text>
            <Divider
              type="vertical"
              style={{ background: "rgba(255,255,255,0.2)", margin: "0 24px" }}
            />
            <Text style={{ color: "rgba(255,255,255,0.7)" }}>
              © {new Date().getFullYear()} All rights reserved
            </Text>
          </Col>
        </Row>
      </StyledFooter>
    </Layout>
  );
}

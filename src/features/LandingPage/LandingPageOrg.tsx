"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Typography,
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
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useSearchCertificateByValue } from "@/services/VerifyService";
import Link from "next/link";
import {
  BlockchainAnimation,
  BlockchainBadge,
  BrandTagline,
  CertificateCard,
  CertificateDetail,
  CertificateHeader,
  ConnectionLines,
  FeatureCard,
  FeatureSection,
  HeroContent,
  HeroSection,
  NetworkNodes,
  OrgLogo,
  SearchButton,
  SearchContainer,
  SearchInput,
  SearchSection,
  SocialLink,
  StyledFooter,
} from "./BlockchainUI";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function LandingPageOrg() {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split(".")[0];
    if (subdomain && subdomain !== "localhost" && subdomain !== "www") {
      setOrganizationName(subdomain.toUpperCase());
    } else {
      setOrganizationName("UTB");
    }
  }, []);

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

  const getLatestCertificate = () => {
    if (certificateData?.data && certificateData.data.length > 0) {
      return certificateData.data[certificateData.data.length - 1];
    }
    return null;
  };

  const latestCertificate = getLatestCertificate();

  const detailsCollapseItems = latestCertificate
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
              {latestCertificate.certificateData.map((sec) =>
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
                  value: latestCertificate.txHash,
                },
                {
                  key: "2",
                  property: "Block ID",
                  value: latestCertificate.blockId,
                },
                {
                  key: "3",
                  property: "Thời gian xác thực",
                  value: latestCertificate.createdAt
                    ? new Date(latestCertificate.createdAt).toLocaleString(
                        "vi-VN",
                      )
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
          padding: "0 15px",
          height: "70px",
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
                fontSize: 20,
                color: "#60a5fa",
                marginRight: 8,
                flexShrink: 0,
              }}
            />
            <Text
              strong
              className="header-text"
              style={{
                color: "white",
                fontSize: 14,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span className="desktop-only">
                {organizationName} | Authenticate.io.vn
              </span>
              <span className="mobile-hidden">{organizationName}</span>
            </Text>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Link href="/login">
              <Button
                type="primary"
                size="small"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                  border: "none",
                  height: "32px",
                  padding: "0 16px",
                  borderRadius: "16px",
                  fontSize: "14px",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                }}
              >
                Đăng Nhập
              </Button>
            </Link>
          </div>
        </div>
      </Header>

      <Content style={{ paddingTop: "70px" }}>
        <style jsx global>{`
          @media (min-width: 768px) {
            .header-text .desktop-only {
              display: inline !important;
            }
            .header-text .mobile-hidden {
              display: none !important;
            }
          }

          @media (max-width: 767px) {
            .header-text .desktop-only {
              display: none !important;
            }
            .header-text .mobile-hidden {
              display: inline !important;
            }

            .ant-typography h1 {
              font-size: 28px !important;
              line-height: 1.2 !important;
            }

            .ant-typography h3 {
              font-size: 20px !important;
            }

            .ant-typography h4 {
              font-size: 18px !important;
            }

            .ant-input-lg {
              font-size: 16px !important;
            }

            .ant-btn-lg {
              font-size: 16px !important;
            }

            .certificate-card {
              margin: 0 10px !important;
            }

            .feature-section {
              padding: 40px 15px !important;
            }

            .search-section {
              padding: 20px 15px !important;
              margin: 0 10px !important;
            }
          }

          @media (max-width: 576px) {
            .ant-typography h1 {
              font-size: 24px !important;
            }

            .ant-typography h3 {
              font-size: 18px !important;
            }

            .ant-col {
              padding: 0 8px !important;
            }

            .ant-row {
              margin: 0 -8px !important;
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

            {/* Blocks */}
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
            <OrgLogo>
              <Text className="logo-text">{organizationName?.charAt(0)}</Text>
            </OrgLogo>

            <Title level={1}>{organizationName}</Title>

            <BrandTagline>
              Hệ thống xác thực chứng chỉ trên nền tảng blockchain
            </BrandTagline>
          </HeroContent>
        </HeroSection>

        <SearchSection className="search-section">
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
              message="Không tìm thây kết quả"
              description="Có thể do nhập sai thông tin hoặc đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại sau!"
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
              <CertificateCard className="certificate-card">
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

                {latestCertificate && (
                  <div>
                    <CertificateDetail>
                      <Row gutter={[24, 16]}>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Loại Chứng Chỉ</Text>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {latestCertificate.certificateType}
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Ngày Cấp</Text>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {new Date(
                              latestCertificate.createdAt,
                            ).toLocaleDateString("vi-VN")}
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <Text type="secondary">Mã Chứng Chỉ</Text>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {latestCertificate.id}
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
                            {latestCertificate.txHash}
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
                )}
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

        <FeatureSection
          className="feature-section"
          style={{ background: getBackgroundColor() }}
        >
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}
          >
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
                    Sử dụng công nghệ phân tán giúp minh bạch hóa quy trình cấp
                    và xác thực chứng chỉ.
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
                </FeatureCard>{" "}
              </Col>
            </Row>
          </div>
        </FeatureSection>
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
    </Layout>
  );
}

import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import { useTranslation } from "react-i18next";
import { useCertificateStatistics } from "@/services/CertificateService";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const COLORS = ["#52c41a", "#faad14", "#ff4d4f"];

const OrganizationDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: certStats } = useCertificateStatistics();

  const pieData = [
    {
      name: t("dashboard.issued"),
      value: certStats?.data?.issued || 0,
    },
    {
      name: t("dashboard.pending"),
      value: certStats?.data?.pending || 0,
    },
    {
      name: t("dashboard.revoked"),
      value: certStats?.data?.revoked || 0,
    },
  ];

  const totalCertificates = certStats?.data?.total || 0;
  const issuedCertificates = certStats?.data?.issued || 0;
  const progressPercent =
    totalCertificates > 0
      ? Math.round((issuedCertificates / totalCertificates) * 100)
      : 0;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <p
            style={{ margin: 0 }}
          >{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            hoverable
            style={{
              background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "white" }}>
                  {t("dashboard.totalCertificates")}
                </span>
              }
              value={totalCertificates}
              valueStyle={{ color: "white" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            style={{
              background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "white" }}>
                  {t("dashboard.issuedCertificates")}
                </span>
              }
              value={issuedCertificates}
              valueStyle={{ color: "white" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            style={{
              background: "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "white" }}>
                  {t("dashboard.pendingCertificates")}
                </span>
              }
              value={certStats?.data?.pending || 0}
              valueStyle={{ color: "white" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "24px",
                color: "#1890ff",
              }}
            >
              {t("dashboard.certificateStatus")}
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      name,
                      percent,
                    }: {
                      name: string;
                      percent: number;
                    }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "24px",
                color: "#1890ff",
              }}
            >
              {t("dashboard.certificateProgress")}
            </h3>
            <div style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={progressPercent}
                format={(percent) => `${percent}%`}
                size={200}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
              />
              <div
                style={{
                  marginTop: 16,
                  fontSize: "16px",
                  color: "#666",
                }}
              >
                {t("dashboard.issuedVsTotal", {
                  issued: issuedCertificates,
                  total: totalCertificates,
                })}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrganizationDashboard;

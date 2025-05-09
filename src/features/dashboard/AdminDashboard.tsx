import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import {
  useOrganizationStatistics,
  useOrganizationMonthlyStatistics,
} from "@/services/OrganizationService";
import { useTenantStatistics } from "@/services/TenantService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TeamOutlined,
  LockOutlined,
  SafetyOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

interface ChartData {
  name: string;
  value: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: orgStats } = useOrganizationStatistics();
  const { data: monthlyStats } = useOrganizationMonthlyStatistics();
  const { data: tenantStats } = useTenantStatistics();

  const chartData: ChartData[] = React.useMemo(() => {
    if (!monthlyStats || !Array.isArray(monthlyStats)) {
      return [];
    }
    return monthlyStats.map((item) => ({
      name: item.month,
      value: item.count,
    }));
  }, [monthlyStats]);

  const totalOrgs = orgStats?.data?.totalOrganizations || 0;
  const orgsWithout2FA = orgStats?.data?.organizationsWithout2FA || 0;
  const lockedOrgs = orgStats?.data?.lockedOrganizations || 0;
  const totalTenants = tenantStats?.data?.totalTenants || 0;
  const activeTenants = tenantStats?.data?.activeTenants || 0;
  const unusedTenants = tenantStats?.data?.unusedTenants || 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <p style={{ margin: 0 }}>{`${t("dashboard.month")}: ${label}`}</p>
          <p
            style={{ margin: 0, color: "#1890ff" }}
          >{`${t("dashboard.count")}: ${payload[0].value}`}</p>
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
                  {t("dashboard.totalOrganizations")}
                </span>
              }
              value={totalOrgs}
              valueStyle={{ color: "white" }}
              prefix={<TeamOutlined />}
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
                  {t("dashboard.organizationsWithout2FA")}
                </span>
              }
              value={orgsWithout2FA}
              valueStyle={{ color: "white" }}
              prefix={<SafetyOutlined />}
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
                  {t("dashboard.lockedOrganizations")}
                </span>
              }
              value={lockedOrgs}
              valueStyle={{ color: "white" }}
              prefix={<LockOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <br />

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            hoverable
            style={{
              background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "white" }}>
                  {t("dashboard.totalTenants")}
                </span>
              }
              value={totalTenants}
              valueStyle={{ color: "white" }}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            style={{
              background: "linear-gradient(135deg, #13c2c2 0%, #08979c 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "white" }}>
                  {t("dashboard.activeTenants")}
                </span>
              }
              value={activeTenants}
              valueStyle={{ color: "white" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            style={{
              background: "linear-gradient(135deg, #eb2f96 0%, #c41d7f 100%)",
              color: "white",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "white" }}>
                  {t("dashboard.unusedTenants")}
                </span>
              }
              value={unusedTenants}
              valueStyle={{ color: "white" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <h3 style={{ marginBottom: "16px", marginTop: "24px", color: "#1890ff" }}>
        {t("dashboard.organizationGrowth")}
      </h3>
      <Card
        style={{
          marginTop: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#666" }}
                axisLine={{ stroke: "#666" }}
              />
              <YAxis tick={{ fill: "#666" }} axisLine={{ stroke: "#666" }} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(24, 144, 255, 0.1)" }}
              />
              <Bar
                dataKey="value"
                fill="#1890ff"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;

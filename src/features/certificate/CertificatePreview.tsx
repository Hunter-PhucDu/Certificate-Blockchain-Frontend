"use client";

import React from "react";
import { Card, Typography, Space, Divider } from "antd";
import { CertificateTemplate } from "@/features/certificate/certificateTemplates";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

interface CertificatePreviewProps {
  template: CertificateTemplate | undefined;
  data: Record<string, string | number | undefined>;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  template,
  data,
}) => {
  const { t } = useTranslation();

  if (!template) return null;

  return (
    <Card
      style={{
        width: "100%",
        background: "#fff",
        border: "2px solid #1890ff",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Title level={3}>{template.name}</Title>
        <Text type="secondary">{template.description}</Text>
      </div>
      <Divider />
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {template.fields.map((field) => (
          <div key={field.key}>
            <Text strong>{field.label}:</Text>
            <br />
            <Text>{data[field.key] || t("common.certificates.noData")}</Text>
          </div>
        ))}
      </Space>
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Text type="secondary">
          {t("common.certificates.blockchainVerification")}
        </Text>
      </div>
    </Card>
  );
};

export default CertificatePreview;

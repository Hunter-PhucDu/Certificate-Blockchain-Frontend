"use client";

import React from "react";
import { Card, Typography, Space, Divider } from "antd";
import { CertificateTemplate } from "@/features/certificate/certificateTemplates";
import { useTranslation } from "react-i18next";
import { Certificate } from "@/services/CertificateService";

const { Title, Text } = Typography;

interface CertificatePreviewProps {
  template?: CertificateTemplate;
  data?: Record<string, string | number | undefined>;
  certificate?: Certificate;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  template,
  data,
  certificate,
}) => {
  const { t } = useTranslation();

  if (!template && !certificate) return null;

  const isCustomCertificate = certificate && !template;

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
        <Title level={3}>
          {certificate?.certificateType || template?.name}
        </Title>
        {!isCustomCertificate && (
          <Text type="secondary">{template?.description}</Text>
        )}
      </div>
      <Divider />
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {certificate
          ? certificate.certificateData.map((field) => (
              <div key={field.key}>
                <Text strong>{field.values[0].label}:</Text>
                <br />
                <Text>
                  {field.values[0].value || t("common.certificates.noData")}
                </Text>
              </div>
            ))
          : template?.fields.map((field) => (
              <div key={field.key}>
                <Text strong>{field.label}:</Text>
                <br />
                <Text>
                  {data?.[field.key] || t("common.certificates.noData")}
                </Text>
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

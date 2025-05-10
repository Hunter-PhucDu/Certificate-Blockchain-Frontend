/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Button,
  Space,
  Table,
  Modal,
  Typography,
  Popconfirm,
  Tooltip,
  Input,
  Dropdown,
  Select,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  DownloadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  certificateTemplates,
  CertificateTemplate,
} from "@/features/certificate/certificateTemplates";
import CertificatePreview from "./CertificatePreview";
import CertificateCreate from "./CertificateCreate";
import CertificateImport from "./CertificateImport";
import { App } from "antd";
import {
  useDeleteCertificate,
  useCertificates,
  Certificate,
} from "@/services/CertificateService";
import Papa from "papaparse";
import type { FormInstance } from "antd";
import type { MenuProps } from "antd";

const { Title } = Typography;

interface CertificateManagementProps {
  groupId: string;
  certificates: Certificate[];
  onCertificatesChange: () => void;
  form: FormInstance;
}

const CertificateManagement: React.FC<CertificateManagementProps> = ({
  groupId,
  certificates,
  form,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [searchText, setSearchText] = useState("");
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const { refetch: refetchCertificates } = useCertificates();
  const deleteCertificate = useDeleteCertificate();
  const handleDeleteCertificate = async (certificateId: string) => {
    try {
      await deleteCertificate.mutateAsync(certificateId);
      messageApi.success(t("common.certificates.deleteSuccess"));
      refetchCertificates();
    } catch {
      messageApi.error(t("common.certificates.error"));
    }
  };

  const showModal = (certificate?: Certificate) => {
    if (certificate) {
      setEditingCertificate(certificate);
      const initialValues: Record<string, any> = {};
      certificate.certificateData.forEach((data) => {
        initialValues[data.key] = data.values[0].value;
      });
      form.setFieldsValue(initialValues);
    } else {
      setEditingCertificate(null);
    }
    setIsModalVisible(true);
  };

  const exportAllToCsv = () => {
    if (certificates.length === 0) {
      messageApi.info(t("common.certificates.noCertificatesToExport"));
      return;
    }

    // Group certificates by type
    const certsByType = certificates.reduce(
      (acc, cert) => {
        if (!acc[cert.certificateType]) {
          acc[cert.certificateType] = [];
        }
        acc[cert.certificateType].push(cert);
        return acc;
      },
      {} as Record<string, Certificate[]>,
    );

    // Ask which type to export if there are multiple types
    if (Object.keys(certsByType).length > 1) {
      let selectedType = "";

      Modal.confirm({
        title: t("common.certificates.selectTypeToExport"),
        content: (
          <Select
            style={{ width: "100%", marginTop: 16 }}
            placeholder={t("common.certificates.selectType")}
            onChange={(value: string) => {
              selectedType = value;
            }}
          >
            {Object.keys(certsByType).map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        ),
        onOk: () => {
          if (selectedType) {
            exportCertificatesByType(certsByType[selectedType]);
          } else {
            messageApi.warning(t("common.certificates.selectType"));
          }
        },
        okText: t("common.certificates.exportNow"),
        cancelText: t("common.cancel"),
      });
    } else {
      const type = Object.keys(certsByType)[0];
      exportCertificatesByType(certsByType[type]);
    }
  };

  const exportCertificatesByType = (certsToExport: Certificate[]) => {
    if (!certsToExport || certsToExport.length === 0) return;

    try {
      const allFieldKeys = new Set<string>();
      certsToExport.forEach((cert) => {
        cert.certificateData.forEach((data) => {
          allFieldKeys.add(data.key);
        });
      });

      const csvData = certsToExport.map((cert) => {
        const row: Record<string, any> = {};

        cert.certificateData.forEach((data) => {
          const fieldLabel = data.values[0].label;
          row[fieldLabel] = data.values[0].value;
        });

        return row;
      });

      const fields = Array.from(allFieldKeys).map((key) => {
        const cert = certsToExport.find((c) =>
          c.certificateData.some((d) => d.key === key),
        );
        if (cert) {
          const data = cert.certificateData.find((d) => d.key === key);
          if (data) return data.values[0].label;
        }
        return key;
      });

      const csv =
        "\ufeff" +
        Papa.unparse({
          fields,
          data: csvData,
        });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `certificates_${certsToExport[0].certificateType.replace(/\s+/g, "_")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      messageApi.success(t("common.certificates.exportSuccess"));
    } catch (error) {
      console.error("Export error:", error);
      messageApi.error(t("common.certificates.exportError"));
    }
  };

  const moreActions: MenuProps["items"] = [
    {
      key: "import",
      label: t("common.import"),
      icon: <ImportOutlined />,
      onClick: () => setIsImportModalVisible(true),
    },
    {
      key: "export",
      label: t("common.export"),
      icon: <DownloadOutlined />,
      onClick: exportAllToCsv,
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4}>{t("common.certificates.list")}</Title>
        <Space>
          <Input
            placeholder={t("common.certificates.search")}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            {t("common.certificates.create")}
          </Button>
          <Dropdown menu={{ items: moreActions }} placement="bottomRight">
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      </div>

      <Table
        columns={[
          {
            title: t("common.certificates.type"),
            dataIndex: "certificateType",
            key: "certificateType",
            render: (type: string) => {
              const template = certificateTemplates.find(
                (template: CertificateTemplate) => template.id === type,
              );
              return template ? template.name : type;
            },
          },
          {
            title: t("common.certificates.createdAt"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => new Date(date).toLocaleDateString(),
          },
          {
            title: t("common.certificates.updatedAt"),
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (date: string) => new Date(date).toLocaleDateString(),
          },
          {
            title: t("common.certificates.actions"),
            key: "actions",
            render: (_: any, record: Certificate) => (
              <Space>
                <Tooltip title={t("common.certificates.preview")}>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      setPreviewData({});
                      setSelectedTemplate(record.id);
                      setIsPreviewVisible(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title={t("common.certificates.edit")}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => showModal(record)}
                  />
                </Tooltip>
                <Tooltip title={t("common.certificates.delete")}>
                  <Popconfirm
                    title={t("common.certificates.confirmDelete")}
                    onConfirm={() => handleDeleteCertificate(record.id)}
                    okText={t("common.certificates.yes")}
                    cancelText={t("common.certificates.no")}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Tooltip>
              </Space>
            ),
          },
        ]}
        dataSource={certificates.filter((cert) =>
          cert.certificateType.toLowerCase().includes(searchText.toLowerCase()),
        )}
        rowKey="id"
      />

      <CertificateCreate
        isVisible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCertificate(null);
          form.resetFields();
        }}
        groupId={groupId}
        editingCertificate={editingCertificate}
        form={form}
      />

      <CertificateImport
        isVisible={isImportModalVisible}
        onCancel={() => {
          setIsImportModalVisible(false);
          refetchCertificates();
        }}
        groupId={groupId}
      />

      <Modal
        title={t("common.certificates.preview")}
        open={isPreviewVisible}
        onCancel={() => {
          setIsPreviewVisible(false);
          setPreviewData({});
          setSelectedTemplate(null);
        }}
        footer={null}
        width={800}
      >
        <CertificatePreview
          template={certificateTemplates.find(
            (template: CertificateTemplate) => template.id === selectedTemplate,
          )}
          certificate={certificates.find(
            (cert) => cert.id === selectedTemplate,
          )}
          data={previewData}
        />
      </Modal>
    </div>
  );
};

export default CertificateManagement;

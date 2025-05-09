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
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  certificateTemplates,
  CertificateTemplate,
} from "@/features/certificate/certificateTemplates";
import CertificatePreview from "./CertificatePreview";
import CertificateCreate from "./CertificateCreate";
import { App } from "antd";
import {
  useCreateCertificate,
  useDeleteCertificate,
  useUpdateCertificate,
  useCertificates,
  Certificate,
  CertificateData,
} from "@/services/CertificateService";

const { Title } = Typography;

interface CertificateManagementProps {
  groupId: string;
  certificates: Certificate[];
  onCertificatesChange: (certificates: Certificate[]) => void;
}

const CertificateManagement: React.FC<CertificateManagementProps> = ({
  groupId,
  certificates,
  onCertificatesChange,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [searchText, setSearchText] = useState("");
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const { refetch: refetchCertificates } = useCertificates();
  const createCertificate = useCreateCertificate();
  const deleteCertificate = useDeleteCertificate();
  const updateCertificate = useUpdateCertificate();

  const handleCreateCertificate = async (values: any) => {
    try {
      await createCertificate.mutateAsync({
        groupId,
        certificateType: values.certificateType,
        certificateData: values.certificateData,
      });
      messageApi.success(t("common.certificates.createSuccess"));
      setIsModalVisible(false);
      refetchCertificates();
    } catch {
      messageApi.error(t("common.certificates.error"));
    }
  };

  const handleEditCertificate = async (values: any) => {
    try {
      if (!editingCertificate) return;
      await updateCertificate.mutateAsync({
        id: editingCertificate.id,
        data: {
          certificateData: values.certificateData,
        },
      });
      messageApi.success(t("common.certificates.updateSuccess"));
      setIsModalVisible(false);
      refetchCertificates();
    } catch {
      messageApi.error(t("common.certificates.error"));
    }
  };

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
    } else {
      setEditingCertificate(null);
    }
    setIsModalVisible(true);
  };

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
                      const template = certificateTemplates.find(
                        (template: CertificateTemplate) =>
                          template.id === record.certificateType,
                      );
                      if (template) {
                        const previewData: Record<string, any> = {};
                        record.certificateData.forEach((data) => {
                          previewData[data.key] = data.values[0].value;
                        });
                        setPreviewData(previewData);
                        setSelectedTemplate(record.certificateType);
                        setIsPreviewVisible(true);
                      }
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
        }}
        groupId={groupId}
        editingCertificate={editingCertificate}
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
          data={previewData}
        />
      </Modal>
    </div>
  );
};

export default CertificateManagement;

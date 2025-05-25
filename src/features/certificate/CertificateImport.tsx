/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Upload,
  Button,
  message,
  Typography,
  Table,
  Spin,
  Alert,
  Divider,
  Input,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import {
  useBulkCreateCertificates,
  CertificateData,
  BulkCreateCertificateBody,
} from "@/services/CertificateService";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload/interface";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

interface CertificateImportProps {
  isVisible: boolean;
  onCancel: () => void;
  groupId: string;
}

const CertificateImport: React.FC<CertificateImportProps> = ({
  isVisible,
  onCancel,
  groupId,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const bulkCreateMutation = useBulkCreateCertificates();

  const resetState = () => {
    setCsvData([]);
    setHeaders([]);
    setProcessingStatus("idle");
    setErrorMessage("");
    form.resetFields();
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  const beforeUpload = (file: RcFile) => {
    const isCsv = file.type === "text/csv" || file.name.endsWith(".csv");
    if (!isCsv) {
      message.error(t("common.certificates.csvOnly"));
    }
    return isCsv || Upload.LIST_IGNORE;
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".csv",
    beforeUpload,
    customRequest: ({ file, onSuccess }: any) => {
      Papa.parse(file as File, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8",
        complete: (results) => {
          if (results.data && results.data.length > 0 && results.meta.fields) {
            setCsvData(results.data);
            setHeaders(results.meta.fields);
            onSuccess("ok");
          } else {
            message.error(t("common.certificates.csvParseError"));
          }
        },
        error: () => {
          message.error(t("common.certificates.csvParseError"));
        },
      });
    },
    onRemove: () => {
      setCsvData([]);
      setHeaders([]);
      return true;
    },
  };

  const importCertificates = async (values: any) => {
    if (csvData.length === 0) {
      message.error(t("common.certificates.noCsvData"));
      return;
    }

    try {
      setProcessingStatus("processing");

      const certificatesData: CertificateData[][] = csvData.map((row) => {
        return Object.entries(row).map(([header, value]) => ({
          key: header.trim(),
          values: [
            {
              label: header.trim(),
              value: String(value || ""),
              type: determineValueType(value),
              isUnique: false,
            },
          ],
        }));
      });

      const bulkData: BulkCreateCertificateBody = {
        groupId,
        certificateType: values.certificateType,
        certificatesData,
      };

      await bulkCreateMutation.mutateAsync(bulkData);
      setProcessingStatus("success");
    } catch (error) {
      setProcessingStatus("error");
      setErrorMessage(
        typeof error === "string"
          ? error
          : t("common.certificates.importError"),
      );
    }
  };

  const determineValueType = (
    value: any,
  ): "String" | "Number" | "Date" | "Boolean" => {
    if (value === null || value === undefined || value === "") return "String";

    if (!isNaN(Number(value)) && value.toString().trim() !== "")
      return "Number";

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Date";

    if (
      value.toString().toLowerCase() === "true" ||
      value.toString().toLowerCase() === "false"
    )
      return "Boolean";

    return "String";
  };

  const renderImportSteps = () => {
    if (processingStatus === "processing") {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: "16px" }}>
            {t("common.certificates.importProcessing")}
          </Paragraph>
        </div>
      );
    }

    if (processingStatus === "success") {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Alert
            message={t("common.certificates.importSuccess")}
            description={t("common.certificates.importSuccessMessage")}
            type="success"
            showIcon
          />
          <Button
            type="primary"
            onClick={handleCancel}
            style={{ marginTop: "16px" }}
          >
            {t("common.close")}
          </Button>
        </div>
      );
    }

    if (processingStatus === "error") {
      return (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Alert
            message={t("common.certificates.importError")}
            description={
              errorMessage || t("common.certificates.importErrorMessage")
            }
            type="error"
            showIcon
          />
          <Button
            type="primary"
            onClick={() => setProcessingStatus("idle")}
            style={{ marginTop: "16px" }}
          >
            {t("common.retry")}
          </Button>
        </div>
      );
    }

    return (
      <Form form={form} layout="vertical" onFinish={importCertificates}>
        <Form.Item
          name="certificateType"
          label={t("common.certificates.typeName")}
          rules={[{ required: true, message: t("common.required") }]}
        >
          <Input placeholder={t("common.certificates.typeNamePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="file"
          label={t("common.certificates.uploadCSV")}
          rules={[{ required: true, message: t("common.required") }]}
        >
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              {t("common.certificates.uploadCSVText")}
            </p>
            <p className="ant-upload-hint">
              {t("common.certificates.uploadCSVHint")}
            </p>
          </Dragger>
        </Form.Item>

        {csvData.length > 0 && (
          <>
            <Divider />

            <div>
              <Title level={4}>{t("common.certificates.reviewData")}</Title>
              <Paragraph>
                {t("common.certificates.totalRecords")}: {csvData.length}
                {csvData.length > 0 && (
                  <span style={{ marginLeft: "8px", color: "#1890ff" }}>
                    ({t("common.certificates.allRecordsDisplayed")})
                  </span>
                )}
              </Paragraph>

              <Table
                dataSource={csvData}
                columns={headers.map((header) => ({
                  title: header,
                  dataIndex: header,
                  key: header,
                }))}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total) =>
                    t("common.pagination.showTotal", { total }),
                }}
                size="small"
                rowKey={(record, index) => index?.toString() || "0"}
                scroll={{ y: 300 }}
              />
            </div>
          </>
        )}

        <Form.Item style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={bulkCreateMutation.isPending}
            disabled={csvData.length === 0}
          >
            {t("common.certificates.importNow")}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={t("common.certificates.importCertificates")}
      open={isVisible}
      onCancel={handleCancel}
      width={900}
      style={{ top: 20 }}
      footer={null}
    >
      {renderImportSteps()}
    </Modal>
  );
};

export default CertificateImport;

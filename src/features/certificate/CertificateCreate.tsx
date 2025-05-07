"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  Typography,
  Checkbox,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { certificateTemplates } from "@/configs/certificateTemplates";
import CertificatePreview from "./CertificatePreview";
import { App } from "antd";

const { Title } = Typography;

interface CertificateCreateProps {
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingCertificate?: any;
}

const CertificateCreate: React.FC<CertificateCreateProps> = ({
  isVisible,
  onCancel,
  onSubmit,
  editingCertificate,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);
  const [customFields, setCustomFields] = useState<
    Array<{
      key: string;
      label: string;
      type: string;
      isUnique?: boolean;
      options?: string[];
    }>
  >([]);
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = certificateTemplates.find((t) => t.id === templateId);
    if (template) {
      const initialValues: Record<string, any> = {
        certificateName: template.name,
      };
      template.fields.forEach((field) => {
        initialValues[field.key] = "";
      });
      form.setFieldsValue(initialValues);
      setPreviewData(initialValues);
    }
  };

  const handleFormValuesChange = (changedValues: Record<string, any>) => {
    setPreviewData((prev) => ({ ...prev, ...changedValues }));
  };

  const handleAddCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        key: `field_${customFields.length + 1}`,
        label: "",
        type: "text",
        isUnique: false,
      },
    ]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (
    index: number,
    field: string,
    value: any,
  ) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setCustomFields(newFields);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (isCustomTemplate) {
        const certificateData = customFields.map((field) => ({
          key: field.key,
          values: [
            {
              label: field.label,
              value: values[field.key],
              type: field.type,
              isUnique: field.isUnique,
            },
          ],
        }));
        onSubmit({
          certificateName: values.certificateName,
          certificateType: values.certificateName,
          certificateData,
        });
      } else {
        const template = certificateTemplates.find(
          (t) => t.id === selectedTemplate,
        );
        if (!template) return;

        const certificateData = template.fields.map((field) => ({
          key: field.key,
          values: [
            {
              label: field.label,
              value: values[field.key],
              type: field.type,
              isUnique: field.isUnique,
            },
          ],
        }));
        onSubmit({
          certificateName: values.certificateName,
          certificateType: values.certificateName,
          certificateData,
        });
      }
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setSelectedTemplate(null);
    setPreviewData({});
    setIsCustomTemplate(false);
    setCustomFields([]);
  };

  return (
    <Modal
      title={
        editingCertificate
          ? t("common.certificates.edit")
          : t("common.certificates.create")
      }
      open={isVisible}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <div>
          <Form
            form={form}
            onFinish={handleSubmit}
            onValuesChange={handleFormValuesChange}
            layout="vertical"
          >
            <Form.Item
              name="certificateName"
              label={t("common.certificates.name")}
              rules={[
                { required: true, message: t("common.certificates.required") },
              ]}
            >
              <Input placeholder={t("common.certificates.enterName")} />
            </Form.Item>

            {!editingCertificate && (
              <>
                <Form.Item
                  name="templateType"
                  label={t("common.certificates.templateType")}
                  rules={[
                    {
                      required: true,
                      message: t("common.certificates.required"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("common.certificates.selectTemplateType")}
                    onChange={(value) => {
                      setIsCustomTemplate(value === "custom");
                      if (value === "custom") {
                        setSelectedTemplate(null);
                      }
                    }}
                  >
                    <Select.Option value="predefined">
                      {t("common.certificates.predefinedTemplate")}
                    </Select.Option>
                    <Select.Option value="custom">
                      {t("common.certificates.customTemplate")}
                    </Select.Option>
                  </Select>
                </Form.Item>

                {!isCustomTemplate && (
                  <Form.Item
                    name="template"
                    label={t("common.certificates.selectTemplate")}
                    rules={[
                      {
                        required: true,
                        message: t("common.certificates.required"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("common.certificates.selectTemplate")}
                      onChange={handleTemplateSelect}
                    >
                      {certificateTemplates.map((template) => (
                        <Select.Option key={template.id} value={template.id}>
                          {template.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                {isCustomTemplate && (
                  <Card
                    title={t("common.certificates.customFields")}
                    extra={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddCustomField}
                      >
                        {t("common.certificates.addField")}
                      </Button>
                    }
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {customFields.map((field, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                          }}
                        >
                          <Form.Item
                            style={{ flex: 2, marginBottom: 0 }}
                            required
                          >
                            <Input
                              value={field.label}
                              onChange={(e) =>
                                handleCustomFieldChange(
                                  index,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder={t(
                                "common.certificates.enterFieldLabel",
                              )}
                            />
                          </Form.Item>
                          <Form.Item
                            style={{ flex: 1, marginBottom: 0 }}
                            required
                          >
                            <Select
                              value={field.type}
                              onChange={(value) =>
                                handleCustomFieldChange(index, "type", value)
                              }
                              style={{ width: "100%" }}
                            >
                              <Select.Option value="text">
                                {t("common.certificates.text")}
                              </Select.Option>
                              <Select.Option value="number">
                                {t("common.certificates.number")}
                              </Select.Option>
                              <Select.Option value="date">
                                {t("common.certificates.date")}
                              </Select.Option>
                              <Select.Option value="select">
                                {t("common.certificates.select")}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item style={{ marginBottom: 0 }}>
                            <Checkbox
                              checked={field.isUnique}
                              onChange={(e) =>
                                handleCustomFieldChange(
                                  index,
                                  "isUnique",
                                  e.target.checked,
                                )
                              }
                            >
                              {t("common.certificates.isUnique")}
                            </Checkbox>
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveCustomField(index)}
                          />
                          {field.type === "select" && (
                            <Form.Item
                              style={{ flex: 2, marginBottom: 0 }}
                              required
                            >
                              <Select
                                mode="tags"
                                value={field.options}
                                onChange={(value) =>
                                  handleCustomFieldChange(
                                    index,
                                    "options",
                                    value,
                                  )
                                }
                                style={{ width: "100%" }}
                                placeholder={t(
                                  "common.certificates.enterOptions",
                                )}
                              />
                            </Form.Item>
                          )}
                        </div>
                      ))}
                    </Space>
                  </Card>
                )}
              </>
            )}

            {(selectedTemplate || editingCertificate || isCustomTemplate) && (
              <>
                <Divider>{t("common.certificates.certificateData")}</Divider>
                {!isCustomTemplate
                  ? certificateTemplates
                      .find(
                        (t) =>
                          t.id ===
                          (editingCertificate?.certificateType ||
                            selectedTemplate),
                      )
                      ?.fields.map((field) => (
                        <Form.Item
                          key={field.key}
                          name={field.key}
                          label={field.label}
                          rules={[
                            {
                              required: true,
                              message: t("common.certificates.required"),
                            },
                          ]}
                        >
                          {field.type === "select" ? (
                            <Select
                              placeholder={t("common.certificates.select")}
                            >
                              {field.options?.map((option) => (
                                <Select.Option key={option} value={option}>
                                  {option}
                                </Select.Option>
                              ))}
                            </Select>
                          ) : field.type === "date" ? (
                            <Input type="date" />
                          ) : (
                            <Input
                              placeholder={t("common.certificates.enterValue")}
                            />
                          )}
                        </Form.Item>
                      ))
                  : customFields.map((field) => (
                      <Form.Item
                        key={field.key}
                        name={field.key}
                        label={field.label}
                        rules={[
                          {
                            required: true,
                            message: t("common.certificates.required"),
                          },
                        ]}
                      >
                        {field.type === "select" ? (
                          <Select placeholder={t("common.certificates.select")}>
                            {field.options?.map((option) => (
                              <Select.Option key={option} value={option}>
                                {option}
                              </Select.Option>
                            ))}
                          </Select>
                        ) : field.type === "date" ? (
                          <Input type="date" />
                        ) : (
                          <Input
                            placeholder={t("common.certificates.enterValue")}
                          />
                        )}
                      </Form.Item>
                    ))}
              </>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingCertificate
                    ? t("common.certificates.update")
                    : t("common.certificates.create")}
                </Button>
                <Button onClick={handleCancel}>
                  {t("common.certificates.cancel")}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <div>
          <Title level={4}>{t("common.certificates.preview")}</Title>
          <CertificatePreview
            template={
              isCustomTemplate
                ? {
                    id: "custom",
                    name:
                      previewData.certificateName ||
                      t("common.certificates.customTemplate"),
                    description: "",
                    fields: customFields.map((field) => ({
                      ...field,
                      type: field.type as "text" | "number" | "date" | "select",
                    })),
                  }
                : certificateTemplates.find(
                    (t) =>
                      t.id ===
                      (editingCertificate?.certificateType || selectedTemplate),
                  )
            }
            data={previewData}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CertificateCreate;

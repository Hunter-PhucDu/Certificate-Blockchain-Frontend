/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  Card,
  Checkbox,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { certificateTemplates } from "./certificateTemplates";
import CertificatePreview from "./CertificatePreview";
import { App } from "antd";
import {
  useCreateCertificate,
  useUpdateCertificate,
  CertificateData,
  CertificateValueType,
} from "@/services/CertificateService";
import { Certificate } from "@/services/CertificateService";
import type { FormInstance } from "antd";

const { Title } = Typography;

interface CertificateCreateProps {
  isVisible: boolean;
  onCancel: () => void;
  groupId: string;
  editingCertificate: Certificate | null;
  form: FormInstance;
}

interface CustomField {
  key: string;
  label: string;
  type: CertificateValueType;
  isUnique?: boolean;
  options?: string[];
}

const CertificateCreate: React.FC<CertificateCreateProps> = ({
  isVisible,
  onCancel,
  groupId,
  editingCertificate,
  form,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const createCertificate = useCreateCertificate();
  const updateCertificate = useUpdateCertificate();

  useEffect(() => {
    if (editingCertificate) {
      setSelectedTemplate(editingCertificate.certificateType);
      const initialValues: Record<string, any> = {};
      editingCertificate.certificateData.forEach((data: CertificateData) => {
        initialValues[data.key] = data.values[0].value;
      });
      form.setFieldsValue(initialValues);
      setPreviewData(initialValues);
    } else {
      form.resetFields();
      setSelectedTemplate(null);
      setPreviewData({});
      setIsCustomTemplate(false);
      setCustomFields([]);
    }
  }, [editingCertificate, form]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = certificateTemplates.find((t) => t.id === templateId);
    if (template) {
      const initialValues: Record<string, any> = {};
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
        type: "String",
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

  const handleCreateCertificate = async (values: any) => {
    try {
      let certificateData: CertificateData[];
      let certificateType: string;

      if (isCustomTemplate) {
        certificateData = customFields.map((field) => ({
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
        certificateType = values.certificateName;
      } else {
        const template = certificateTemplates.find(
          (t) => t.id === selectedTemplate,
        );
        if (!template) return;

        certificateData = template.fields.map((field) => ({
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
        certificateType = selectedTemplate!;
      }

      if (editingCertificate) {
        await updateCertificate.mutateAsync({
          id: editingCertificate.id,
          data: {
            certificateData,
          },
        });
        messageApi.success(t("common.certificates.updateSuccess"));
      } else {
        await createCertificate.mutateAsync({
          groupId,
          certificateType,
          certificateData,
        });
        messageApi.success(t("common.certificates.createSuccess"));
      }
      onCancel();
    } catch {
      messageApi.error(t("common.certificates.error"));
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
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        <div>
          <Form
            form={form}
            onFinish={handleCreateCertificate}
            onValuesChange={handleFormValuesChange}
            layout="vertical"
          >
            {!editingCertificate && (
              <Form.Item
                name="templateType"
                label={t("common.certificates.templateType")}
                rules={[{ required: true, message: t("common.required") }]}
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
            )}

            {!isCustomTemplate && !editingCertificate && (
              <Form.Item
                name="template"
                label={t("common.selectTemplate")}
                rules={[{ required: true, message: t("common.required") }]}
              >
                <Select
                  placeholder={t("common.selectTemplate")}
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
              <>
                <Form.Item
                  name="certificateName"
                  label={t("common.certificates.name")}
                  rules={[{ required: true, message: t("common.required") }]}
                >
                  <Input placeholder={t("common.certificates.enterName")} />
                </Form.Item>

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
                            <Select.Option value="String">
                              {t("common.certificates.text")}
                            </Select.Option>
                            <Select.Option value="Number">
                              {t("common.certificates.number")}
                            </Select.Option>
                            <Select.Option value="Date">
                              {t("common.certificates.date")}
                            </Select.Option>
                            <Select.Option value="Boolean">
                              {t("common.certificates.boolean")}
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
                      </div>
                    ))}
                  </Space>
                </Card>
              </>
            )}

            {(selectedTemplate || isCustomTemplate) && (
              <>
                <Divider>{t("common.certificates.certificateData")}</Divider>
                {!isCustomTemplate
                  ? certificateTemplates
                      .find((t) => t.id === selectedTemplate)
                      ?.fields.map((field) => (
                        <Form.Item
                          key={field.key}
                          name={field.key}
                          label={field.label}
                          rules={[
                            { required: true, message: t("common.required") },
                          ]}
                        >
                          {field.type === "String" && field.options ? (
                            <Select>
                              {field.options.map((option) => (
                                <Select.Option key={option} value={option}>
                                  {option}
                                </Select.Option>
                              ))}
                            </Select>
                          ) : field.type === "Date" ? (
                            <Input type="date" />
                          ) : field.type === "Number" ? (
                            <Input type="number" />
                          ) : field.type === "Boolean" ? (
                            <Select>
                              <Select.Option value="true">Có</Select.Option>
                              <Select.Option value="false">Không</Select.Option>
                            </Select>
                          ) : (
                            <Input />
                          )}
                        </Form.Item>
                      ))
                  : customFields.map((field) => (
                      <Form.Item
                        key={field.key}
                        name={field.key}
                        label={field.label}
                        rules={[
                          { required: true, message: t("common.required") },
                        ]}
                      >
                        {field.type === "String" && field.options ? (
                          <Select>
                            {field.options.map((option) => (
                              <Select.Option key={option} value={option}>
                                {option}
                              </Select.Option>
                            ))}
                          </Select>
                        ) : field.type === "Date" ? (
                          <Input type="date" />
                        ) : field.type === "Number" ? (
                          <Input type="number" />
                        ) : field.type === "Boolean" ? (
                          <Select>
                            <Select.Option value="true">Có</Select.Option>
                            <Select.Option value="false">Không</Select.Option>
                          </Select>
                        ) : (
                          <Input />
                        )}
                      </Form.Item>
                    ))}
              </>
            )}

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    createCertificate.isPending || updateCertificate.isPending
                  }
                >
                  {editingCertificate ? t("common.update") : t("common.create")}
                </Button>
                <Button onClick={handleCancel}>{t("common.cancel")}</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <div>
          <Title level={4}>{t("common.preview")}</Title>
          <CertificatePreview
            template={
              isCustomTemplate
                ? {
                    id: "custom",
                    name:
                      previewData.certificateName ||
                      t("common.certificates.customTemplate"),
                    description: "",
                    fields: customFields,
                  }
                : certificateTemplates.find((t) => t.id === selectedTemplate)
            }
            data={previewData}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CertificateCreate;

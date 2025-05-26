"use client";

import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Space,
  Typography,
  Divider,
  Spin,
  Row,
  Col,
  App,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  useOrganizationProfile,
  useUpdateOrganizationProfile,
} from "@/services/OrganizationService";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useTheme } from "@/providers/Provider";
import PasswordChangeForm from "@/features/settings/PasswordChangeForm";
import ProfilePreview from "@/features/settings/ProfilePreview";
import { useAuthStore } from "@/stores/authStore";
import Image from "next/image";

const { Title, Text } = Typography;

const Settings = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { isDarkMode } = useTheme();
  const { user } = useAuthStore();
  const { message } = App.useApp();

  const isOrganizationRole = user?.role === "ORGANIZATION";

  const { data: profileData, isLoading } = useOrganizationProfile({
    enabled: isOrganizationRole,
  });
  const updateProfileMutation = useUpdateOrganizationProfile();

  const organization = profileData?.data;

  React.useEffect(() => {
    if (organization && isOrganizationRole) {
      form.setFieldsValue({
        organizationName: organization.organizationName,
        phone: organization.phone,
        address: organization.address,
      });

      if (organization.logo) {
        setFileList([
          {
            uid: "-1",
            name: "logo.png",
            status: "done",
            url: organization.logo,
          },
        ]);
      }
    }
  }, [organization, form, isOrganizationRole]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("logo", fileList[0].originFileObj);
      }

      if (values.organizationName) {
        formData.append("organizationName", values.organizationName);
      }

      if (values.phone) {
        formData.append("phone", values.phone);
      }

      if (values.address) {
        formData.append("address", values.address);
      }

      await updateProfileMutation.mutateAsync(formData);
      message.success(t("common.organizations.updateSuccess"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error(t("common.organizations.error"));
    }
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
    accept: "image/*",
  };

  if (isLoading && isOrganizationRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const renderOrganizationForm = () => {
    if (!isOrganizationRole) return null;

    return (
      <Card
        title={
          <Space>
            <TeamOutlined />
            {t("common.organizations.title")}
          </Space>
        }
        style={{
          width: "100%",
          borderRadius: "8px",
          boxShadow: isDarkMode
            ? "0 2px 8px rgba(255, 255, 255, 0.08)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          {organization?.logo && (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                marginBottom: "16px",
                border: isDarkMode ? "2px solid #303030" : "2px solid #f0f0f0",
              }}
            >
              <Image
                src={organization.logo}
                alt="Organization Logo"
                fill
                sizes="120px"
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          {organization?.organizationName && (
            <Title level={4} style={{ margin: "8px 0" }}>
              {organization.organizationName}
            </Title>
          )}
          {organization?.email && (
            <Text type="secondary">
              <MailOutlined style={{ marginRight: "8px" }} />
              {organization.email}
            </Text>
          )}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            organizationName: organization?.organizationName,
            phone: organization?.phone,
            address: organization?.address,
          }}
        >
          <Form.Item name="logo" label={t("common.organizations.logo")}>
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>{t("common.upload")}</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="organizationName"
            label={t("common.organizations.name")}
            rules={[
              {
                required: true,
                message: `${t("common.organizations.name")} ${t("common.required")}`,
              },
            ]}
          >
            <Input
              prefix={<TeamOutlined />}
              placeholder={t("common.organizations.name")}
            />
          </Form.Item>

          <Form.Item name="phone" label={t("common.organizations.phone")}>
            <Input
              prefix={<PhoneOutlined />}
              placeholder={t("common.organizations.phone")}
            />
          </Form.Item>

          <Form.Item name="address" label={t("common.organizations.address")}>
            <Input
              prefix={<HomeOutlined />}
              placeholder={t("common.organizations.address")}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={updateProfileMutation.isPending}
              style={{ width: "100%" }}
            >
              {t("common.update")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  return (
    <div>
      <Title level={2}>{t("common.settings")}</Title>
      <Divider />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={isOrganizationRole ? 8 : 12}>
          <ProfilePreview />
          <PasswordChangeForm />
        </Col>

        {isOrganizationRole ? (
          <Col xs={24} md={12} lg={16}>
            {renderOrganizationForm()}
          </Col>
        ) : (
          <Col xs={24} md={12} lg={12}>
            <></>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Settings;

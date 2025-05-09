"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Popconfirm,
  Card,
  Select,
  App,
  Upload,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
  LockOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  Organization,
} from "@/services/OrganizationService";
import { useUnusedTenants, Tenant } from "@/services/TenantService";
import {
  useResetPasswordOrganizationByAdmin,
  useUnlockOrganizationAccount,
} from "@/services/AuthService";
import type { UploadFile } from "antd/es/upload/interface";

const OrgManagement: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [resetPasswordForm] = Form.useForm();

  const { data: orgsData, isLoading } = useOrganizations();
  const { data: unusedTenantsData } = useUnusedTenants();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();
  const resetPassword = useResetPasswordOrganizationByAdmin();
  const unlockAccount = useUnlockOrganizationAccount();

  const showModal = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);
      form.setFieldsValue(org);
      if (org.logo) {
        setFileList([
          {
            uid: "-1",
            name: "logo.png",
            status: "done",
            url: org.logo,
          },
        ]);
      }
    } else {
      setEditingOrg(null);
      form.resetFields();
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = async (values: Organization) => {
    try {
      const formData = new FormData();
      (Object.keys(values) as (keyof Organization)[]).forEach((key) => {
        if (key !== "logo") {
          formData.append(key, values[key] as string);
        }
      });

      if (fileList[0]?.originFileObj) {
        formData.append("logo", fileList[0].originFileObj);
      }

      if (editingOrg) {
        await updateOrg.mutateAsync({
          id: editingOrg.tenantId,
          data: formData,
        });
        messageApi.success(t("common.organizations.updateSuccess"));
      } else {
        await createOrg.mutateAsync(values);
        messageApi.success(t("common.organizations.createSuccess"));
      }
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch {
      messageApi.error(t("common.organizations.error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrg.mutateAsync(id);
      messageApi.success(t("common.organizations.deleteSuccess"));
    } catch {
      messageApi.error(t("common.organizations.error"));
    }
  };

  const handleResetPassword = async (values: { newPassword: string }) => {
    try {
      await resetPassword.mutateAsync({
        email: editingOrg?.email || "",
        newPassword: values.newPassword,
      });
      messageApi.success(t("common.organizations.resetPasswordSuccess"));
      setResetPasswordModalVisible(false);
      resetPasswordForm.resetFields();
    } catch {
      messageApi.error(t("common.organizations.error"));
    }
  };

  const handleUnlockAccount = async (id: string) => {
    try {
      await unlockAccount.mutateAsync(id);
      messageApi.success(t("common.organizations.unlockSuccess"));
    } catch {
      messageApi.error(t("common.organizations.error"));
    }
  };

  const columns = [
    {
      title: t("common.organizations.name"),
      dataIndex: "organizationName",
      key: "organizationName",
    },
    {
      title: t("common.organizations.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("common.organizations.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("common.organizations.address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("common.organizations.actions"),
      key: "actions",
      render: (_: unknown, record: Organization) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
            {t("common.organizations.edit")}
          </Button>
          <Tooltip title={t("common.organizations.resetPassword")}>
            <Button
              type="link"
              icon={<KeyOutlined />}
              loading={resetPassword.isPending}
              onClick={() => {
                setResetPasswordModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title={t("common.organizations.unlockAccount")}>
            <Button
              type="link"
              icon={<LockOutlined />}
              loading={unlockAccount.isPending}
              onClick={() => handleUnlockAccount(record.tenantId)}
            />
          </Tooltip>
          <Popconfirm
            title={t("common.organizations.confirmDelete")}
            onConfirm={() => handleDelete(record.tenantId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger loading={deleteOrg.isPending}>
              {t("common.organizations.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title={t("common.organizations.title")}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder={t("common.organizations.search")}
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          {t("common.organizations.create")}
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={orgsData?.data}
        rowKey="tenantId"
        loading={isLoading}
      />

      <Modal
        title={
          editingOrg
            ? t("common.organizations.edit")
            : t("common.organizations.create")
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {!editingOrg && (
            <Form.Item
              name="tenantId"
              label={t("common.organizations.tenant")}
              rules={[{ required: true }]}
            >
              <Select
                placeholder={t("common.organizations.selectTenant")}
                options={unusedTenantsData?.data.map((tenant: Tenant) => ({
                  label: tenant.organizationName,
                  value: tenant.id,
                }))}
              />
            </Form.Item>
          )}
          <Form.Item
            name="organizationName"
            label={t("common.organizations.name")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label={t("common.organizations.email")}
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label={t("common.organizations.phone")}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t("common.organizations.address")}>
            <Input />
          </Form.Item>
          {editingOrg && (
            <Form.Item label={t("common.organizations.logo")}>
              <Upload
                listType="picture"
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>{t("common.upload")}</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={editingOrg ? updateOrg.isPending : createOrg.isPending}
              >
                {editingOrg ? t("common.update") : t("common.create")}
              </Button>
              <Button onClick={handleCancel}>{t("common.cancel")}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("common.organizations.resetPassword")}
        open={resetPasswordModalVisible}
        onCancel={() => {
          setResetPasswordModalVisible(false);
          resetPasswordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={resetPasswordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            name="newPassword"
            label={t("common.newPassword")}
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={resetPassword.isPending}
              >
                {t("common.submit")}
              </Button>
              <Button
                onClick={() => {
                  setResetPasswordModalVisible(false);
                  resetPasswordForm.resetFields();
                }}
              >
                {t("common.cancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OrgManagement;

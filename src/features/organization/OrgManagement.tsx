"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Card,
  Upload,
  App,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
  Organization,
} from "@/services/OrganizationService";
import type { UploadFile } from "antd/es/upload/interface";

const OrgManagement: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: orgsData, isLoading } = useOrganizations();
  const createOrg = useCreateOrganization();
  const updateOrg = useUpdateOrganization();
  const deleteOrg = useDeleteOrganization();

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

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        logo: fileList[0]?.url || fileList[0]?.response?.url,
      };

      if (editingOrg) {
        await updateOrg.mutateAsync({
          id: editingOrg.tenantId,
          data: formData,
        });
        messageApi.success(t("common.organizations.updateSuccess"));
      } else {
        await createOrg.mutateAsync(formData);
        messageApi.success(t("common.organizations.createSuccess"));
      }
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      messageApi.error(t("common.organizations.error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrg.mutateAsync(id);
      messageApi.success(t("common.organizations.deleteSuccess"));
    } catch (error) {
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
      render: (_: any, record: Organization) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
            {t("common.organizations.edit")}
          </Button>
          <Popconfirm
            title={t("common.organizations.confirmDelete")}
            onConfirm={() => handleDelete(record.tenantId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
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
          onChange={(e) => setSearchText(e.target.value)}
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
          {!editingOrg && (
            <Form.Item
              name="password"
              label={t("common.password")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}
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
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingOrg ? t("common.update") : t("common.create")}
              </Button>
              <Button onClick={handleCancel}>{t("common.cancel")}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default OrgManagement;

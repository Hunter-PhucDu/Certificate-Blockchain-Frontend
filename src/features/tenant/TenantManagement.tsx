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
  Select,
  App,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  useSearchTenants,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
  Tenant,
} from "@/services/TenantService";

const TenantManagement: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data: tenantsData, isLoading } = useSearchTenants({
    page: pagination.current,
    size: pagination.pageSize,
    search: searchText,
  });

  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();
  const deleteTenant = useDeleteTenant();

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const showModal = (tenant?: Tenant) => {
    if (tenant) {
      setEditingTenant(tenant);
      form.setFieldsValue(tenant);
    } else {
      setEditingTenant(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTenant) {
        await updateTenant.mutateAsync({
          id: editingTenant.tenantName,
          data: values,
        });
        messageApi.success(t("common.tenants.updateSuccess"));
      } else {
        await createTenant.mutateAsync(values);
        messageApi.success(t("common.tenants.createSuccess"));
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      messageApi.error(t("common.tenants.error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTenant.mutateAsync(id);
      messageApi.success(t("common.tenants.deleteSuccess"));
    } catch (error) {
      messageApi.error(t("common.tenants.error"));
    }
  };

  const columns = [
    {
      title: t("common.tenants.name"),
      dataIndex: "tenantName",
      key: "tenantName",
    },
    {
      title: t("common.tenants.organizationName"),
      dataIndex: "organizationName",
      key: "organizationName",
    },
    {
      title: t("common.tenants.subdomain"),
      dataIndex: "subdomain",
      key: "subdomain",
    },
    {
      title: t("common.tenants.actions"),
      key: "actions",
      render: (_: any, record: Tenant) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
            {t("common.tenants.edit")}
          </Button>
          <Popconfirm
            title={t("common.tenants.confirmDelete")}
            onConfirm={() => handleDelete(record.tenantName)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              {t("common.tenants.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title={t("common.tenants.title")}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder={t("common.tenants.search")}
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          {t("common.tenants.create")}
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={tenantsData?.data}
        rowKey="tenantName"
        loading={isLoading}
        pagination={{
          ...pagination,
          total: tenantsData?.metadata.totalItem,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={
          editingTenant ? t("common.tenants.edit") : t("common.tenants.create")
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="tenantName"
            label={t("common.tenants.name")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="organizationName"
            label={t("common.tenants.organizationName")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subdomain"
            label={t("common.tenants.subdomain")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {editingTenant && (
            <Form.Item name="status" label={t("common.tenants.status")}>
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTenant ? t("common.update") : t("common.create")}
              </Button>
              <Button onClick={handleCancel}>{t("common.cancel")}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TenantManagement;

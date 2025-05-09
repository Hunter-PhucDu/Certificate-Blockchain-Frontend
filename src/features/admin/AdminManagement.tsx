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
  App,
  Tag,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
  Admin,
} from "@/services/AdminService";

const AdminManagement: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data: adminsData, isLoading } = useAdmins({
    page: pagination.current,
    size: pagination.pageSize,
    search: searchText,
  });

  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  const handleTableChange = (pagination: {
    current?: number;
    pageSize?: number;
  }) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
  };

  const showModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      form.setFieldsValue(admin);
    } else {
      setEditingAdmin(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: {
    username: string;
    password?: string;
    email?: string;
  }) => {
    try {
      if (editingAdmin) {
        await updateAdmin.mutateAsync({
          adminId: editingAdmin.id,
          data: {
            username: values.username,
          },
        });
        messageApi.success(t("common.admins.updateSuccess"));
      } else {
        await createAdmin.mutateAsync({
          username: values.username,
          password: values.password!,
          email: values.email || "",
        });
        messageApi.success(t("common.admins.createSuccess"));
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch {
      messageApi.error(t("common.admins.error"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmin.mutateAsync(id);
      messageApi.success(t("common.admins.deleteSuccess"));
    } catch {
      messageApi.error(t("common.admins.error"));
    }
  };

  const renderRole = (role: string) => {
    let color = "blue";
    if (role === "SUPER_ADMIN") {
      color = "gold";
    }
    return <Tag color={color}>{role}</Tag>;
  };

  const columns = [
    {
      title: t("common.admins.username"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("common.admins.email"),
      dataIndex: "email",
      key: "email",
      render: (text: string) => text || "-",
    },
    {
      title: t("common.admins.role"),
      dataIndex: "role",
      key: "role",
      render: renderRole,
    },
    {
      title: t("common.admins.actions"),
      key: "actions",
      render: (_: unknown, record: Admin) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            {t("common.admins.edit")}
          </Button>
          <Popconfirm
            title={t("common.admins.confirmDelete")}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              {t("common.admins.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title={t("common.admins.title")}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder={t("common.admins.search")}
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          {t("common.admins.create")}
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={adminsData?.data}
        rowKey="id"
        loading={isLoading}
        pagination={{
          ...pagination,
          total: adminsData?.metadata.totalItem,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={
          editingAdmin ? t("common.admins.edit") : t("common.admins.create")
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label={t("common.admins.username")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {!editingAdmin && (
            <>
              <Form.Item
                name="email"
                label={t("common.admins.email")}
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label={t("common.admins.password")}
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAdmin ? t("common.update") : t("common.create")}
              </Button>
              <Button onClick={handleCancel}>{t("common.cancel")}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminManagement;

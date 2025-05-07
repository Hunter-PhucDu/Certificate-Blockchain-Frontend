"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  Tree,
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Divider,
  Popconfirm,
  Dropdown,
  Table,
} from "antd";
import {
  FolderOutlined,
  FileOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
// import { useGroups, useCreateGroup, useDeleteGroup } from "@/services/GroupService";
// import { useCertificates, useCreateCertificate, useDeleteCertificate } from "@/services/CertificateService";
import {
  certificateTemplates,
  CertificateTemplate,
} from "@/configs/certificateTemplates";
import { App } from "antd";
import CertificatePreview from "./CertificatePreview";
import CertificateManagement from "./CertificateManagement";
import { useTranslation } from "react-i18next";
import mockData from "./mockData.json";

const { Sider, Content } = Layout;
const { Title } = Typography;

interface GroupNode {
  key: string;
  title: React.ReactNode;
  children?: GroupNode[];
  isLeaf?: boolean;
}

interface Certificate {
  id: string;
  groupId: string;
  certificateType: string;
  certificateData: Array<{
    key: string;
    values: Array<{
      label: string;
      value: string;
      type: string;
      isUnique?: boolean;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Group {
  id: string;
  name: string;
  parentId: string | null;
  certificates: Certificate[];
}

const CertificateExplorer: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);
  const [isCreateCertificateModalVisible, setIsCreateCertificateModalVisible] =
    useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [groups, setGroups] = useState(mockData.groups);
  const [certificates, setCertificates] = useState(mockData.certificates);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // const { data: groupsData } = useGroups();
  // const { data: certificatesData } = useCertificates();
  // const createGroup = useCreateGroup();
  // const deleteGroup = useDeleteGroup();
  // const createCertificate = useCreateCertificate();
  // const deleteCertificate = useDeleteCertificate();

  const buildGroupTree = (groups: any[]): GroupNode[] => {
    const groupMap = new Map();
    const tree: GroupNode[] = [];

    groups.forEach((group) => {
      groupMap.set(group.id, {
        key: group.id,
        title: group.groupName,
        children: [],
      });
    });

    groups.forEach((group) => {
      const node = groupMap.get(group.id);
      if (group.parentId) {
        const parent = groupMap.get(group.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  const hasCertificates = (groupId: string) => {
    return certificates.some((cert) => cert.groupId === groupId);
  };

  const hasChildGroups = (groupId: string) => {
    return groups.some((group) => group.parentId === groupId);
  };

  const handleCreateGroup = async (values: any) => {
    try {
      const newGroup = {
        id: String(groups.length + 1),
        groupName: values.groupName,
        parentId: selectedGroup || null,
        path: selectedGroup
          ? `/${selectedGroup}/${groups.length + 1}`
          : `/${groups.length + 1}`,
        level: selectedGroup ? 2 : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGroups([...groups, newGroup]);
      messageApi.success(t("common.success"));
      setIsCreateGroupModalVisible(false);
      form.resetFields();
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

  const handleEditGroup = async (values: any) => {
    try {
      setGroups(
        groups.map((group) =>
          group.id === editingGroup.id
            ? {
                ...group,
                groupName: values.groupName,
                updatedAt: new Date().toISOString(),
              }
            : group,
        ),
      );
      messageApi.success(t("common.success"));
      setIsEditGroupModalVisible(false);
      form.resetFields();
      setEditingGroup(null);
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

  const handleCreateCertificate = async (values: any) => {
    if (!selectedGroup || !selectedTemplate) return;

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

    try {
      const newCertificate = {
        id: String(certificates.length + 1),
        groupId: selectedGroup,
        certificateType: template.id,
        certificateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCertificates([...certificates, newCertificate]);
      messageApi.success(t("common.success"));
      setIsCreateCertificateModalVisible(false);
      form.resetFields();
      setSelectedTemplate(null);
      setPreviewData({});
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      setGroups(groups.filter((group) => group.id !== groupId));
      messageApi.success(t("common.success"));
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    try {
      setCertificates(certificates.filter((cert) => cert.id !== certificateId));
      messageApi.success(t("common.success"));
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

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

  const getGroupMenuItems = (node: GroupNode): MenuProps["items"] => {
    const group = groups.find((g) => g.id === node.key);
    if (!group) return [];

    const items: MenuProps["items"] = [];

    if (!hasCertificates(node.key)) {
      items.push({
        key: "add",
        label: t("common.certificates.addSubGroup"),
        icon: <PlusOutlined />,
        onClick: () => {
          setSelectedGroup(node.key);
          setIsCreateGroupModalVisible(true);
        },
      });
    }

    items.push({
      key: "edit",
      label: t("common.edit"),
      icon: <EditOutlined />,
      onClick: () => {
        setEditingGroup(group);
        form.setFieldsValue({ groupName: group.groupName });
        setIsEditGroupModalVisible(true);
      },
    });

    if (!hasChildGroups(node.key) && !hasCertificates(node.key)) {
      items.push({
        key: "delete",
        label: t("common.delete"),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDeleteGroup(node.key),
      });
    }

    return items;
  };

  const renderTreeNodes = (nodes: GroupNode[]): GroupNode[] => {
    return nodes.map((node) => ({
      ...node,
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span>{node.title}</span>
          <Dropdown
            menu={{ items: getGroupMenuItems(node) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              style={{ opacity: 0 }}
              className="group-action-button"
            />
          </Dropdown>
        </div>
      ),
      children: node.children ? renderTreeNodes(node.children) : undefined,
    }));
  };

  const getChildGroups = (groupId: string) => {
    return groups.filter((group) => group.parentId === groupId);
  };

  const handleGroupSelect = (selectedKeys: React.Key[]) => {
    setSelectedGroup(selectedKeys[0] as string);
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.certificateType
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesGroup = selectedGroup ? cert.groupId === selectedGroup : true;
    return matchesSearch && matchesGroup;
  });

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={300} style={{ padding: "8px" }}>
        <Tree
          treeData={renderTreeNodes(buildGroupTree(groups))}
          onSelect={handleGroupSelect}
          defaultExpandAll
        />
      </Sider>
      <Divider type="vertical" style={{ height: "100vh", margin: 0 }} />
      <Content style={{ padding: "16px" }}>
        {selectedGroup && (
          <>
            {hasChildGroups(selectedGroup) ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {getChildGroups(selectedGroup).map((group) => (
                    <Card
                      key={group.id}
                      hoverable
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <Space>
                        <FolderOutlined />
                        <span>{group.groupName}</span>
                      </Space>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <CertificateManagement
                groupId={selectedGroup}
                certificates={certificates.filter(
                  (cert) => cert.groupId === selectedGroup,
                )}
                onCertificatesChange={setCertificates}
              />
            )}
          </>
        )}
      </Content>

      <Modal
        title={t("common.createGroup")}
        open={isCreateGroupModalVisible}
        onCancel={() => setIsCreateGroupModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateGroup}>
          <Form.Item
            name="groupName"
            label={t("common.groupName")}
            rules={[{ required: true, message: t("common.required") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("common.create")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("common.editGroup")}
        open={isEditGroupModalVisible}
        onCancel={() => {
          setIsEditGroupModalVisible(false);
          setEditingGroup(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleEditGroup}>
          <Form.Item
            name="groupName"
            label={t("common.groupName")}
            rules={[{ required: true, message: t("common.required") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("common.update")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t("common.createCertificate")}
        open={isCreateCertificateModalVisible}
        onCancel={() => {
          setIsCreateCertificateModalVisible(false);
          setSelectedTemplate(null);
          setPreviewData({});
        }}
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

              {selectedTemplate &&
                certificateTemplates
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
                      {field.type === "select" ? (
                        <Select>
                          {field.options?.map((option) => (
                            <Select.Option key={option} value={option}>
                              {option}
                            </Select.Option>
                          ))}
                        </Select>
                      ) : field.type === "date" ? (
                        <Input type="date" />
                      ) : (
                        <Input type={field.type} />
                      )}
                    </Form.Item>
                  ))}

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {t("common.create")}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Title level={4}>{t("common.preview")}</Title>
            <CertificatePreview
              template={certificateTemplates.find(
                (t) => t.id === selectedTemplate,
              )}
              data={previewData}
            />
          </div>
        </div>
      </Modal>

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

      <style jsx global>{`
        .ant-tree-node-content-wrapper:hover .group-action-button {
          opacity: 1 !important;
        }
      `}</style>
    </Layout>
  );
};

export default CertificateExplorer;

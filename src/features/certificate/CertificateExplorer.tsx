/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
  Dropdown,
  Spin,
  Empty,
} from "antd";
import {
  FolderOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  useGroups,
  useCreateGroup,
  useDeleteGroup,
  useUpdateGroup,
} from "@/services/GroupService";
import {
  CertificateValueType,
  useCertificates,
  useCreateCertificate,
  useDeleteCertificate,
  Certificate,
  CertificateData,
} from "@/services/CertificateService";
import {
  certificateTemplates,
  CertificateTemplate,
} from "@/features/certificate/certificateTemplates";
import { App } from "antd";
import CertificatePreview from "./CertificatePreview";
import CertificateManagement from "./CertificateManagement";
import { useTranslation } from "react-i18next";

const { Sider, Content } = Layout;
const { Title } = Typography;

interface GroupNode {
  key: string;
  title: React.ReactNode;
  children?: GroupNode[];
  isLeaf?: boolean;
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
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { data: groupsData, isLoading: isGroupsLoading } = useGroups();
  const { data: certificatesData, refetch: refetchCertificates } =
    useCertificates();
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();
  const createCertificate = useCreateCertificate();
  const deleteCertificate = useDeleteCertificate();

  const buildGroupTree = (groups: any[]): GroupNode[] => {
    const groupMap = new Map();
    const tree: GroupNode[] = [];

    groups?.forEach((group) => {
      groupMap.set(group.id, {
        key: group.id,
        title: group.groupName,
        children: [],
      });
    });

    groups?.forEach((group) => {
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
    return certificatesData?.data.some(
      (cert: Certificate) => cert.groupId === groupId,
    );
  };

  const hasChildGroups = (groupId: string) => {
    return groupsData?.data.some((group: any) => group.parentId === groupId);
  };

  const handleCreateGroup = async (values: any) => {
    try {
      await createGroup.mutateAsync({
        groupName: values.groupName,
        parentId: selectedGroup || undefined,
      });
      messageApi.success(t("common.success"));
      setIsCreateGroupModalVisible(false);
      form.resetFields();
    } catch {
      messageApi.error(t("common.error"));
    }
  };

  const handleEditGroup = async (values: any) => {
    if (!editingGroup) return;
    try {
      await updateGroup.mutateAsync({
        id: editingGroup.id,
        data: {
          groupName: values.groupName,
        },
      });
      messageApi.success(t("common.success"));
      setIsEditGroupModalVisible(false);
      form.resetFields();
      setEditingGroup(null);
    } catch {
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
      await createCertificate.mutateAsync({
        groupId: selectedGroup,
        certificateType: template.id,
        certificateData,
      });
      messageApi.success(t("common.success"));
      setIsCreateCertificateModalVisible(false);
      form.resetFields();
      setSelectedTemplate(null);
      setPreviewData({});
      refetchCertificates();
    } catch {
      messageApi.error(t("common.error"));
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup.mutateAsync(groupId);
      messageApi.success(t("common.success"));
    } catch (error) {
      messageApi.error(t("common.error"));
    }
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    try {
      await deleteCertificate.mutateAsync(certificateId);
      messageApi.success(t("common.success"));
      refetchCertificates();
    } catch {
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
    const group = groupsData?.data.find((g: any) => g.id === node.key);
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
    return (
      groupsData?.data.filter((group: any) => group.parentId === groupId) || []
    );
  };

  const handleGroupSelect = (selectedKeys: React.Key[]) => {
    setSelectedGroup(selectedKeys[0] as string);
  };

  const filteredCertificates =
    certificatesData?.data.filter((cert: Certificate) => {
      const matchesSearch = cert.certificateType
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesGroup = selectedGroup
        ? cert.groupId === selectedGroup
        : true;
      return matchesSearch && matchesGroup;
    }) || [];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={300} style={{ padding: "8px" }}>
        {isGroupsLoading ? (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Spin />
          </div>
        ) : !groupsData?.data || groupsData.data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("common.noGroups")}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateGroupModalVisible(true)}
              style={{ marginTop: "16px" }}
            >
              {t("common.createFirstGroup")}
            </Button>
          </div>
        ) : (
          <Tree
            treeData={renderTreeNodes(buildGroupTree(groupsData.data))}
            onSelect={handleGroupSelect}
            defaultExpandAll
          />
        )}
      </Sider>
      <Divider type="vertical" style={{ height: "100vh", margin: 0 }} />
      <Content style={{ padding: "16px" }}>
        {!selectedGroup && groupsData?.data && groupsData.data.length > 0 && (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("common.selectGroup")}
            />
          </div>
        )}
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
                  {getChildGroups(selectedGroup).map((group: any) => (
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
                certificates={filteredCertificates}
                onCertificatesChange={() => refetchCertificates()}
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
            <Button
              type="primary"
              htmlType="submit"
              loading={createGroup.isPending}
            >
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
            <Button
              type="primary"
              htmlType="submit"
              loading={updateGroup.isPending}
            >
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
                      {field.type === "Boolean" ? (
                        <Select>
                          <Select.Option value="true">Có</Select.Option>
                          <Select.Option value="false">Không</Select.Option>
                        </Select>
                      ) : field.type === "Date" ? (
                        <Input type="Date" />
                      ) : field.type === "Number" ? (
                        <Input type="number" />
                      ) : (
                        <Input type={field.type} />
                      )}
                    </Form.Item>
                  ))}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createCertificate.isPending}
                >
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

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  useAllCertificates,
  useCreateCertificate,
  Certificate,
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
  const [groupForm] = Form.useForm();
  const [certificateForm] = Form.useForm();
  const [previewData, setPreviewData] = useState<Record<string, any>>({});
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [searchText] = useState("");
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [rootGroups, setRootGroups] = useState<any[]>([]);

  // Thêm state mới
  const [isDeleteGroupModalVisible, setIsDeleteGroupModalVisible] =
    useState(false);
  const [groupToDelete, setGroupToDelete] = useState<any>(null);
  const [confirmGroupName, setConfirmGroupName] = useState("");

  const { data: groupsData, isLoading: isGroupsLoading } = useGroups();
  const { data: certificatesData, refetch: refetchCertificates } =
    useAllCertificates();
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const deleteGroup = useDeleteGroup();
  const createCertificate = useCreateCertificate();

  // Cập nhật rootGroups khi groupsData thay đổi
  useEffect(() => {
    if (groupsData?.data) {
      const roots = groupsData.data.filter((group) => !group.parentId);
      setRootGroups(roots);
    }
  }, [groupsData]);

  // Hiển thị root groups khi không có group nào được chọn
  useEffect(() => {
    if (!selectedGroup && rootGroups.length > 0) {
      // Không tự động chọn nhóm nào cả
    }
  }, [selectedGroup, rootGroups]);

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

  const checkDuplicateGroupName = (
    groupName: string,
    parentId: string | null,
    excludeGroupId?: string,
  ) => {
    if (!groupsData?.data) return false;

    return groupsData.data.some(
      (group) =>
        group.groupName.toLowerCase() === groupName.toLowerCase() &&
        group.parentId === parentId &&
        group.id !== excludeGroupId,
    );
  };

  const handleCreateGroup = async (values: any) => {
    try {
      if (checkDuplicateGroupName(values.groupName, currentParentId)) {
        messageApi.error(t("common.duplicateGroupName"));
        return;
      }

      await createGroup.mutateAsync({
        groupName: values.groupName,
        parentId: currentParentId || undefined,
      });
      messageApi.success(t("common.success"));
      setIsCreateGroupModalVisible(false);
      groupForm.resetFields();
    } catch {
      messageApi.error(t("common.error"));
    }
  };

  const handleEditGroup = async (values: any) => {
    if (!editingGroup) return;
    try {
      if (
        checkDuplicateGroupName(
          values.groupName,
          editingGroup.parentId,
          editingGroup.id,
        )
      ) {
        messageApi.error(t("common.duplicateGroupName"));
        return;
      }

      await updateGroup.mutateAsync({
        id: editingGroup.id,
        data: {
          groupName: values.groupName,
        },
      });
      messageApi.success(t("common.success"));
      setIsEditGroupModalVisible(false);
      groupForm.resetFields();
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
      certificateForm.resetFields();
      setSelectedTemplate(null);
      setPreviewData({});
      refetchCertificates();
    } catch {
      messageApi.error(t("common.error"));
    }
  };

  const showCreateSubGroup = (parentId: string) => {
    setCurrentParentId(parentId);
    setIsCreateGroupModalVisible(true);
    groupForm.resetFields();
  };

  const showCreateRootGroup = () => {
    setCurrentParentId(null);
    setIsCreateGroupModalVisible(true);
    groupForm.resetFields();
  };

  const showDeleteConfirm = (group: any) => {
    setGroupToDelete(group);
    setIsDeleteGroupModalVisible(true);
    setConfirmGroupName("");
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete || confirmGroupName !== groupToDelete.groupName) return;

    try {
      await deleteGroup.mutateAsync(groupToDelete.id);
      messageApi.success(t("common.success"));
      setIsDeleteGroupModalVisible(false);
      setGroupToDelete(null);
      setConfirmGroupName("");
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
      certificateForm.setFieldsValue(initialValues);
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
          showCreateSubGroup(group.id);
        },
      });
    }

    items.push({
      key: "edit",
      label: t("common.edit"),
      icon: <EditOutlined />,
      onClick: () => {
        setEditingGroup(group);
        groupForm.setFieldsValue({ groupName: group.groupName });
        setIsEditGroupModalVisible(true);
      },
    });

    if (!hasChildGroups(node.key)) {
      items.push({
        key: "delete",
        label: t("common.delete"),
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => showDeleteConfirm(group),
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
      <Sider width={220} style={{ padding: "0px" }}>
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
              onClick={showCreateRootGroup}
              style={{ marginTop: "16px" }}
            >
              {t("common.createFirstGroup")}
            </Button>
          </div>
        ) : (
          <>
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateRootGroup}
              >
                {t("common.createRootGroup")}
              </Button>
            </div>
            <Divider style={{ margin: "0 0 10px 0" }} />
            <Tree
              treeData={renderTreeNodes(buildGroupTree(groupsData.data))}
              onSelect={handleGroupSelect}
              defaultExpandAll
            />
          </>
        )}
      </Sider>
      <Divider type="vertical" style={{ height: "100vh", margin: 0 }} />
      <Content style={{ padding: "16px" }}>
        {!selectedGroup && rootGroups.length > 0 && (
          <div>
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={4}>{t("common.rootGroups")}</Title>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
              }}
            >
              {rootGroups.map((group) => (
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
                form={certificateForm}
              />
            )}
          </>
        )}
      </Content>

      <Modal
        title={
          currentParentId
            ? t("common.createSubGroup")
            : t("common.createRootGroup")
        }
        open={isCreateGroupModalVisible}
        onCancel={() => {
          setIsCreateGroupModalVisible(false);
          setCurrentParentId(null);
        }}
        footer={null}
      >
        <Form form={groupForm} onFinish={handleCreateGroup}>
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
        <Form form={groupForm} onFinish={handleEditGroup}>
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
              form={certificateForm}
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

      <Modal
        title={
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#24292f",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <DeleteOutlined style={{ color: "#cf222e", fontSize: "18px" }} />
            {t("common.deleteGroup")}:{" "}
            <span style={{ color: "#cf222e" }}>{groupToDelete?.groupName}</span>
          </span>
        }
        open={isDeleteGroupModalVisible}
        onCancel={() => {
          setIsDeleteGroupModalVisible(false);
          setGroupToDelete(null);
          setConfirmGroupName("");
        }}
        width={520}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsDeleteGroupModalVisible(false);
              setGroupToDelete(null);
              setConfirmGroupName("");
            }}
            style={{
              fontWeight: 500,
              border: "1px solid rgba(31, 35, 40, 0.15)",
              boxShadow: "0 1px 0 rgba(31, 35, 40, 0.04)",
            }}
          >
            {t("common.cancel")}
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDeleteGroup}
            disabled={confirmGroupName !== (groupToDelete?.groupName || "")}
            style={{
              backgroundColor:
                confirmGroupName === (groupToDelete?.groupName || "")
                  ? "#cf222e"
                  : "#EB5757",
              opacity:
                confirmGroupName !== (groupToDelete?.groupName || "") ? 0.5 : 1,
              fontWeight: 500,
              boxShadow:
                confirmGroupName === (groupToDelete?.groupName || "")
                  ? "0 1px 0 rgba(31, 35, 40, 0.1)"
                  : "none",
            }}
          >
            {t("common.delete")} {t("common.thisGroup")}
          </Button>,
        ]}
        styles={{
          header: { borderBottom: "1px solid #d0d7de", padding: "16px 24px" },
          footer: { borderTop: "1px solid #d0d7de", padding: "16px 24px" },
          body: {
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          },
        }}
      >
        <div>
          <Typography.Paragraph
            style={{
              fontSize: "14px",
              marginBottom: "16px",
              color: "#24292f",
              lineHeight: "1.5",
            }}
          >
            {t("common.deleteGroupConfirmation")}{" "}
            <strong>{groupToDelete?.groupName}</strong>{" "}
            {t("common.deleteGroupAction")}
          </Typography.Paragraph>

          <div
            style={{
              backgroundColor: "#FFEBE9",
              border: "1px solid #FFCCD1",
              borderRadius: "6px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <Typography.Paragraph
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#24292f",
                lineHeight: "1.5",
              }}
            >
              <strong style={{ color: "#cf222e" }}>
                {t("common.warning")}:
              </strong>{" "}
              {t("common.deleteGroupWarning")}
            </Typography.Paragraph>
            {groupToDelete && hasCertificates(groupToDelete.id) && (
              <Typography.Paragraph
                style={{
                  marginTop: "8px",
                  fontSize: "14px",
                  color: "#cf222e",
                  lineHeight: "1.5",
                  fontWeight: 500,
                }}
              >
                {t("common.deleteCertificatesWarning")}
              </Typography.Paragraph>
            )}
          </div>

          <div style={{ marginBottom: "10px" }}>
            <Typography.Text
              strong
              style={{ fontSize: "14px", color: "#24292f", display: "block" }}
            >
              {t("common.pleaseType")}{" "}
              <span style={{ fontWeight: 600 }}>
                &ldquo;{groupToDelete?.groupName}&rdquo;
              </span>{" "}
              {t("common.toConfirm")}
            </Typography.Text>
          </div>

          <Input
            value={confirmGroupName}
            onChange={(e) => setConfirmGroupName(e.target.value)}
            placeholder={groupToDelete?.groupName}
            style={{
              width: "100%",
              padding: "5px 12px",
              fontSize: "14px",
              border:
                confirmGroupName === groupToDelete?.groupName
                  ? "1px solid #2da44e"
                  : confirmGroupName &&
                      confirmGroupName !== groupToDelete?.groupName
                    ? "1px solid #cf222e"
                    : "1px solid #d0d7de",
              borderRadius: "6px",
              boxShadow: "inset 0 1px 0 rgba(208, 215, 222, 0.2)",
              background:
                confirmGroupName === groupToDelete?.groupName
                  ? "rgba(45, 164, 78, 0.05)"
                  : confirmGroupName &&
                      confirmGroupName !== groupToDelete?.groupName
                    ? "rgba(207, 34, 46, 0.05)"
                    : "white",
            }}
            status={
              confirmGroupName && confirmGroupName !== groupToDelete?.groupName
                ? "error"
                : ""
            }
          />
          {confirmGroupName &&
            confirmGroupName !== groupToDelete?.groupName && (
              <Typography.Text
                type="danger"
                style={{ fontSize: "12px", marginTop: "4px", display: "block" }}
              >
                {t("common.nameDoesNotMatch")}
              </Typography.Text>
            )}
        </div>
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

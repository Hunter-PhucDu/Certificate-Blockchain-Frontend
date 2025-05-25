"use client";

import React, { useState } from "react";
import {
  Table,
  Input,
  Space,
  Typography,
  Card,
  Tag,
  Button,
  message,
} from "antd";
import { useTranslation } from "react-i18next";
import { useSystemLogs, useAllLogs } from "@/services/LogService";
import { format } from "date-fns";
import { DownloadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const LogManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [isExporting, setIsExporting] = useState(false);

  const { data: logsData, isLoading } = useSystemLogs({
    page: currentPage,
    size: pageSize,
    search: searchText,
  });

  const { refetch: refetchAllLogs } = useAllLogs();

  const formatPayload = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" | ");
    } catch {
      return text;
    }
  };

  const exportToCSV = async () => {
    try {
      setIsExporting(true);
      message.loading({ content: t("logs.exporting"), key: "export" });

      const { data: exportData } = await refetchAllLogs();
      if (!exportData) {
        throw new Error("No data to export");
      }

      const headers = [
        t("logs.username"),
        t("logs.action"),
        t("logs.payload"),
        t("logs.role"),
        t("logs.timestamp"),
      ];

      const csvData = exportData.map((log) => [
        log.username,
        log.action.replace(/_/g, " ").toLowerCase(),
        JSON.stringify(log.payload).replace(/"/g, '""'),
        log.role.replace(/_/g, " "),
        format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss"),
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
      const blob = new Blob([BOM, csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `system_logs_${format(new Date(), "yyyy-MM-dd_HH-mm-ss")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success({ content: t("logs.exportSuccess"), key: "export" });
    } catch (error) {
      message.error({ content: t("logs.exportError"), key: "export" });
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      title: t("logs.username"),
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: t("logs.action"),
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (text: string) => (
        <Tag color="blue" style={{ textTransform: "capitalize" }}>
          {text.replace(/_/g, " ").toLowerCase()}
        </Tag>
      ),
    },
    {
      title: t("logs.payload"),
      dataIndex: "payload",
      key: "payload",
      render: (text: string) => {
        const formattedText = formatPayload(text);
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              tooltip: {
                title: formattedText,
                placement: "topLeft",
                overlayStyle: { maxWidth: "800px", minWidth: "300px" },
                overlayInnerStyle: { padding: "10px", fontSize: "14px" },
              },
            }}
            style={{ marginBottom: 0 }}
          >
            {formattedText}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: t("logs.role"),
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (text: string) => (
        <Tag
          color={
            text === "SUPER_ADMIN" ? "red" : text === "ADMIN" ? "blue" : "green"
          }
        >
          {text.replace(/_/g, " ")}
        </Tag>
      ),
    },
    {
      title: t("logs.timestamp"),
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (text: string) => format(new Date(text), "dd/MM/yyyy HH:mm:ss"),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>{t("logs.title")}</Title>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportToCSV}
            loading={isExporting}
            disabled={isExporting}
          >
            {t("logs.exportCSV")}
          </Button>
        </div>

        <Search
          placeholder={t("logs.search")}
          allowClear
          enterButton
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 400 }}
        />

        <Table
          columns={columns}
          dataSource={logsData?.data}
          rowKey="timestamp"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: logsData?.metadata?.totalItem,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          locale={{ emptyText: t("logs.noData") }}
          scroll={{ x: 1200 }}
        />
      </Space>
    </Card>
  );
};

export default LogManagement;

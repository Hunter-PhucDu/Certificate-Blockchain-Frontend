import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { baseColors } from "@/config/constants/theme";

interface UserInfoProps {
  collapsed?: boolean;
}

const UserInfo = ({ collapsed }: UserInfoProps) => {
  return (
    <Space
      align="center"
      size={collapsed ? 0 : 8}
      style={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Avatar
        style={{
          backgroundColor: baseColors.primary.main,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        icon={<UserOutlined />}
        size={collapsed ? "small" : "default"}
      />
    </Space>
  );
};

export default UserInfo;

import { useAuthStore } from "@/stores/authStore";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { baseColors } from "@/config/constants/theme";

interface UserInfoProps {
  collapsed?: boolean;
}

const UserInfo = ({ collapsed }: UserInfoProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Space align="center" size={collapsed ? 0 : 8}>
      <Avatar
        style={{
          backgroundColor: baseColors.primary.main,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        icon={<UserOutlined />}
        size={collapsed ? "small" : "default"}
      />

      {!collapsed && user && (
        <div
          className="text-sm"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <strong>{user.name}</strong>
        </div>
      )}
    </Space>
  );
};

export default UserInfo;

import { useAuthStore } from "@/stores/authStore";

const UserInfo = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {user ? (
        <div className="text-sm">
          <strong>{user.name}</strong> ({user.email})
        </div>
      ) : (
        <div className="text-sm">Not logged in</div>
      )}
    </>
  );
};

export default UserInfo;

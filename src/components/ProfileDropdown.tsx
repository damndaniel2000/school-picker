import { Avatar, Popover } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/user.svg";

const ProfileDropdown = ({
  openProfileSection = () => {},
}: {
  openProfileSection: () => void;
}) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="cursor-pointer">
          <Avatar
            className="bg-red"
            src={userIcon}
            fallback="A"
            variant="solid"
            size="1"
            radius="full"
            highContrast
          />
        </div>
      </Popover.Trigger>
      <Popover.Content
        className="px-0 py-0 rounded-sm"
        asChild
        minWidth="100px"
      >
        <div className="text-sm !text-left cursor-pointer rounded-none">
          <Popover.Close>
            <div
              onClick={openProfileSection}
              className="px-6 py-2 text-left hover:bg-gray-100"
            >
              Profile
            </div>
          </Popover.Close>
          <div
            onClick={logout}
            className="px-6 py-2 text-red-500 hover:bg-red-100"
          >
            Logout
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

export default ProfileDropdown;

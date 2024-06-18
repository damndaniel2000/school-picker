import React, { useState, useEffect, useRef } from "react";
import { deleteUser, getUserDetails, updateUserDetails } from "../utils/api";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import DeleteConfirmAlert from "./DeleteConfirmAlert";
import { EditDetails } from "../utils/types";
import { toast } from "react-toastify";

interface UserDetails {
  username?: string;
  email?: string;
  full_name?: string;
  address?: string;
}

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [editedDetails, setEditedDetails] = useState<EditDetails>();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [isUpdateUsersOpen, setIsUpdateUsersOpen] = useState(false);
  const [userUpdateLoading, setUserUpdateLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const res = await getUserDetails();
      setUserDetails(res.data);
      setEditedDetails(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteAction = async () => {
    try {
      await deleteUser();
      localStorage.clear();
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };

  const updateDetailsAction = async () => {
    if (!editedDetails) return;
    setUserUpdateLoading(true);
    try {
      await updateUserDetails({
        ...editedDetails,
        username: userDetails?.username,
        email: userDetails?.email,
        favourite_facility: "",
        house_number: "",
        plz: "",
        ort: "",
      });
      toast.success("User Details Updated");
      setUserDetails({
        ...userDetails,
        address: editedDetails.address,
        full_name: editedDetails.full_name,
      });
      setIsUpdateUsersOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setUserUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        ref={drawerRef}
        className={`fixed top-0 h-full right-0 z-50 transition-transform transform pt-12 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } bg-white shadow-lg p-4 w-full md:w-1/3`}
      >
        <button
          onClick={onClose}
          className="absolute text-2xl top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 block w-full">{userDetails?.username}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1 block w-full">{userDetails?.full_name}</div>
          </div>

          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Home Address
              </label>
              <div className="mt-1 block w-full">
                {userDetails?.address ? userDetails?.address : "Lokmilan"}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute space-x-4 bottom-4 left-4">
          <Dialog.Root open={isUpdateUsersOpen}>
            <Dialog.Trigger onClick={() => setIsUpdateUsersOpen(true)}>
              <Button>Update Details</Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description
                size="2"
                mb="4"
              >
                Make changes to your profile.
              </Dialog.Description>

              <Flex
                direction="column"
                gap="3"
              >
                <label>
                  <Text
                    as="div"
                    size="2"
                    mb="1"
                    weight="bold"
                  >
                    Name
                  </Text>
                  <TextField.Root
                    value={editedDetails?.full_name}
                    placeholder="Enter your full name"
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        full_name: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  <Text
                    as="div"
                    size="2"
                    mb="1"
                    weight="bold"
                  >
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    placeholder="Set New Password"
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        password: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  <Text
                    as="div"
                    size="2"
                    mb="1"
                    weight="bold"
                  >
                    Address
                  </Text>
                  <TextField.Root
                    value={editedDetails?.address || ""}
                    placeholder="Address"
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        address: e.target.value,
                      })
                    }
                  />
                  {/* <AutocompleteComponent
                    value={editedDetails?.address || ""}
                    onPlaceSelect={(e) => {
                      setEditedDetails({
                        ...editedDetails,
                        address: e?.formatted_address,
                      });
                    }}
                  /> */}
                </label>
              </Flex>

              <Flex
                gap="3"
                mt="4"
                justify="end"
              >
                <Dialog.Close onClick={() => setIsUpdateUsersOpen(false)}>
                  <Button
                    variant="soft"
                    color="gray"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  loading={userUpdateLoading}
                  onClick={updateDetailsAction}
                >
                  Save
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>

          <DeleteConfirmAlert deleteAction={deleteAction} />
        </div>
      </div>
    </>
  );
};

export default SideDrawer;

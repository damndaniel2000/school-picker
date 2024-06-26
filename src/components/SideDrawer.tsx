import React, { useState, useEffect, useRef } from "react";
import { deleteUser, getUserDetails, updateUserDetails } from "../utils/api";
import { Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import DeleteConfirmAlert from "./DeleteConfirmAlert";
import { UserDetails } from "../utils/types";
import { toast } from "react-toastify";
import PlaceAutocompleteClassic from "./Autocomplete";
import { getLatLng } from "../utils/common";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  getHomeAddressBounds: (bounds: { lat: number; lng: number }) => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  getHomeAddressBounds,
}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [editedDetails, setEditedDetails] = useState<UserDetails>();
  const drawerRef = useRef<HTMLDivElement>(null);

  const [isUpdateUsersOpen, setIsUpdateUsersOpen] = useState(false);
  const [userUpdateLoading, setUserUpdateLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const res = await getUserDetails();
      setUserDetails(res.data);
      setEditedDetails(res.data);
      getLatLng(res.data.address)
        .then((res) => {
          if (res) getHomeAddressBounds(res);
        })
        .catch((err) => console.log(err));
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
      });
      toast.success("User Details Updated");
      setUserDetails({
        ...userDetails,
        address: editedDetails.address,
        full_name: editedDetails.full_name,
      });
      if (editedDetails.address)
        getLatLng(editedDetails?.address)
          .then((res) => {
            if (res) getHomeAddressBounds(res);
          })
          .catch((err) => console.log(err));
      setIsUpdateUsersOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.response.data.detail) toast.error(e?.response?.data?.detail);
      else toast.error("Something went wrong");
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
        } bg-white shadow-lg p-4 w-full md:w-[450px]`}
      >
        <button
          onClick={onClose}
          className="absolute text-2xl top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {!isUpdateUsersOpen ? (
          <>
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
                <div className="mt-1 block w-full">
                  {userDetails?.full_name}
                </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House Number
                </label>
                <div className="mt-1 block w-full">
                  {userDetails?.house_number}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <div className="mt-1 block w-full">{userDetails?.plz}</div>
              </div>
            </div>
            <div className="absolute space-x-4 bottom-4 left-4">
              <Button onClick={() => setIsUpdateUsersOpen(true)}>
                Update Details
              </Button>

              <DeleteConfirmAlert deleteAction={deleteAction} />
            </div>
          </>
        ) : (
          <>
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
                  size="3"
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
                  Address
                </Text>

                <PlaceAutocompleteClassic
                  value={editedDetails?.address || ""}
                  onPlaceSelect={(e) => {
                    setEditedDetails({
                      ...editedDetails,
                      address: e?.formatted_address,
                    });
                  }}
                />
              </label>
              <div className="flex space-x-4">
                <label>
                  <Text
                    as="div"
                    size="2"
                    mb="1"
                    weight="bold"
                  >
                    House Number
                  </Text>
                  <TextField.Root
                    size="3"
                    placeholder="House Number"
                    value={editedDetails?.house_number}
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        house_number: e.target.value,
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
                    Zip Code
                  </Text>

                  <TextField.Root
                    size="3"
                    placeholder="Set Zip Code"
                    value={editedDetails?.plz}
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        plz: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
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
                  size="3"
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
            </Flex>
            <div className="absolute space-x-4 bottom-4 left-4">
              <Flex
                gap="3"
                mt="4"
                justify="end"
              >
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => setIsUpdateUsersOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={userUpdateLoading}
                  onClick={updateDetailsAction}
                >
                  Save
                </Button>
              </Flex>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SideDrawer;

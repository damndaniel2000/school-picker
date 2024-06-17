import React, { useState, useEffect, useRef } from "react";
import { deleteUser, getUserDetails } from "../utils/api";
import { Button } from "@radix-ui/themes";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useNavigate } from "react-router-dom";

interface UserDetails {
  username: string;
  email: string;
  full_name: string;
  password: string;
  address?: string;
}

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const drawerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const res = await getUserDetails();
      setUserDetails(res.data);
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
          <Button>Update Details</Button>
          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <Button color="red">Delete account</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
              <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                  Are you absolutely sure?
                </AlertDialog.Title>
                <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialog.Description>
                <div className="flex justify-end gap-[25px]">
                  <AlertDialog.Cancel asChild>
                    <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      onClick={deleteAction}
                      className="text-white bg-red-500 hover:bg-red-600  inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                    >
                      Yes, delete account
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;

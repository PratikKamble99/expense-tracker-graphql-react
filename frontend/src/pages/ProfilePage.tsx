import { Button } from "@/components/ui/button";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useQuery } from "@apollo/client";
import { Image, User, Lock } from "lucide-react";
import React, { useState } from "react";

import EditProfileForm from "@/components/custom/EditProfileForm";
import EditProfileImage from "@/components/custom/EditProfileImage";
import { formatDate } from "@/lib/utils";
import ChangePasswordForm from "@/components/custom/ChangePasswordForm";
import DeleteAccountModal from "@/components/custom/DeleteAccountModal";

const ProfilePage = () => {
  const { data: authUserData } = useQuery(GET_AUTH_USER);
  const [changePassword, setChangePassword] = useState(false);
  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);

  return (
    <div className="p-6 bg-[#1b1b1b] min-h-screen">
      {/* Profile Container */}
      <div className="bg-[#28282a] rounded-xl shadow-lg p-8 text-[#868686]">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="mt-1">
              Last edit on{" "}
              <span className="font-bold text-text-primary">
                {formatDate(authUserData?.authenticatedUser.updatedAt)}
              </span>
            </p>
          </div>
          <Button
            className="bg-text-primary text-white hover:bg-[#03b6a4]"
            onClick={() => setChangePassword(true)}
          >
            <Lock className="mr-2" />
            Change Password
          </Button>
        </div>

        {/* Profile Sections */}
        <div className="space-y-8">
          {/* Profile Picture Section */}
          <SectionHeading
            icon={<Image className="text-text-primary" />}
            label="Profile Picture"
          />
          <div className="bg-[#1b1b1b] p-4 rounded-md">
            <EditProfileImage authUserData={authUserData} />
          </div>

          {/* Personal Information Section */}
          <SectionHeading
            icon={<User className="text-text-primary" />}
            label="Personal Information"
          />
          <div className="bg-[#1b1b1b] p-4 rounded-md">
            <EditProfileForm />
          </div>
          <div className="rounded-lg border border-[#6e101c]">
            <div className="rounded-t-lg bg-[#1b1b1b] p-[24px]">
              <SectionHeading
                icon={<User className="text-text-primary" />}
                label="Settings"
              />
              <p>
                The Account will be permanently deleted, including your data.
                This action is irreversible and can not be undone.
              </p>
            </div>
            <div className="bg-[#440d13] p-2  flex justify-end">
              <Button
                className="bg-[#e1162a] text-white hover:bg-danger] focus:ring-2 focus:ring-offset-2 focus:ring-danger transition-all duration-300"
                onClick={() => setOpenDeleteAccountModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {changePassword && (
        <ChangePasswordForm
          isOpen={changePassword}
          setOpen={setChangePassword}
        />
      )}
      {openDeleteAccountModal && (
        <DeleteAccountModal
          open={openDeleteAccountModal}
          setOpen={setOpenDeleteAccountModal}
        />
      )}
    </div>
  );
};

export default ProfilePage;

const SectionHeading = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="flex gap-3 items-center mb-4">
      {icon}
      <h2 className="text-2xl font-bold text-white">{label}</h2>
    </div>
  );
};

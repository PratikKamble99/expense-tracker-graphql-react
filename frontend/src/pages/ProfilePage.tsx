import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useQuery } from "@apollo/client";
import { Image, User, Lock } from "lucide-react";
import React, { useState } from "react";

import EditProfileForm from "@/components/custom/EditProfileForm";
import EditProfileImage from "@/components/custom/EditProfileImage";
import { formatDate } from "@/lib/utils";
import ChangePasswordForm from "@/components/custom/ChangePasswordForm";

const ProfilePage = () => {
  const { data: authUserData } = useQuery(GET_AUTH_USER);
  const [changePassword, setChangePassword] = useState(false);

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
              <span className="font-bold text-[#04c8b7]">
                {formatDate(authUserData?.authenticatedUser.updatedAt)}
              </span>
            </p>
          </div>
          <Button
            className="bg-[#04c8b7] text-white hover:bg-[#03b6a4]"
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
            icon={<Image className="text-[#04c8b7]" />}
            label="Profile Picture"
          />
          <div className="bg-[#1b1b1b] p-4 rounded-md">
            <EditProfileImage authUserData={authUserData} />
          </div>

          {/* Personal Information Section */}
          <SectionHeading
            icon={<User className="text-[#04c8b7]" />}
            label="Personal Information"
          />
          <div className="bg-[#1b1b1b] p-4 rounded-md">
            <EditProfileForm />
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

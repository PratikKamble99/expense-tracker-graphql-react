import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useQuery } from "@apollo/client";
import { Image, User } from "lucide-react";
import React, { useState } from "react";

import EditProfileForm from "@/components/custom/EditProfileForm";
import EditProfileImage from "@/components/custom/EditProfileImage";
import { formatDate } from "@/lib/utils";
import ChangePasswordForm from "@/components/custom/ChangePasswordForm";

const ProfilePage = () => {
  const { data: authUserData } = useQuery(GET_AUTH_USER);

  const [changePassword, setChangePassword] = useState(false);

  return (
    <>
      <div className="m-6 bg-[#1b1b1b] rounded-xl">
        <div className="px-8 py-4">
          <div className="flex justify-between">
            <div>
              <p className="text-3xl font-bold">Your Profile</p>
              <p className="">
                Last edit on{" "}
                <span className="font-bold">
                  {formatDate(authUserData?.authenticatedUser.updatedAt)}
                </span>
              </p>
            </div>
            <div>
              <Button
                className="border"
                onClick={() => setChangePassword(true)}
              >
                Change password
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <SectionHeading icon={<Image />} label="Profile Picture" />
            <EditProfileImage authUserData={authUserData} />
            <div>
              <SectionHeading icon={<User />} label="Personal Information" />
              <EditProfileForm />
            </div>
          </div>
        </div>
      </div>
      {changePassword && (
        <ChangePasswordForm
          isOpen={changePassword}
          setOpen={setChangePassword}
        />
      )}
    </>
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
    <div className="flex gap-2 items-center my-2">
      {icon}
      <p className="text-xl font-bold">{label}</p>
    </div>
  );
};

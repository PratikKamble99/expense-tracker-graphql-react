import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useQuery } from "@apollo/client";
import { Image, User } from "lucide-react";
import React from "react";

import EditProfileForm from "@/components/custom/EditProfileForm";
import EditProfileImage from "@/components/custom/EditProfileImage";

const ProfilePage = () => {
  return (
    <div className="m-6 bg-[#1b1b1b] rounded-xl">
      <div className="px-8 py-4">
        <div>
          <p className="text-3xl font-bold">Your Profile</p>
          <p className="">
            Last edit on <span className="font-bold">12 feb 2024</span>
          </p>
        </div>
        <div className="mt-4">
          <SectionHeading icon={<Image />} label="Profile Picture" />
          <EditProfileImage />
          <div>
            <SectionHeading icon={<User />} label="Personal Information" />
            <EditProfileForm />
          </div>
        </div>
      </div>
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
    <div className="flex gap-2 items-center my-2">
      {icon}
      <p className="text-xl font-bold">{label}</p>
    </div>
  );
};

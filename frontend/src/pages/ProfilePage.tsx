import { Button } from "@/components/ui/button";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useQuery } from "@apollo/client";
import { Image, User, Lock, Mail, Calendar } from "lucide-react";
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
  const user = authUserData?.authenticatedUser;

  return (
    <div className="p-4 md:p-6 pb-14 lg:pb-0 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-0 lg:p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account information and settings
            </p>
          </div>
          <Button
            variant="outline"
            className="border-blue-100 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => setChangePassword(true)}
          >
            <Lock className="w-4 h-4" />
            Change Password
          </Button>
        </div>

        {/* Profile Section */}
        <div className="space-y-6 ">
          {/* Profile Picture */}
          <div className="space-y-4 bg-[#F5FAF7] p-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Image className="w-5 h-5 text-gray-500" />
              Profile Picture
            </h2>
            <div className="p-4 border border-gray-100 rounded-lg">
              <EditProfileImage authUserData={authUserData} />
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4 bg-[#F5FAF7] p-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              Personal Information
            </h2>
            <div className="p-4 border border-gray-100 rounded-lg">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Member since</p>
                    <p className="font-medium">
                      {formatDate(+user?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <EditProfileForm />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-4 pt-4">
            <div className="border border-red-100 rounded-lg overflow-hidden">
              <div className="bg-red-50 p-4">
                <h3 className="font-medium text-red-800">Danger Zone</h3>
                <p className="text-sm text-red-600 mt-1">
                  This action cannot be undone. This will permanently delete your account and all associated data.
                </p>
              </div>
              <div className="p-4 flex justify-end bg-white">
                <Button
                  variant="destructive"
                  onClick={() => setOpenDeleteAccountModal(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </Button>
              </div>
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
      
      {/* Delete Account Modal */}
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

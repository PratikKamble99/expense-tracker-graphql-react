import React, { useEffect, useRef, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import Pencil from "../icons/Pencil";

import EditProfileForm from "./EditProfileForm";
import ListItem from "../ui/ListItem";
import ChangePasswordForm from "./ChangePasswordForm";

const ProfileDrawer = () => {
  const { data: authUserData } = useQuery(GET_AUTH_USER);

  const [EditUser, { loading, data, error }] = useMutation(EDIT_USER, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [editProfile, setEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const inputRef = useRef(null);

  const [ImageUrl, setImageUrl] = useState<"">(
    authUserData?.authenticatedUser.profilePicture || ""
  );

  const pickedHandler = async (event: any) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      if (!pickedFile.type.startsWith("image/")) {
        event.target.value = "";
        setImageUrl("");
        return toast.error("Please select an image file.");
      }

      const fileReader: any = new FileReader();
      fileReader.onload = () => {
        setImageUrl(fileReader.result);
      };
      fileReader.readAsDataURL(pickedFile);

      try {
        const formData = new FormData();
        formData.append("file", pickedFile);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formData
        );
        console.log(response);

        await EditUser({
          variables: {
            input: {
              profilePicture: response.data.secure_url,
            },
          },
        });
        toast.success("Profile picture updated");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUploadImage = () => {
    // accessing input with useRef hook
    if (inputRef?.current) {
      inputRef.current?.click();
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <img
            src={authUserData?.authenticatedUser.profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={ImageUrl}
                      alt="profile-picture"
                      className=""
                    />
                    <AvatarFallback>
                      {authUserData?.authenticatedUser.name.charAt(0) +
                        authUserData?.authenticatedUser.name.charAt(1)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute bottom-1 right-0 bg-gray-500 p-1 rounded-full outline outline-1 outline-white cursor-pointer"
                    onClick={handleUploadImage}
                  >
                    <Pencil fill="white" />
                  </div>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickedHandler}
                />
                {/* <Button onClick={handleUploadImage}>Edit Profile Photo</Button> */}
                <p className="text-xl font-bold">
                  {authUserData?.authenticatedUser.name}
                </p>
                <p className="text-xl ">
                  {authUserData?.authenticatedUser.email}
                </p>
              </div>
            </SheetTitle>
            <hr />
            <ul className="flex flex-col gap-2">
              <ListItem onClick={() => setEditProfile(true)}>
                Edit Profile
              </ListItem>
              <ListItem onClick={() => setChangePassword(true)}>
                Change Password
              </ListItem>
              <ListItem>toggle theme</ListItem>
              <ListItem>logout</ListItem>
            </ul>
            <SheetDescription></SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      {editProfile && (
        <EditProfileForm isOpen={editProfile} setOpen={setEditProfile} />
      )}
      {changePassword && (
        <ChangePasswordForm isOpen={changePassword} setOpen={setChangePassword} />
      )}
    </>
  );
};

export default ProfileDrawer;

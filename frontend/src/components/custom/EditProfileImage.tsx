import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import { useMutation } from "@apollo/client";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  authUserData: any;
};

const EditProfileImage = ({ authUserData }: Props) => {
  const [EditUser] = useMutation(EDIT_USER, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string | undefined>(
    authUserData?.authenticatedUser.profilePicture
  );

  const pickedHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      if (!pickedFile.type.startsWith("image/")) {
        event.target.value = "";
        setImageUrl("");
        return toast.error("Please select a valid image file.");
      }

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImageUrl(fileReader.result as string);
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

        await EditUser({
          variables: {
            input: {
              profilePicture: response.data.secure_url,
            },
          },
        });
        toast.success("Profile picture updated successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload the profile picture.");
      }
    }
  };

  const handleUploadImage = () => {
    if (inputRef?.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6">
      {/* Avatar */}
      <div>
        <Avatar className="w-24 h-24 border-2 border-text-primary">
          <AvatarImage src={imageUrl} alt="Profile Picture" />
          <AvatarFallback className="bg-[#292A2E] text-text-primary font-bold">
            {authUserData?.authenticatedUser.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pickedHandler}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button
          className="bg-text-primary text-white hover:bg-[#03b6a4] focus:ring-2 focus:ring-offset-2 focus:ring-text-primary transition-all duration-300 "
          onClick={handleUploadImage}
        >
          Change Picture
        </Button>
        <Button
          className="bg-danger text-white hover:bg-danger] focus:ring-2 focus:ring-offset-2 focus:ring-danger transition-all duration-300"
          onClick={() => toast.error("Delete Picture feature coming soon!")}
        >
          Remove Picture
        </Button>
      </div>
    </div>
  );
};

export default EditProfileImage;

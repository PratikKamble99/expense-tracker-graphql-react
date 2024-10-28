import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import { useMutation, useQuery } from "@apollo/client";
import axios from "axios";
import toast from "react-hot-toast";
import { GET_AUTH_USER } from "@/graphql/query/user.query";

type Props = {};

const EditProfileImage = ({}: Props) => {
  const { data: authUserData } = useQuery(GET_AUTH_USER);

  const [EditUser] = useMutation(EDIT_USER, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const inputRef = useRef(null);

  const [imageUrl, setImageUrl] = useState<string | undefined>(
    authUserData?.authenticatedUser.profilePicture
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
      //@ts-ignore
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex py-4 items-center gap-x-3">
      <div>
        <Avatar className="w-20 h-20">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            {authUserData?.authenticatedUser.name.charAt(0) +
              authUserData?.authenticatedUser.name.charAt(1)}
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
      <div className="flex gap-x-2">
        <Button
          className="bg-[#442CB8] hover:bg-[#442CB8] border border-[#292A2E]"
          onClick={handleUploadImage}
        >
          Change Picture
        </Button>
        <Button
          className="bg-[#281E21] text-[#D96665] border border-[#292A2E]"
          onClick={() => alert("coming soon")}
        >
          Delete Picture
        </Button>
      </div>
    </div>
  );
};

export default EditProfileImage;

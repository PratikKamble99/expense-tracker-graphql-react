import InputField from "@/components/InputField";
import RadioButton from "@/components/RadioButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { Image, PictureInPicture, User } from "lucide-react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { data } = useQuery(GET_AUTH_USER);

  const [EditUser, {loading}] = useMutation(EDIT_USER);

  const { values, handleSubmit, setFieldValue, setValues } = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      gender: "",
    },
    onSubmit: async (values) => {
      try {
        await EditUser({
          variables: {
            input: {
              name: values.name,
              gender: values.gender,
              username: values.username,
            },
          },
        });
        toast.success("Profile updated successfully.");
        // setOpen(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.message);
      }
    },
  });

  useEffect(() => {
    if (data?.authenticatedUser) {
      setValues({
        name: data?.authenticatedUser.name,
        email: data?.authenticatedUser.email,
        username: data?.authenticatedUser.username,
        gender: data?.authenticatedUser.gender,
      });
    }
  }, [data]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    console.log(e.target.name);
    setFieldValue(name, value);
  };

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
          <div className="flex py-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={data?.authenticatedUser?.profilePicture} />
              <AvatarFallback>
                {data?.authenticatedUser.name.charAt(0) +
                  data?.authenticatedUser.name.charAt(1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button>Change Picture</Button>
              <Button>Delete Picture</Button>
            </div>
          </div>
          <div>
            <SectionHeading icon={<User />} label="Personal Information" />
            <form className="space-y-4 w-[50%]" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-white">FullName</label>
                <input className="p-2 rounded-md bg-inherit border border-[#292A2E]"/>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-white">Email</label>
                <input className="p-2 rounded-md bg-inherit border border-[#292A2E] custom-autofill-color"/>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-white">Username</label>
                <input className="p-2 rounded-md bg-inherit border border-[#292A2E]"/>
              </div>
              <div className="flex gap-10">
                <RadioButton
                  id="male"
                  label="Male"
                  name="gender"
                  value="male"
                  onChange={handleChange}
                  checked={values.gender === "male"}
                />
                <RadioButton
                  id="female"
                  label="Female"
                  name="gender"
                  value="female"
                  onChange={handleChange}
                  checked={values.gender === "female"}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
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

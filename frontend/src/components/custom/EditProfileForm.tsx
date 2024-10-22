import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RadioButton from "../RadioButton";
import InputField from "../InputField";

import { useFormik } from "formik";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const EditProfileForm = ({ isOpen, setOpen }: Props) => {
  const { data: authUserData, loading } = useQuery(GET_AUTH_USER);

  const [EditUser] = useMutation(EDIT_USER);

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
        setOpen(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.message);
      }
    },
  });

  useEffect(() => {
    if (authUserData) {
      setValues({
        name: authUserData.authenticatedUser.name,
        email: authUserData.authenticatedUser.email,
        username: authUserData.authenticatedUser.username,
        gender: authUserData.authenticatedUser.gender,
      });
    }
  }, [authUserData]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    console.log(e.target.name);
    setFieldValue(name, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                disabled={true}
              />
              <InputField
                label="Username"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;

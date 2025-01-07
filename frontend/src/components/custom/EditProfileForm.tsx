import { useEffect } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

type Props = {};

const EditProfileForm = ({}: Props) => {
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
        if (
          authUserData.authenticatedUser.name === values.name &&
          authUserData.authenticatedUser.email === values.email &&
          authUserData.authenticatedUser.username === values.username &&
          authUserData.authenticatedUser.gender === values.gender
        )
          return toast.error("Please change at least one field value");

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
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "An error occurred.");
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
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  return (
    <form className="space-y-6 w-full sm:w-[50%]" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-text-primary font-medium">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#1b1b1b] text-white border border-[#292A2E] focus:outline-none focus:ring-2 focus:ring-text-primary focus:border-text-primary"
          required
        />
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-text-primary font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          disabled
          className="p-3 rounded-md bg-[#1b1b1b] text-gray-500 border border-[#292A2E] focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {/* Username Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-text-primary font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={values.username}
          onChange={handleChange}
          className="p-3 rounded-md bg-[#1b1b1b] text-white border border-[#292A2E] focus:outline-none focus:ring-2 focus:ring-text-primary focus:border-text-primary"
          required
        />
      </div>

      {/* Gender Field */}
      <div className="flex flex-col gap-2">
        <label className="text-text-primary font-medium">Gender</label>
        <RadioGroup
          name="gender"
          value={values.gender}
          onChange={handleChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              id="male"
              value="male"
              className="focus:ring-text-primary"
              onClick={(e) =>
                handleChange({
                  target: {
                    name: "gender",
                    value: e.currentTarget.value,
                  },
                })
              }
            />
            <Label htmlFor="male" className="text-white">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              id="female"
              value="female"
              className="focus:ring-text-primary"
              onClick={(e) =>
                handleChange({
                  target: {
                    name: "gender",
                    value: e.currentTarget.value,
                  },
                })
              }
            />
            <Label htmlFor="female" className="text-white">
              Female
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-text-primary text-white font-bold rounded-md hover:bg-[#03b6a4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;

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
          authUserData.authenticatedUser.name == values.name &&
          authUserData.authenticatedUser.email == values.email &&
          authUserData.authenticatedUser.username == values.username &&
          authUserData.authenticatedUser.gender == values.gender
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
    setFieldValue(name, value);
  };

  return (
    <form className="space-y-4 w-full sm:w-[50%]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 ">
        <label htmlFor="name" className="text-white">
          FullName
        </label>
        <input
          id="name"
          className="p-2 rounded-md bg-inherit border border-[#292A2E]"
          type="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-white">
          Email
        </label>
        <input
          id="email"
          className="p-2 rounded-md bg-inherit border border-[#292A2E] disabled:cursor-not-allowed"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-white">
          Username
        </label>
        <input
          id="username"
          className="p-2 rounded-md bg-inherit border border-[#292A2E]"
          type="username"
          name="username"
          value={values.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-10">
        <RadioGroup
          value={values.gender}
          className="flex"
          name="gender"
          onChange={handleChange}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="male"
              id="r1"
              onClick={(e) =>
                handleChange({
                  target: {
                    name: "gender",
                    value: e.currentTarget.value,
                  },
                })
              }
            />
            <Label htmlFor="r1">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="female"
              id="r2"
              onClick={(e) =>
                handleChange({
                  target: {
                    name: "gender",
                    value: e.currentTarget.value,
                  },
                })
              }
            />
            <Label htmlFor="r2">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-md hover:bg-[#868686] focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;

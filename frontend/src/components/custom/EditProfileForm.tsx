import { useEffect } from "react";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { EDIT_USER } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import { Label } from "../ui/label";

type Props = {};

const EditProfileForm = ({}: Props) => {
  const { data: authUserData, loading } = useQuery(GET_AUTH_USER);
  const [EditUser] = useMutation(EDIT_USER);

  const { values, handleSubmit, setFieldValue, setValues, errors, touched } = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      gender: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.name) {
        errors.name = 'Name is required';
      }
      if (!values.username) {
        errors.username = 'Username is required';
      } else if (!/^[a-z0-9_]+$/.test(values.username)) {
        errors.username = 'Username can only contain lowercase letters, numbers and underscores';
      }
      if (!values.gender) {
        errors.gender = 'Please select a gender';
      }
      return errors;
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
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || 'An error occurred while updating profile');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  const handleRadioChange = (value: string) => {
    setFieldValue('gender', value);
  };

  return (
    <form className="space-y-6 w-full max-w-lg" onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="block text-sm font-medium text-[#7A7A7A] mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white text-[#000000] border border-[#E6F1EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
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
          className="w-full px-4 py-3 bg-[#F5FAF7] text-[#7A7A7A] border border-[#E6F1EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent disabled:cursor-not-allowed"
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
          className="w-full px-4 py-3 bg-white text-[#000000] border border-[#E6F1EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
          required
        />
      </div>

      {/* Gender Field */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-[#7A7A7A] mb-1">
          Gender
          {errors.gender && touched.gender && (
            <span className="text-red-500 text-xs font-normal ml-2">{errors.gender}</span>
          )}
        </label>
        <div className="flex gap-6 mt-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={values.gender === 'male'}
              onChange={() => handleRadioChange('male')}
              className="h-4 w-4 text-[#0D3F32] border-[#E6F1EC] focus:ring-[#009B6B] focus:ring-offset-0"
            />
            <Label htmlFor="male" className="text-[#000000] font-normal">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={values.gender === 'female'}
              onChange={() => handleRadioChange('female')}
              className="h-4 w-4 text-[#0D3F32] border-[#E6F1EC] focus:ring-[#009B6B] focus:ring-offset-0"
            />
            <Label htmlFor="female" className="text-[#000000] font-normal">
              Female
            </Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#0D3F32] text-white font-medium rounded-lg hover:bg-[#0D3F32]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009B6B] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;

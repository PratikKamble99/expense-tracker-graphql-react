import React from "react";

import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/InputField";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations/user.mutation";
import HelmetComponent from "@/seo/Helmet";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import { Separator } from "@/components/ui/separator";

import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LoginPage = () => {
  const [loginUser, { loading }] = useMutation(LOGIN, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [showPassword, setShowPassword] = useState(false);

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      async onSubmit(values, formikHelpers) {
        try {
          await loginUser({
            variables: {
              input: values,
            },
          });
        } catch (error: any) {
          toast.error(error?.message || 'An error occurred during login');
        }
      },
      validationSchema,
    });

  return (
    <>
      <HelmetComponent subTitle="login" />
      <div className="flex justify-center items-center h-screen">
        <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
          <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
            <div className="max-w-md w-full p-6">
              <h1 className="text-3xl font-semibold mb-6 text-black text-center">
                Login
              </h1>
              <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
                Welcome back! Log in to your account
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <InputField
                  label="Username"
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  error={
                    touched.username && errors.username ? errors.username : null
                  }
                  onBlur={handleBlur}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="flex group focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-2 focus-within:border-gray-200 transition-colors duration-300">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="rounded-none rounded-s-lg bg-gray-50 border-gray-300   block flex-1 min-w-0 text-sm  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-2 w-full border text-black focus:outline-none transition-colors duration-300 disabled:cursor-not-allowed"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="cursor-pointer inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-gray-300 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 transition-colors duration-300 focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-2 focus-within:border-gray-200"
                    >
                      {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </span>
                  </div>
                  {touched.password && errors.password ? (
                    <p className="text-red-500">{errors.password}</p>
                  ) : null}
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300
										disabled:opacity-50 disabled:cursor-not-allowed
									"
                    disabled={loading}
                  >
                    {loading ? "loading..." : "Login"}
                  </button>
                </div>
              </form>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <div className="space-y-4 w-full">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <GoogleOAuthButton 
                    className="mt-4"
                    text="Sign in with Google"
                  />

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-black hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
                <p>
                  <Link
                    to="/forgot-password"
                    className="text-black hover:underline"
                  >
                    forgot password?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;

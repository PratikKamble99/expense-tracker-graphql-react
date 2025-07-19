import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "@/components/InputField";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/graphql/mutations/user.mutation";
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
          toast.error(error?.message || "An error occurred during login");
        }
      },
      validationSchema,
    });

  return (
    <>
      <HelmetComponent subTitle="login" />
      <div className="flex justify-center items-center h-screen">
        <div className="flex min-h-screen min-w-[400px] lg:min-w-[600px] items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md border border-[#E6F1EC]">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#0D3F32] mb-2">
                Welcome Back
              </h1>
              <p className="text-[#5F6C72]">
                Log in to your account to continue
              </p>
            </div>
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
              <InputField
                label="Password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                error={
                  touched.password && errors.password ? errors.password : null
                }
                onBlur={handleBlur}
                isPassword
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              {/* <div className="flex group focus-within:ring-2 focus-within:ring-gray-300 focus-within:ring-offset-2 focus-within:border-gray-200 transition-colors duration-300">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="rounded border-[#E6F1EC] text-[#0D3F32] focus:ring-[#0D3F32]/30 focus:ring-offset-0 focus:ring-2 transition-colors"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6C72] hover:text-[#0D3F32] transition-colors"
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </span>
                </div>
                {touched.password && errors.password ? (
                  <p className="text-red-500">{errors.password}</p>
                ) : null}*/}
              <div>
                <button
                  type="submit"
                  className={`w-full px-4 text-white bg-[#0D3F32] py-2.5 rounded-lg border ${
                    touched.username && errors.username
                      ? "border-red-500"
                      : "border-[#E6F1EC] hover:border-[#0D3F32]/50"
                  } focus:ring-2 focus:ring-[#0D3F32]/30 focus:border-transparent transition-all duration-200`}
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
                  <Link
                    to="/signup"
                    className="font-medium text-[#0D3F32] hover:text-[#0D3F32]/80 transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
              <p>
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#0D3F32] hover:text-[#0D3F32]/80 transition-colors"
                >
                  forgot password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;

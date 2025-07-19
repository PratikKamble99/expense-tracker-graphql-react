import { Link } from "react-router-dom";
import RadioButton from "../components/RadioButton";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";
import { Separator } from "@/components/ui/separator";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  username: yup.string().required(),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must be at least 6 characters, and include at least one letter, one number, and one special character."
    )
    .required(),
  gender: yup.string().required(),
});

const SignUpPage = () => {
  const [signup, { loading }] = useMutation(SIGN_UP, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        username: "",
        password: "",
        gender: "",
      },
      async onSubmit(values) {
        try {
          await signup({
            variables: {
              input: values,
            },
          });
        } catch (error: any) {
          toast.error(error?.message || 'An error occurred during signup');
        }
      },
      validationSchema,
    });

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-[#E6F1EC] to-[#F5FAF7]">
      <div className="flex rounded-lg overflow-hidden z-50 bg-white shadow-lg">
        <div className="w-full min-w-[400px] lg:min-w-[500px] flex items-center justify-center">
          <div className="max-w-md w-full p-8">
            <h1 className="text-3xl font-semibold mb-2 text-[#0D3F32] text-center">
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-2 text-[#5F6C72] text-center">
              Join to keep track of your expenses
            </h1>
            <form className="space-y-2" onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && errors.name ? errors.name : null}
                onBlur={handleBlur}
              />
              <InputField
                label="Email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && errors.email ? errors.email : null}
                onBlur={handleBlur}
              />
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
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.password && errors.password ? errors.password : null
                }
              />
              <div>
                <div className="flex gap-10">
                  <RadioButton
                    id="male"
                    label="Male"
                    name="gender"
                    value="male"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={values.gender === "male"}
                  />
                  <RadioButton
                    id="female"
                    label="Female"
                    name="gender"
                    value="female"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={values.gender === "female"}
                  />
                </div>
                {touched.gender && errors.gender ? (
                  <p className="text-red-500">{errors.gender}</p>
                ) : null}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-[#0D3F32] text-white p-2.5 rounded-md hover:bg-[#0D3F32]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D3F32]/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "loading..." : "Sign Up"}
                </button>
              </div>
            </form>
            <div className="space-y-4 w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative mt-3 flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#5F6C72]">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleOAuthButton 
                className="mt-4 w-full  text-[#0D3F32] border-[#E6F1EC] hover:border-[#0D3F32]/30 transition-colors"
                text="Sign up with Google"
              />

              <p className="text-center text-sm text-[#5F6C72] mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-[#0D3F32] hover:underline font-medium hover:text-[#0D3F32]/90 transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

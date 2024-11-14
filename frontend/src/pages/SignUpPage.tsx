import { Link } from "react-router-dom";
import RadioButton from "../components/RadioButton";
import InputField from "../components/InputField";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "../graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";

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
      async onSubmit(values, formikHelpers) {
        try {
          await signup({
            variables: {
              input: values,
            },
          });
        } catch (error) {
          toast.error(error?.message);
        }
      },
      validationSchema,
    });

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex rounded-lg overflow-hidden z-50 bg-gray-300">
        <div className="w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center">
          <div className="max-w-md w-full p-4">
            <h1 className="text-3xl font-semibold mb-2 text-black text-center">
              Sign Up
            </h1>
            <h1 className="text-sm font-semibold mb-2 text-gray-500 text-center">
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
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "loading..." : "Sign Up"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-black hover:underline">
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

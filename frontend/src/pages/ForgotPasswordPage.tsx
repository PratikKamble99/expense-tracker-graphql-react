import { FORGOT_PASSWORD } from "@/graphql/mutations/user.mutation";
import useNavigation from "@/hooks/useNavigate";
import { useMutation } from "@apollo/client";
import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
  const navigate = useNavigation();
  const [ForgotPassword, { data, loading, error }] =
    useMutation(FORGOT_PASSWORD);

  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await ForgotPassword({ variables: { input: email } });
      toast.success("Password send to your email.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className=" w-[80%]  sm:w-screen  border-red-700 rounded-lg flex px-10 pt-16 pb-8 justify-center items-center bg-gradient-to-r from-blue-100 via-purple-50 to-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Forgot Password
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your e-mail address, and we'll send you new password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2" htmlFor="email">
                Enter E-mail Address
              </label> */}

              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send New Password"}
            </button>
          </form>
          <Link
            to="/login"
            className="mt-4 block text-black hover:underline text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

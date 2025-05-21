import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { RESEND_OTP, VERIFY_EMAIL } from "@/graphql/mutations/user.mutation";

const otpValidationSchema = Yup.object({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .matches(/^\d+$/, "Only numeric values are allowed")
    .required("OTP is required"),
});

export default function VerifyEmail({
  email,
  handleLogout,
}: {
  email: string;
  handleLogout(): void;
}) {
  const [VerifyEmail, { loading }] = useMutation(VERIFY_EMAIL, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [ResendOtp] = useMutation(RESEND_OTP);

  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let interval;
    if (isResendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    if (resendTimer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [resendTimer, isResendDisabled]);

  const handleSubmit = async (values) => {
    console.log("Submitted OTP:", values.otp);

    try {
      const result = await VerifyEmail({ variables: { input: values.otp } });
      console.log(result);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleResend = async () => {
    setIsResendDisabled(true);
    setResendTimer(60);
    try {
      const result = await ResendOtp();
      console.log(result);
      toast.success("OTP resent successfully.");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="max-w-md">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        <p className="text-sm text-muted-foreground">
          A 6-digit verification code has been sent to <strong>{email}</strong>.
          Please enter the code below to verify your email address.
        </p>
        {/* <p className="text-xs">
          Entered the wrong email?
          <button
            // onClick={handleChangeEmail}
            className="ml-1 text-blue-600 hover:underline text-xs"
          >
            Change Email
          </button>
        </p> */}
      </CardHeader>

      <CardContent>
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, handleBlur }) => (
            <Form className="space-y-2">
              <div>
                <Field
                  as={Input}
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  inputMode="numeric"
                  className="text-center tracking-widest text-lg"
                  onBlur={handleBlur}
                />
                {touched.otp && (
                  <div className="text-xs text-red-500 mt-1">
                    <ErrorMessage name="otp" />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          Didn’t get the code?
          {isResendDisabled ? (
            <span className="ml-2 text-gray-400">Resend in {resendTimer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="ml-2 text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="max-w-md mx-auto mt-4 bg-muted/30 rounded-md text-center text-sm text-muted-foreground">
          Don’t want to verify your email?{" "}
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:underline font-medium"
          >
            Log out instead
          </button>
        </div>
      </CardContent>
    </div>
  );
}

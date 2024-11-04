import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "../InputField";

import { useFormik } from "formik";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const ChangePasswordForm = ({ isOpen, setOpen }: Props) => {
  const [ChangePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  const { values, handleSubmit, setFieldValue, setValues } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        await ChangePassword({
          variables: {
            input: {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
            },
          },
        });
        toast.success("Password Changed successfully.");
        setOpen(false);
      } catch (error) {
        console.log(error);
        toast.error(error?.message);
      }
    },
  });

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFieldValue(name, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <InputField
                label="Current Password"
                id="current-password"
                name="currentPassword"
                value={values.currentPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <InputField
                label="New Password"
                id="new-password"
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <InputField
                label="Confirm Password"
                id="confirm-password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
              />
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black  focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                  Save
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;

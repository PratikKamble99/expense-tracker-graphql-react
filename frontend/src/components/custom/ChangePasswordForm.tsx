import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  const { values, handleSubmit, setFieldValue, errors, touched } = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
      if (!values.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (values.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      return errors;
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
      } catch (error: any) {
        console.error(error);
        toast.error(error?.message || 'An error occurred while changing password');
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-md rounded-xl bg-white">
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl font-bold">
            Change Password
          </DialogTitle>
          <DialogDescription>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="current-password" className="block text-sm font-medium text-[#7A7A7A]">
                  Current Password
                </label>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  value={values.currentPassword}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-[#E6F1EC] rounded-lg focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
                  required
                />
                {errors.currentPassword && touched.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="new-password" className="block text-sm font-medium text-[#7A7A7A]">
                  New Password
                </label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full px-4 py-2 border border-[#E6F1EC] rounded-lg focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
                  required
                />
                {errors.newPassword && touched.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>
              <div className="space-y-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[#7A7A7A]">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-[#E6F1EC] rounded-lg focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
                  required
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#0D3F32] text-white py-3 px-4 rounded-lg hover:bg-[#0D3F32]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009B6B] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
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

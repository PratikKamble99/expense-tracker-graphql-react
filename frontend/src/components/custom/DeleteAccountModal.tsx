import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { DELETE_ACCOUNT } from "@/graphql/mutations/user.mutation";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const DeleteAccountModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [deleteUserAccount, { loading, client }] = useMutation(DELETE_ACCOUNT);

  async function handleDelete() {
    try {
      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await deleteUserAccount();
          await client.resetStore();
          resolve(response);
          // Navigate to login after successful deletion
          navigate('/login');
        } catch (error) {
          reject(error);
        }
      });
      
      toast.promise(promise, {
        loading: "Deleting...",
        success: <b>Account deleted successfully! Redirecting to login...</b>,
        error: (error) => <b>{error?.message || 'Could not delete account'}</b>,
      });
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error?.message || 'An error occurred while deleting your account');
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogContent
        className="w-[80%] rounded-xl bg-black border"
        closeColor={"white"}
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl font-bold text-white">
            Delete Account
          </DialogTitle>
          <DialogDescription>
            <p className="pb-2">
              This project will be deleted, along with all of your data.
            </p>
            <p className="bg-[#320b11] text-[#e1162a] p-2">
              <span className="font-semibold">Warning: </span> This action is
              not reversible. Please be certain.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-between">
          <div className="w-full flex justify-between">
            <Button
              className="border text-white  focus:ring-2 focus:ring-offset-2  transition-all duration-300"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-white text-black hover:bg-slate-300 focus:ring-2 focus:ring-offset-2  transition-all duration-300"
              onClick={handleDelete}
            >
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;

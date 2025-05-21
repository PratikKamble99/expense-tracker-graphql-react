import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { TRANSACITON_TYPES } from "@/constants";

export const categoryOptions = [
  {
    label: "Personal",
    options: [
      { value: "personal:food", label: "Food" },
      { value: "personal:other", label: "Other" },
      { value: "personal:clothing", label: "Clothing & Shoes" },
      { value: "personal:fitness", label: "Fitness (e.g. Protein)" },
    ],
  },
  {
    label: "Housing",
    options: [
      { value: "housing:rent", label: "Room Rent" },
      { value: "housing:utilities:electricity", label: "Electricity Bill" },
      { value: "housing:utilities:internet", label: "Internet Bill" },
    ],
  },
  {
    label: "Transfer",
    options: [{ value: "transfer:home_support", label: "Sent to Home" }],
  },
];

const TransactionForm = () => {
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ["fetchTransactions", "fetchCategoryStatistics"],
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const transactionData: any = {
      description: formData.get("description"),
      paymentType: formData.get("paymentMethod"),
      category: formData.get("category"),
      amount: parseFloat(formData.get("amount") as string),
      location: formData.get("location"),
      date: formData.get("date"),
    };

    if (formData.get("type")) {
      transactionData["type"] = formData.get("type");
    }

    try {
      await createTransaction({
        variables: {
          input: transactionData,
        },
      });

      form.reset();
      toast.success("Transaction created successfully");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <form
      className="w-full max-w-lg flex flex-col gap-5 px-3 bg-[#1b1b1b] text-white p-2 rounded-md "
      onSubmit={handleSubmit}
    >
      {/* TRANSACTION */}
      <div className="flex flex-wrap">
        <div className="w-full">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="description"
          >
            Transaction
          </label>
          <input
            className="appearance-none block w-full bg-[#2d2d2d] text-white border border-text-primary rounded py-3 px-4 leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
            id="description"
            name="description"
            type="text"
            required
            placeholder="Rent, Groceries, Salary, etc."
          />
        </div>
      </div>
      {/* Payment Method */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="paymentType"
          >
            Payment Method
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-[#2d2d2d] text-white border border-text-primary py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
              id="paymentMethod"
              name="paymentMethod"
            >
              <option value={"card"}>Card</option>
              <option value={"cash"}>Cash</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-[#2d2d2d] text-white border border-text-primary py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
              id="category"
              name="category"
            >
              {TRANSACITON_TYPES.map((type) => (
                <option value={type.toLocaleLowerCase()}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}{" "}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="paymentType"
          >
            Type
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-[#2d2d2d] text-white border border-text-primary py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
              id="type"
              name="type"
              // required={}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {/* AMOUNT */}
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase text-white text-xs font-bold mb-2"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            className="appearance-none block w-full bg-[#2d2d2d] text-white border border-text-primary rounded py-3 px-4 leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
            id="amount"
            name="amount"
            type="number"
            placeholder="150"
            required
            min={1}
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            className="appearance-none block w-full bg-[#2d2d2d] text-white border border-text-primary rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-[#3e3e3e]"
            id="location"
            name="location"
            type="text"
            placeholder="New York"
          />
        </div>

        {/* DATE */}
        <div className="w-full flex-1">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="appearance-none block w-full bg-[#2d2d2d] text-white border border-text-primary rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
            placeholder="Select date"
            required
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <button
        className="text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;

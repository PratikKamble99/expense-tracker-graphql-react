import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { TRANSACITON_TYPES } from "@/constants";
import { GET_TRANSACTION_BY_ID } from "@/graphql/query/transaction.query";
import { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

interface Props {
  transactionId: string|undefined
}

const INITIAL_VALUES = {
  description: "",
  paymentType: "CASH",
  category: "",
  amount: 0,
  location: "",
  date: new Date().toISOString().split('T')[0],
  type: TRANSACITON_TYPES[0],
}

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



const TransactionForm = ({transactionId}:Props) => {
  const navigate = useNavigate();
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ["fetchTransactions"],
  });

  const [updateTransaction, { loading: updateLoading }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: ["fetchTransactions"],
  });

  const { data: transactionData, loading: transactionLoading } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { id: transactionId },
    skip: !transactionId,
  });

  const {values, handleSubmit, handleChange, handleBlur, setValues} = useFormik({
    initialValues: INITIAL_VALUES,
    onSubmit: async (values) => {
      if (transactionId) {
        toast.promise(
          updateTransaction({ variables: { input: { ...values, transactionId } } }),
          {
            loading: "Updating transaction",
            success: "Transaction updated successfully",
            error: "Failed to update transaction",
          }
        );
        navigate('/transactions');
      } else {
        toast.promise(
          createTransaction({ variables: { input: values } }),
          {
            loading: "Creating transaction",
            success: "Transaction created successfully",
            error: "Failed to create transaction",
          }
        );
      }
    },
  });


  useEffect(() => {
    if (transactionData?.transaction) {
      const transaction = transactionData.transaction;
      setValues({
        description: transaction.description,
        paymentType: transaction.paymentType,
        category: transaction.category,
        amount: transaction.amount,
        location: transaction.location,
        date: new Date(+transaction.date).toISOString().split('T')[0],
        type: transaction.type||'',
      });
    }
    
    return () => {
      setValues(INITIAL_VALUES);
    }
    
  }, [transactionData]);

  // const handleSubmitForm  = async (e: any) => {
  //   e.preventDefault();

  //   const form = e.target;
  //   const formData = new FormData(form);

  //   const transactionData: any = {
  //     description: formData.get("description"),
  //     paymentType: formData.get("paymentMethod"),
  //     category: formData.get("category"),
  //     amount: parseFloat(formData.get("amount") as string),
  //     location: formData.get("location"),
  //     date: formData.get("date"),
  //   };

  //   if (formData.get("type")) {
  //     transactionData["type"] = formData.get("type");
  //   }

  //   try {
  //     await createTransaction({
  //       variables: {
  //         input: transactionData,
  //       },
  //     });

  //     form.reset();
  //     toast.success("Transaction created successfully");
  //   } catch (error) {
  //     toast.error(error?.message);
  //   }
  // };

  return (
    <form
      className="w-full max-w-lg mx-auto flex flex-col gap-5 px-3 bg-white text-[#000000] p-6 rounded-xl shadow-sm"
      onSubmit={handleSubmit}
    >
      {/* TRANSACTION */}
      <div className="flex flex-wrap">
        <div className="w-full">
          <label
            className="block uppercase tracking-wide text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="description"
          >
            Transaction
          </label>
          <input
            className="appearance-none block w-full bg-white text-[#000000] border border-[#5F6C72] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
            id="description"
            name="description"
            type="text"
            required
            placeholder="Rent, Groceries, Salary, etc."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
      {/* Payment Method */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="paymentType"
          >
            Payment Method
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white text-[#000000] border border-[#5F6C72] py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
              id="paymentMethod"
              name="paymentMethod"
              value={values.paymentType}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value={"card"}>Card</option>
              <option value={"cash"}>Cash</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0D3F32]">
              <svg
                className="fill-current h-4 w-4 text-[#0D3F32]"
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
            className="block uppercase tracking-wide text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white text-[#000000] border border-[#5F6C72] py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
              id="category"
              name="category"
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {TRANSACITON_TYPES.map((type) => (
                <option key={type} value={type.toLocaleLowerCase()}>
                  {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}{" "}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0D3F32]">
              <svg
                className="fill-current h-4 w-4 text-[#0D3F32]"
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
            className="block uppercase tracking-wide text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="paymentType"
          >
            Type
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white text-[#000000] border border-[#5F6C72] py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
              id="type"
              name="type"
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0D3F32]">
              <svg
                className="fill-current h-4 w-4 text-[#0D3F32]"
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
            className="block uppercase text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            className="appearance-none block w-full bg-white text-[#000000] border border-[#5F6C72] rounded-lg py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#009B6B] focus:border-transparent"
            id="amount"
            name="amount"
            type="number"
            placeholder="150"
            required
            min={1}
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className="flex flex-wrap gap-3">
        <div className="w-full flex-1 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="location"
          >
            Location
          </label>
          <input
            className="appearance-none block w-full text-[#000000] border border-[#5F6C72] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-[#3e3e3e]"
            id="location"
            name="location"
            type="text"
            placeholder="New York"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* DATE */}
        <div className="w-full flex-1">
          <label
            className="block uppercase tracking-wide text-[#7A7A7A] text-xs font-medium mb-2"
            htmlFor="date"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="appearance-none block w-full text-[#000000] border border-[#5F6C72] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-[#3e3e3e] focus:border-text-primary"
            placeholder="Select date"
            required
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <button
        className="text-white font-bold w-full rounded-lg px-4 py-3 bg-[#0D3F32] hover:bg-[#0D3F32]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        disabled={loading || updateLoading}
      >
        {loading || updateLoading ? "Loading..." : "Save Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;

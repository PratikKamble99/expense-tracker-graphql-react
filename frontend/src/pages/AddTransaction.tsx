import TransactionForm from "@/components/TransactionForm";

const AddTransaction = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh_-_72px)]">
      <p className="text-4xl font-bold mb-4"> Add Transaction</p>
      <TransactionForm />
    </div>
  );
};

export default AddTransaction;

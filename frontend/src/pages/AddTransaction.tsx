import TransactionForm from "@/components/TransactionForm";

const AddTransaction = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh_-_72px)]">
      <div className="w-[80%] flex flex-col justify-center mx-auto">
        <p className="text-4xl font-bold mb-4 text-center"> Add Transaction</p>
        <div className="flex justify-center">
          <TransactionForm />
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;

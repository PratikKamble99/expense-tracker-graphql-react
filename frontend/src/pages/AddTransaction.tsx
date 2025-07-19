import { useParams } from 'react-router-dom';
import TransactionForm from "@/components/TransactionForm";

interface TransactionPageProps {
  isEditMode?: boolean;
}

const AddTransaction = ({ isEditMode = false }: TransactionPageProps) => {
  const { id } = useParams<{ id?: string }>();
  
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh_-_72px)] bg-[#F5FAF7] py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl border border-[#E6F1EC] shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#0D3F32] mb-2">
            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h1>
          <p className="text-center text-[#5F7D75] mb-6 md:mb-8 text-sm md:text-base">
            {isEditMode ? 'Update your transaction details' : 'Enter your transaction details below'}
          </p>
          <div className="border-t border-[#E6F1EC] pt-6">
            <TransactionForm 
              transactionId={isEditMode ? id : undefined} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;

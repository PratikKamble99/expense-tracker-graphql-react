import React from "react";

import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
  // Add more categories and corresponding color classes as needed
};

const Card = ({ data }: { data: any }) => {
  let {  _id, category, amount, date, description, paymentType, location, user } = data;

  const [deleteTransaction, { loading, error }] = useMutation(
    DELETE_TRANSACTION, { refetchQueries: ["fetchTransactions","fetchCategoryStatistics"] }
  );

  const cardClass = categoryColorMap[category];

  // Capitalize the first letter of the description
	description = description[0]?.toUpperCase() + description.slice(1);
	category = category[0]?.toUpperCase() + category.slice(1);
	paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);


  const formattedDate = formatDate(date);

  const handleDelete = async () => {
    // Add your delete transaction logic here
    console.log(_id)
    try {
      await deleteTransaction({
        variables: {
          input: _id,
        },
      });
      toast.success("Transaction deleted successfully");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">{category}</h2>
          <div className="flex items-center gap-2">
          {!loading && <FaTrash className={"cursor-pointer"} onClick={handleDelete} />}
						{loading && <div className='w-6 h-6 border-t-2 border-b-2  rounded-full animate-spin'></div>}
            <Link to={`/transaction/${_id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: {amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {location || 'N/A'}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{formattedDate}</p>
          <img
            src={user?.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;

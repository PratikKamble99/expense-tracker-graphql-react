import React from "react";

import Card from "./Card";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/query/transaction.query";
import { GET_AUTH_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/query/user.query";

const Cards = () => {
  const { data:authData } = useQuery(GET_AUTH_USER);
  const { data:transactions, loading, } = useQuery(GET_TRANSACTIONS);
  const { data } = useQuery(GET_USER_AND_TRANSACTIONS, {
    variables: {
      id: authData.authenticatedUser._id,
      },
  });

  console.log(data, 'user and transactions')

  // TO-DO => ADD RELATIONSHIPS

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!loading && transactions?.transactions.map((transaction) => (
          <Card key={transaction._id} data={transaction} />
        ))}
      </div>
      {!loading && transactions?.transactions?.length === 0 && (
				<p className='text-2xl font-bold text-center w-full'>No transaction history found.</p>
			)}  
    </div>
  );
};
export default Cards;

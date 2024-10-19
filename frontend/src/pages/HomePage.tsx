import React from "react";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOG_OUT } from "../graphql/mutations/user.mutation";
import { GET_CATEGORY_STATISTICS } from "../graphql/query/transaction.query";
import { GET_AUTH_USER } from "../graphql/query/user.query";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const [logoutUser, { loading, client }] = useMutation(LOG_OUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const  { data: authUserData } = useQuery(GET_AUTH_USER);


  const { data } = useQuery( GET_CATEGORY_STATISTICS );

  const backgroundColor = data?.categoryStatistics.map((state) => {
    if(state.category == "expense") return  "rgba(255, 99, 132)";
    if(state.category == "saving") return  "rgba(75, 192, 192)";
    if(state.category == "investment") return  "rgba(54, 162, 235)";
  })

  console.log(backgroundColor,'backgroundColor')

  const chartData = {
    labels: data?.categoryStatistics.map((item) => item.category) || [],
    datasets: [
      {
        label: "%",
        data: data?.categoryStatistics.map((item) => item.totalAmount) || [],
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      client.resetStore();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
      <div className="flex items-center">
        <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
          Spend wisely, {authUserData?.authenticatedUser.name}
        </p>
        <img
          src={authUserData?.authenticatedUser.profilePicture}
          className="w-11 h-11 rounded-full border cursor-pointer"
          alt="Avatar"
        />
        {!loading && (
          <MdLogout
            className="mx-2 w-5 h-5 cursor-pointer"
            onClick={handleLogout}
          />
        )}
        {/* loading spinner */}
        {loading && (
          <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
        )}
      </div>
      <div className="flex flex-wrap w-full justify-center items-center gap-6">
        { data?.categoryStatistics.length > 0 && <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
          <Doughnut data={chartData} />
        </div>}

        <TransactionForm />
      </div>
      <Cards />
    </div>
  );
};
export default HomePage;

import React from "react";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Cards from "../components/Cards";
import TransactionForm from "../components/TransactionForm";

import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { LOG_OUT } from "../graphql/mutations/user.mutation";
import { GET_CATEGORY_STATISTICS } from "../graphql/query/transaction.query";
import { GET_AUTH_USER } from "../graphql/query/user.query";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ChartRepresentation from "@/components/custom/ChartRepresentation";
import { Button } from "@/components/ui/button";
import useNavigation from "@/hooks/useNavigate";

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage = () => {
  const navigate = useNavigation();

  const [logoutUser, { loading, client }] = useMutation(LOG_OUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const { data: authUserData } = useQuery(GET_AUTH_USER);

  const { data } = useQuery(GET_CATEGORY_STATISTICS);

  const backgroundColor = data?.categoryStatistics.map((state) => {
    if (state.category == "expense") return "rgba(255, 99, 132)";
    if (state.category == "saving") return "rgba(75, 192, 192)";
    if (state.category == "investment") return "rgba(54, 162, 235)";
  });

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

  return (
    <div className="flex flex-col gap-6 p-8 z-20 relative justify-center w-full pt-4">
      <div className="flex flex-grow items-center">
        <div className="flex flex-1 flex-col sm:flex-row justify-between">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, {authUserData?.authenticatedUser.name}
          </p>
          <Button
            className="max-w-fit self-end mt-1 sm:mt-0 border"
            onClick={() => navigate("/add-transaction")}
          >
            Add Transactions
          </Button>
        </div>
        {/* loading spinner */}
        {loading && (
          <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
        )}
      </div>
      <RecentTransactions />
      <ChartRepresentation />
    </div>
  );
};
export default HomePage;

import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "../graphql/query/user.query";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ChartRepresentation from "@/components/custom/ChartRepresentation";
import { Button } from "@/components/ui/button";
import useNavigation from "@/hooks/useNavigate";

const HomePage = () => {
  const navigate = useNavigation();

  const { data: authUserData } = useQuery(GET_AUTH_USER);

  return (
    <div className=" flex flex-col gap-6 p-8 z-20 relative justify-center w-full pt-4">
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
      </div>
      <RecentTransactions />
      <ChartRepresentation />
    </div>
  );
};
export default HomePage;

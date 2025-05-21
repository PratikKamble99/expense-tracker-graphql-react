import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "../graphql/query/user.query";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ChartRepresentation from "@/components/custom/ChartRepresentation";
import { Button } from "@/components/ui/button";
import useNavigation from "@/hooks/useNavigate";
import { Card } from "@/components/ui/card";
import { GET_DASHBOARD_SUMMERY } from "@/graphql/query/transaction.query";

const Dashboard = () => {
  const navigate = useNavigation();

  const { data: authUserData } = useQuery(GET_AUTH_USER);
  const { data } = useQuery(GET_DASHBOARD_SUMMERY);

  console.log(data, "Data");

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          label="Income"
          amount={data?.dashboardSummary?.totalIncome}
          percent={data?.dashboardSummary?.percentIncome}
        />
        <SummaryCard
          label="Expense"
          amount={data?.dashboardSummary?.totalExpense}
          percent={data?.dashboardSummary?.percentExpense}
        />
        <SummaryCard
          label="Saving"
          amount={data?.dashboardSummary?.totalSaving}
          percent={data?.dashboardSummary?.percentSaving}
        />
      </div>
      <RecentTransactions />
      <ChartRepresentation />
    </div>
  );
};
export default Dashboard;

const SummaryCard = ({ label, amount, percent }) => {
  const percentClass = percent > 0 ? "text-green-500" : "text-red-500";

  return (
    <Card className="rounded-lg bg-secondary-background border-none text-white p-4 space-y-1">
      <div className="text-lg font-medium">{label}</div>
      <div className="text-2xl font-semibold">₹ {amount}</div>
      <div className={`text-sm ${percentClass}`}>{percent}% vs last year</div>
    </Card>
  );
};

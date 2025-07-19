import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { GET_DASHBOARD_SUMMERY } from "@/graphql/query/transaction.query";
import { TrendingUp, TrendingDown, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useNavigation from "@/hooks/useNavigate";
import { Card } from "@/components/ui/card";
import RecentTransactions from "@/components/custom/RecentTransactions";
import ChartRepresentation from "@/components/custom/ChartRepresentation";

type SummaryCardType = 'income' | 'expense' | 'savings';

interface SummaryCardProps {
  label: string;
  amount: number;
  percent: number;
  type: SummaryCardType;
}

interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
  percentIncome: number;
  percentExpense: number;
  percentSaving: number;
}



const Dashboard = () => {
  const navigate = useNavigation();
  const { data: authUserData } = useQuery(GET_AUTH_USER);
  const { data } = useQuery<{ dashboardSummary: DashboardSummary }>(GET_DASHBOARD_SUMMERY);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-[#F5FAF7] pb-14 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0D3F32]">Dashboard</h1>
          <p className="text-sm text-[#7A7A7A]">
            Welcome back, {authUserData?.authenticatedUser.name}!
          </p>
        </div>
        <Button 
          onClick={() => navigate("/add-transaction")}
          className="bg-[#0D3F32] hover:bg-[#0D3F32]/90 text-white flex items-center gap-2 rounded-lg px-4 py-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          label="Current Year Income"
          amount={data?.dashboardSummary?.totalIncome || 0}
          percent={data?.dashboardSummary?.percentIncome || 0}
          type="income"
        />
        <SummaryCard
          label="Current Year Expense"
          amount={data?.dashboardSummary?.totalExpense || 0}
          percent={data?.dashboardSummary?.percentExpense || 0}
          type="expense"
        />
        <SummaryCard
          label="Current Year Savings"
          amount={data?.dashboardSummary?.totalSaving || 0}
          percent={data?.dashboardSummary?.percentSaving || 0}
          type="savings"
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <RecentTransactions />
        </div>
        <div className="">
          <Card className="border border-[#E6F1EC] rounded-xl">
            {/* <h2 className="text-lg font-medium text-[#0D3F32] mb-4">Spending Overview</h2> */}
            <ChartRepresentation />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const SummaryCard = ({ label, amount, percent, type }: SummaryCardProps) => {
  const isPositive = percent >= 0;
  // Color and icon mapping for different card types
  const colorMap = {
    income: {
      bg: "bg-[#E6F1EC]",
      text: "text-[#009B6B]",
      icon: <TrendingUp className="w-5 h-5 text-[#0D3F32]" />
    },
    expense: {
      bg: "bg-[#FEF3E6]",
      text: "text-[#F5C543]",
      icon: <TrendingDown className="w-5 h-5 text-[#0D3F32]" />
    },
    savings: {
      bg: "bg-[#E6F1EC]",
      text: "text-[#0D3F32]",
      icon: <ArrowUpRight className="w-5 h-5 text-[#0D3F32]" />
    }
  }[type];
  
  const { bg, icon } = colorMap;

  return (
    <Card className="p-5 hover:shadow-md transition-shadow rounded-xl border border-[#E6F1EC]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-[#7A7A7A]">{label}</p>
          <p className="text-2xl font-bold text-[#0D3F32] mt-1">
            ₹{amount?.toLocaleString()}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${bg} shadow-sm`}>
          {icon}
        </div>
      </div>
      <div className={`mt-4 text-sm flex items-center ${isPositive ? 'text-[#009B6B]' : 'text-[#F5C543]'}`}>
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 mr-1" />
        ) : (
          <ArrowUpRight className="w-4 h-4 mr-1 transform rotate-180" />
        )}
        {Math.abs(percent)}% {isPositive ? 'increase' : 'decrease'} from last month
      </div>
    </Card>
  );
};

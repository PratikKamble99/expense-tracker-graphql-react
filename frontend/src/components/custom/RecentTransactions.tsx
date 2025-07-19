import { GET_TRANSACTIONS } from "@/graphql/query/transaction.query";
import { useQuery } from "@apollo/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { formatDate } from "@/lib/utils";
import LoadingSpinner from "./Loading";

type Transaction = {
  _id: string | number;
  description: string;
  category: string;
  amount: number;
  paymentType: "cash" | "card";
  date: string;
  location: string | null;
};

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
    header: "Description",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => <span>{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => {
      const amount = info.getValue();
      const isExpense = info.row.original.category.toLowerCase() === 'expense';
      const amountClass = isExpense ? 'text-[#F5C543]' : 'text-[#009B6B]';
      return <span className={`${amountClass} font-medium`}>₹{Math.abs(amount).toFixed(2)}</span>;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("paymentType", {
    header: "Payment Type",
    cell: (info) => (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#E6F1EC] text-[#0D3F32] capitalize">
        {info.getValue()}
      </span>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("location", {
    header: "Location",
    cell: (info) => info.getValue() || "N/A",
    footer: (info) => info.column.id,
  }),
];

const RecentTransactions = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS, {
    variables: {
      input: {
        limit: 5,
      },
    },
  });

  const table = useReactTable({
    data: data?.transactions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="min-h-[250px] rounded-xl p-6 bg-white shadow-sm w-full border border-[#E6F1EC]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Recent Transactions</h2>
        <Link
          to="/transactions"
          className="text-sm text-[#0D3F32] hover:underline transition-colors font-medium"
        >
          View All
        </Link>
      </div>

      <Separator className="bg-[#E6F1EC] mb-4" />

      {/* Table Section */}
      <div className="relative overflow-x-auto rounded-lg border border-[#E6F1EC]">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs uppercase" style={{
            background: 'linear-gradient(to right, #E6F1EC, #F5FAF7)'
          }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wide text-[#0D3F32]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8">
                  <LoadingSpinner className="py-8" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  <span className="text-[#7A7A7A]">No transactions found.</span>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E6F1EC] hover:bg-[#F5FAF7] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 font-medium text-black whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;

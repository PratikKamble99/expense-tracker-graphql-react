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
    cell: (info) => `₹ ${info.getValue().toFixed(2)}`,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("paymentType", {
    header: "Payment Type",
    cell: (info) => <span className="capitalize">{info.getValue()}</span>,
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
    <div className="min-h-[250px] rounded-xl p-6 bg-[#1b1b1b] shadow-lg w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
        <Link
          to="/transactions"
          className="text-sm text-[#04c8b7] hover:underline"
        >
          View More
        </Link>
      </div>

      <Separator className="bg-zinc-600" />

      {/* Table Section */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="uppercase bg-[#292929] text-gray-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-gray-700 w-fit"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wide"
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
                <td colSpan={columns.length} className="py-4 text-center">
                  <span className="text-gray-500">Loading...</span>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  <span className="text-gray-500">No transactions found.</span>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-700 hover:bg-[#2e2e2e] transition duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 whitespace-nowrap text-gray-300"
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

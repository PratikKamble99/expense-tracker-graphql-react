import React, { useState } from "react";
import { Calendar, Pencil, Search, Trash2 } from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { convertMiliSecIntoDate, formatDate } from "@/lib/utils";
import { GET_TRANSACTIONS } from "@/graphql/query/transaction.query";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRANSACTION } from "@/graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import LoadingSpinner from "@/components/custom/Loading";
import { categoryOptions } from "@/components/TransactionForm";
import {
  setTransactionFilterDate,
  setTransactionType,
  useGetTransactionFilterState,
} from "@/context/ZustlandContext";

type Transaction = {
  _id: string;
  description: string;
  category: string;
  amount: number;
  paymentType: "cash" | "card";
  date: string;
  type: string;
  location: number;
  _: React.ReactNode;
};

const columnHelper = createColumnHelper<Transaction>();

const empty = [];

export default function TransactionsPage() {
  const [deleteTransaction, { loading: delLoading, error }] = useMutation(
    DELETE_TRANSACTION,
    { refetchQueries: ["fetchTransactions", "fetchCategoryStatistics"] }
  );

  const state = useGetTransactionFilterState();

  const [filters, setFilters] = useState({
    category: "",
    paymentType: "",
    search: "",
  });

  const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
    null
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const { data, loading } = useQuery(GET_TRANSACTIONS, {
    variables: {
      input: {
        startDate: state.dateRange.startDate,
        endDate: state.dateRange.endDate,
        category: filters.category,
        paymentType: filters.paymentType,
        type: state.transactionTypeFilter,
      },
    },
    // skip:
  });

  const columns = [
    columnHelper.accessor("description", {
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.category, {
      id: "category",
      cell: (info) => <span>{info.getValue()}</span>,
      header: () => <span>Category</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("amount", {
      header: () => "Amount",
      cell: (info) => "₹" + info.renderValue(),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("paymentType", {
      header: () => <span>Payment Method</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("type", {
      header: () => <span>Payment Type</span>,
      footer: (info) => info.column.id,
      cell: (info) => info.getValue() || "N/A",
    }),
    columnHelper.accessor("date", {
      header: "date",
      footer: (info) => info.column.id,
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("location", {
      header: "Location",
      footer: (info) => info.column.id,
      cell: (info) => info.getValue() || "N/A",
    }),
    columnHelper.accessor("_", {
      header: "Action",
      footer: (info) => info.column.id,
      cell: (info) => {
        return (
          <div className="flex items-center gap-x-1">
            <Link
              to={`/transaction/${info.row.original._id}`}
              className="cursor-pointer"
            >
              <Pencil className="h-4" />
            </Link>
            <Trash2
              className="h-5 cursor-pointer text-red-500"
              onClick={() => setOpenDeleteDialogId(info.row.original._id)}
            />
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: data?.transactions || empty,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      pagination,
    },
  });

  async function handleDelete() {
    // Add your delete transaction logic here
    try {
      await deleteTransaction({
        variables: {
          input: openDeleteDialogId,
        },
      });
      toast.success("Transaction deleted successfully");
      setOpenDeleteDialogId(null);
    } catch (error) {
      toast.error(error?.message);
    }
  }

  const totalExpense =
    data?.transactions.reduce((acc, curr) => {
      if (curr.category == "expense") {
        acc += curr.amount;
      }
      return acc;
    }, 0) || 0;

  const totalIncome =
    data?.transactions.reduce((acc, curr) => {
      if (curr.category == "saving") {
        acc += curr.amount;
      }
      return acc;
    }, 0) || 0;

  const totalInvestment =
    data?.transactions.reduce((acc, curr) => {
      if (curr.category == "investment") {
        acc += curr.amount;
      }
      return acc;
    }, 0) || 0;

  const personalExpense =
    data?.transactions.reduce((acc, curr) => {
      if (curr.type?.includes("personal")) {
        acc += curr.amount;
      }
      return acc;
    }, 0) || 0;

  const transferExpense =
    data?.transactions.reduce((acc, curr) => {
      if (curr.type?.includes("transfer")) {
        acc += curr.amount;
      }
      return acc;
    }, 0) || 0;

  const housingExpense =
    data?.transactions.reduce((acc, curr) => {
      if (curr.type?.includes("housing")) {
        acc += curr.amount;
      }
      return acc;
    }, 0) || 0;

  console.log(housingExpense);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const date = DateTime.fromISO(value);
    const millis = date.toMillis();
    setTransactionFilterDate({ ...state.dateRange, [name]: millis });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      paymentType: "",
      search: "",
    });
  };

  return (
    <div className="bg-[#1b1b1b] text-[#868686] min-h-screen p-6 ">
      {/* Filter Section */}
      <div className="bg-[#28282a] p-4  shadow-lg mb-6 rounded-xl">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Search */}
          {/* <div className="flex items-center bg-[#1b1b1b] rounded-md p-2 w-full lg:w-auto">
            <Search className="text-text-primary mr-2" />
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={filters.search}
              onChange={handleFilterChange}
              className="bg-transparent border-none outline-none text-white w-full"
            />
          </div> */}

          {/* Category Filter */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
            <option value="saving">Income</option>
          </select>
          <select
            name="type"
            value={state.transactionTypeFilter}
            onChange={(e) => {
              setTransactionType(e.target.value);
            }}
            className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Payment Type Filter */}
          <select
            name="paymentType"
            value={filters.paymentType}
            onChange={handleFilterChange}
            className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
          >
            <option value="">All Payment Types</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>

          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* <label htmlFor="startDate">
              <Calendar className="text-text-primary" />
            </label> */}
            <div>
              <p>Start Date</p>
              <input
                type="date"
                name="startDate"
                value={convertMiliSecIntoDate(state.dateRange.startDate)}
                onChange={handleDateChange}
                className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <p>End Date</p>
            <input
              type="date"
              name="endDate"
              value={convertMiliSecIntoDate(state.dateRange.endDate)}
              onChange={handleDateChange}
              className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex w-full sm:w-auto justify-end">
            <button
              onClick={clearFilters}
              className="bg-text-primary text-white py-2 px-4 rounded-md sm:self-end"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#28282a] p-4 shadow-lg overflow-x-auto h-[480px] rounded-xl">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="text-text-primary border-b border-[#1b1b1b]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      align="left"
                      scope="col"
                      className="py-2"
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
              {table.getRowCount() <= 0 ? (
                <tr>
                  <td colSpan={6} align="center" className="text-gray-500 py-4">
                    No transactions found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#1b1b1b]">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} scope="row" className="py-2">
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
        )}
      </div>
      <div className="mt-3 flex justify-center sm:justify-end">
        {table.getPageCount() > 1 ? (
          <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px text-sm">
              <li>
                <button
                  className="rounded-s-lg flex items-center justify-center px-3 h-8 leading-tight text-text-primary bg-[#1b1b1b] border border-text-primary disabled:text-opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: table.getPageCount() }, (_, index) => (
                <li key={index}>
                  <button
                    className="flex items-center justify-center px-3 h-8 leading-tight text-text-primary bg-[#1b1b1b] border border-text-primary hover:bg-text-primary hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => {
                      table.setPageIndex(index);
                    }}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className="rounded-e-lg flex items-center justify-center px-3 h-8 leading-tight text-text-primary bg-[#1b1b1b] border border-text-primary disabled:text-opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-6">
        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Total Expense
          </div>
          <div className="text-3xl font-bold text-red-600">
            {totalExpense.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Total Investment
          </div>
          <div className="text-3xl font-bold text-green-500">
            {totalInvestment.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Total Income
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {totalIncome.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-6">
        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Housing Expense
          </div>
          <div className="text-3xl font-bold text-red-600">
            {housingExpense.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Personal Expense
          </div>
          <div className="text-3xl font-bold text-green-500">
            {personalExpense.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Transfer Expense
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {transferExpense.toLocaleString()}
          </div>
        </div>
      </div>

      <Dialog
        open={!!openDeleteDialogId}
        onOpenChange={() => {
          setOpenDeleteDialogId(null);
        }}
      >
        <DialogContent className="rounded-xl sm:max-w-[425px] w-[80%] bg-[#2d2d2d] p-6 shadow-lg transition-all duration-300 transform scale-105">
          <div className="mb-4">
            <div className="flex justify-center mb-4">
              <Trash2 className="w-[50px] h-[50px] text-[#f44336]" />
            </div>
            <DialogDescription className="text-xl text-center text-white">
              Are you sure you want to delete transaction{" "}
              <span className="font-bold text-text-primary">
                {openDeleteDialogId}
              </span>
              ?
            </DialogDescription>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => {
                setOpenDeleteDialogId(null);
              }}
              className="bg-[#1b1b1b] text-text-primary hover:bg-[#333] transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
              onClick={handleDelete}
            >
              {delLoading ? (
                <span className="animate-pulse">Deleting...</span>
              ) : (
                "Yes, I'm sure"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

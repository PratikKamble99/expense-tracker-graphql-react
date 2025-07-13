import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { debounce, formatDate } from "@/lib/utils";
import { GET_TRANSACTIONS } from "@/graphql/query/transaction.query";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRANSACTION } from "@/graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/custom/Loading";
import { categoryOptions } from "@/components/TransactionForm";
import {
  resetTransactionFilter,
  setTransactionFilterDate,
  setTransactionFilterField,
  setTransactionType,
  useGetTransactionFilterState,
} from "@/context/ZustlandContext";
import { Input } from "@/components/ui/input";
import DateSelectorPopover from "@/components/custom/DateSelectPopover";

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
  const navigate = useNavigate();

  const [deleteTransaction, { loading: delLoading }] = useMutation(
    DELETE_TRANSACTION,
    { refetchQueries: ["fetchTransactions", "fetchCategoryStatistics"] }
  );

  const state = useGetTransactionFilterState();

  const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
    null
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const { data, loading, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: {
      input: {
        startDate: state.dateRange.startDate,
        endDate: state.dateRange.endDate,
        category: state.category,
        paymentType: state.paymentType,
        type: state.transactionTypeFilter,
        searchQuery: state.searchQuery,
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
      if (curr.category == "income") {
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

  const totalSaving = totalIncome - totalExpense - totalInvestment;

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransactionFilterField(name as any, value);
  };

  const clearFilters = () => {
    resetTransactionFilter();
  };

  // const handleSearchChange = React.useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  //   setTransactionFilterField("searchQuery", e.target.value);
  // }, 500), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setTransactionFilterField("searchQuery", e.target.value);
  }

  return (
    <div className="bg-[#1b1b1b] text-[#868686] min-h-screen p-6 ">
      {/* Filter Section */}
      <div className="bg-[#28282a] p-4  shadow-lg mb-6 rounded-xl">
        <div className="flex flex-wrap gap-4 items-end">
          <Input 
            placeholder="Search" 
            className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
            value={state.searchQuery}
            onChange={handleSearchChange}
          />
          <DateSelectorPopover 
            dateRange={{
              from: state.dateRange.startDate ? new Date(state.dateRange.startDate) : null,
              to: state.dateRange.endDate ? new Date(state.dateRange.endDate) : null
            }}
            onDateChange={({ from, to }) => {
              setTransactionFilterDate({
                startDate: from?.getTime() || null,
                endDate: to?.getTime() || null
              });
              
              // Reset pagination when date range changes
              setPagination(prev => ({
                ...prev,
                pageIndex: 0
              }));
              
              // Trigger refetch with new date range
              refetch({
                input: {
                  startDate: from?.getTime() || null,
                  endDate: to?.getTime() || null,
                  category: state.category,
                  paymentType: state.paymentType,
                  type: state.transactionTypeFilter,
                  searchQuery: state.searchQuery,
                },
              });
            }}
          />
          
          {/* Category Filter */}
          <select
            name="category"
            value={state.category}
            onChange={handleFilterChange}
            className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
            <option value="income">Income</option>
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
            value={state.paymentType}
            onChange={handleFilterChange}
            className="bg-[#1b1b1b] text-white p-2 rounded-md border border-text-primary w-full sm:w-auto"
          >
            <option value="">All Payment Types</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
          </select>
          
          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="bg-text-primary text-white py-2 px-4 rounded-md sm:self-end"
          >
            Clear Filters
          </button>
          
          <Button
            className="max-w-fit self-end mt-1 sm:mt-0 border"
            onClick={() => navigate("/add-transaction")}
          >
            Add Transactions
          </Button>
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
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-text-primary bg-[#1b1b1b] border border-text-primary hover:bg-text-primary hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                      index == +pagination.pageIndex
                        ? "bg-text-primary text-white"
                        : ""
                    }`}
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
        <div className="flex flex-col items-center sm:items-start bg-[#28282A] rounded-lg p-6 shadow-md w-full sm:w-[30%] text-white">
          <div className="text-2xl font-semibold mb-2 text-text-primary">
            Total Savings
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {totalSaving.toLocaleString()}
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
      <Dialog open={!!openDeleteDialogId} onOpenChange={() => setOpenDeleteDialogId(null)}>
        <DialogContent className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-md w-[95%] mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-white">Delete Transaction</h3>
            <p className="text-sm text-gray-300 text-center">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            
            <div className="flex justify-end w-full gap-3 pt-4 mt-2 border-t border-[#333]">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-[#333] hover:bg-[#2a2a2a] transition-colors"
                onClick={() => setOpenDeleteDialogId(null)}
                disabled={delLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                onClick={handleDelete}
                disabled={delLoading}
              >
                {delLoading ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

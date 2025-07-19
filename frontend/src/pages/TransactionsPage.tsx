import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useMutation, useQuery } from "@apollo/client";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/custom/Loading";
import DateSelectorPopover from "@/components/custom/DateSelectPopover";
import { GET_TRANSACTIONS } from "@/graphql/query/transaction.query";
import { DELETE_TRANSACTION } from "@/graphql/mutations/transaction.mutation";
import {
  useGetTransactionFilterState,
  setTransactionFilterField,
  setTransactionFilterDate,
  resetTransactionFilter,
  setTransactionType
} from "@/context/ZustlandContext";

type Transaction = {
  _id: string;
  description: string;
  category: string;
  amount: number;
  paymentType: "cash" | "card";
  date: string;
  type: string;
  location: string;
};

const empty: Transaction[] = [];

export default function TransactionsPage() {
  const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const state = useGetTransactionFilterState();
  
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [
      "fetchTransactions",
      "fetchCategoryStatistics"
    ],
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
  });

  const columns = [
    {
      accessorKey: "description",
      header: "Description",
      cell: (info: any) => info.getValue(),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info: any) => (
        <span className="capitalize">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info: any) => {
        const amount = info.row.original.amount;
        const isExpense = info.row.original.category === 'expense';
        const amountClass = isExpense ? 'text-[#F5C543]' : 'text-[#009B6B]';
        return <span className={`font-medium ${amountClass}`}>₹{Math.abs(amount).toLocaleString()}</span>;
      },
    },
    {
      accessorKey: "paymentType",
      header: "Payment",
      cell: (info: any) => (
        <span className="px-2 py-1 text-xs rounded-full bg-[#E6F1EC] text-[#0D3F32] capitalize">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info: any) => {
        const dateValue = info.getValue();
        if (!dateValue) return 'N/A';
        const date = new Date(+dateValue);
        return format(date, 'dd MMM yyyy');
      } ,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info: any) => (
        <div className="flex items-center gap-x-2">
          <Link
            to={`/transaction/${info.row.original._id}`}
            className="text-[#0D3F32] hover:text-[#009B6B] transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setOpenDeleteDialogId(info.row.original._id)}
            className="text-[#F5C543] hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.transactions || empty,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  async function handleDelete() {
    setIsDeleting(true);
    try {
      if (!openDeleteDialogId) return;
      await deleteTransaction({
        variables: { input: openDeleteDialogId },
      });
      setOpenDeleteDialogId(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  // Calculate total expense when needed - can be uncommented and used as needed
  // const totalExpense = useMemo(() => {
  //   if (!data?.transactions) return 0;
  //   return data.transactions.reduce((acc, curr) => {
  //     if (curr.category === "expense") {
  //       return acc + curr.amount;
  //     }
  //     return acc;
  //   }, 0);
  // }, [data?.transactions]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'transactionTypeFilter') {
      setTransactionType(value);
    } else if (name === 'category' || name === 'paymentType' || name === 'searchQuery') {
      setTransactionFilterField(name, value);
    }
  };
  const clearFilters = () => {
    resetTransactionFilter();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setTransactionFilterField("searchQuery", e.target.value);
  }

  return (
    <div className="bg-white min-h-screen p-6 pb-14 lg:pb-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Transactions</h1>
        <Link to="/add-transaction">
          <Button className="bg-[#0D3F32] hover:bg-[#0D3F32]/90 text-white">
            Add Transaction
          </Button>
        </Link>
      </div>

            {/* Filter Section */}
            <div className="bg-white p-4 border border-[#E6F1EC] shadow-sm mb-6 rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <Input 
            placeholder="Search transactions..." 
            className="bg-white text-black p-2 rounded-md border border-[#E6F1EC] w-full sm:w-64 focus:ring-2 focus:ring-[#0D3F32] focus:border-transparent"
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
          <select 
            name="category"
            value={state.category}
            onChange={handleFilterChange}
            className="bg-white text-black p-2 rounded-md border border-[#E6F1EC] w-full sm:w-64 focus:ring-2 focus:ring-[#0D3F32] focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="investment">Investment</option>
          </select>
          <select 
            name="paymentType"
            value={state.paymentType}
            onChange={handleFilterChange}
            className="bg-white text-black p-2 rounded-md border border-[#E6F1EC] w-full sm:w-64 focus:ring-2 focus:ring-[#0D3F32] focus:border-transparent"
          >
            <option value="">All Payment Types</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
          <select 
            name="transactionTypeFilter"
            value={state.transactionTypeFilter}
            onChange={handleFilterChange}
            className="bg-white text-black p-2 rounded-md border border-[#E6F1EC] w-full sm:w-64 focus:ring-2 focus:ring-[#0D3F32] focus:border-transparent"
          >
            <option value="">All Transaction Types</option>
            <option value="personal">Personal</option>
            <option value="transfer">Transfer</option>
            <option value="housing">Housing</option>
          </select>
          <Button 
            className="bg-[#0D3F32] hover:bg-[#0D3F32]/90 text-white"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-4 border border-[#E6F1EC] shadow-sm rounded-lg mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner className="text-[#0D3F32]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase" style={{
                background: 'linear-gradient(to right, #E6F1EC, #F5FAF7)'
              }}>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id} 
                        className="px-6 py-3 font-medium text-[#0D3F32]"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <tr 
                      key={row.id}
                      className="border-b border-[#E6F1EC] hover:bg-[#F5FAF7] transition-colors"
                    >
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id}
                          className="px-6 py-4 font-medium"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center text-[#7A7A7A]">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className="mt-6 flex justify-center">
                <nav aria-label="Page navigation">
                  <ul className="inline-flex -space-x-px">
                    <li>
                      <button
                        className="rounded-s-lg flex items-center justify-center px-3 h-8 leading-tight text-[#0D3F32] bg-white border border-[#E6F1EC] hover:bg-[#E6F1EC] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {/* Always show first page */}
                    <li>
                      <button
                        className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                          0 === pagination.pageIndex
                            ? 'bg-[#0D3F32] text-white border-[#0D3F32]'
                            : 'bg-white text-[#0D3F32] border-[#E6F1EC] hover:bg-[#E6F1EC]'
                        }`}
                        onClick={() => table.setPageIndex(0)}
                      >
                        1
                      </button>
                    </li>

                    {/* Show ellipsis if current page is far from start */}
                    {pagination.pageIndex > 2 && (
                      <li className="px-2 flex items-center">
                        <span className="text-[#0D3F32]">...</span>
                      </li>
                    )}

                    {/* Show pages around current page */}
                    {Array.from({ length: Math.min(3, table.getPageCount()) }, (_, i) => {
                      // Calculate page index to show
                      let pageIndex;
                      if (pagination.pageIndex <= 1) {
                        pageIndex = i + 1;
                      } else if (pagination.pageIndex >= table.getPageCount() - 2) {
                        pageIndex = table.getPageCount() - 3 + i;
                      } else {
                        pageIndex = pagination.pageIndex - 1 + i;
                      }

                      // Skip if out of bounds or already shown
                      if (pageIndex <= 0 || pageIndex >= table.getPageCount() - 1) {
                        return null;
                      }

                      return (
                        <li key={pageIndex}>
                          <button
                            className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                              pageIndex === pagination.pageIndex
                                ? 'bg-[#0D3F32] text-white border-[#0D3F32]'
                                : 'bg-white text-[#0D3F32] border-[#E6F1EC] hover:bg-[#E6F1EC]'
                            }`}
                            onClick={() => table.setPageIndex(pageIndex)}
                          >
                            {pageIndex + 1}
                          </button>
                        </li>
                      );
                    })}

                    {/* Show ellipsis if current page is far from end */}
                    {pagination.pageIndex < table.getPageCount() - 3 && (
                      <li className="px-2 flex items-center">
                        <span className="text-[#0D3F32]">...</span>
                      </li>
                    )}

                    {/* Always show last page if there's more than one page */}
                    {table.getPageCount() > 1 && (
                      <li>
                        <button
                          className={`flex items-center justify-center px-3 h-8 leading-tight border ${
                            table.getPageCount() - 1 === pagination.pageIndex
                              ? 'bg-[#0D3F32] text-white border-[#0D3F32]'
                              : 'bg-white text-[#0D3F32] border-[#E6F1EC] hover:bg-[#E6F1EC]'
                          }`}
                          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        >
                          {table.getPageCount()}
                        </button>
                      </li>
                    )}
                    
                    <li>
                      <button
                        className="rounded-e-lg flex items-center justify-center px-3 h-8 leading-tight text-[#0D3F32] bg-white border border-[#E6F1EC] hover:bg-[#E6F1EC] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      { !!openDeleteDialogId && <Dialog 
        open={!!openDeleteDialogId}
        onOpenChange={(open) => !open && setOpenDeleteDialogId(null)}
      >
        <DialogContent className="p-6">
          <h2 className="text-lg font-bold text-black mb-4">Delete Transaction</h2>
          <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this transaction?</p>
          <div className="flex justify-end gap-x-4">
            <Button 
              className="bg-white text-black border border-[#E6F1EC] hover:bg-[#F5FAF7] transition-colors"
              onClick={() => setOpenDeleteDialogId(null)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#F5C543] hover:bg-[#F5C543]/90 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>}
    </div>
  );
}

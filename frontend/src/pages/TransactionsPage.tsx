import { Separator } from "@/components/ui/separator";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "@/graphql/query/transaction.query";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";

type Transaction = {
  description: string;
  category: string;
  amount: number;
  paymentType: "cash" | "card";
  date: string;
  location: number;
};

const columnHelper = createColumnHelper<Transaction>();

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
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("paymentType", {
    header: () => <span>PaymentType</span>,
    footer: (info) => info.column.id,
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
];

const FilterButton = ({
  label,
  date,
  onClick,
  selectedOption,
}: {
  label: string;
  date: any;
  selectedOption: number;
  onClick: () => void;
}) => {
  return (
    <Button
      className={`p-2  rounded-md ${
        date.dateOptionValue == selectedOption ? "bg-[#262626]" : ""
      } cursor-pointer hover:bg-[#262626]`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

const TransactionsPage = () => {
  const [date, setDate] = useState({
    dateOptionValue: 1,
    startDate: DateTime.now().startOf("day").toMillis(),
    endDate: DateTime.now().endOf("day").toMillis(),
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const { data, loading } = useQuery(GET_TRANSACTIONS, {
    variables: {
      input: date.dateOptionValue
        ? {
            startDate: date.startDate,
            endDate: date.endDate,
          }
        : null,
    },
    // skip:
  });

  console.log(data, "transactions");

  const table = useReactTable({
    data: data?.transactions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      pagination,
    },
  });

  return (
    <div className="flex mt-2 px-8 py-4 h-full bg-black ">
      <div className=" flex-grow rounded-xl p-4 bg-[#1B1B1B]">
        <p className="text-3xl font-bold">Transactions</p>
        <Separator className="my-4 bg-zinc-600" />
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="Todays"
            date={date}
            selectedOption={1}
            onClick={() => {
              setDate({
                dateOptionValue: 1,
                startDate: DateTime.now().startOf("day").toMillis(),
                endDate: DateTime.now().endOf("day").toMillis(),
              });
            }}
          />
          <FilterButton
            label="This week"
            date={date}
            selectedOption={2}
            onClick={() => {
              setDate({
                dateOptionValue: 2,
                startDate: DateTime.local().startOf("week").toMillis(),
                endDate: DateTime.local().endOf("week").toMillis(),
              });
            }}
          />
          <FilterButton
            label="This month"
            date={date}
            selectedOption={3}
            onClick={() => {
              setDate({
                dateOptionValue: 3,
                startDate: DateTime.local().startOf("month").toMillis(),
                endDate: DateTime.local().endOf("month").toMillis(),
              });
            }}
          />
          <FilterButton
            label="This year"
            date={date}
            selectedOption={4}
            onClick={() => {
              setDate({
                dateOptionValue: 4,
                startDate: DateTime.local().startOf("year").toMillis(),
                endDate: DateTime.local().endOf("year").toMillis(),
              });
            }}
          />
          <Button
            className={`p-2  rounded-md ${
              !date.dateOptionValue ? "bg-[#262626]" : ""
            } cursor-pointer hover:bg-[#262626]`}
            onClick={() => {
              setDate((prev) => ({
                ...prev,
                dateOptionValue: 0,
              }));
            }}
          >
            All Expenses
          </Button>
        </div>
        <Separator className="my-4 bg-zinc-600" />
        <div>
          <div className="p-2">
            {loading ? (
              <Skeleton className="h-screen w-full bg-zinc-700"></Skeleton>
            ) : (
              <div className=" flex flex-col justify-between">
                <div className="w-[300px] sm:w-full relative overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="uppercase">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="border-b">
                          {headerGroup.headers.map((header) => (
                            <th key={header.id} align="left" scope="col" className="py-2">
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
                      {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} scope="row" className="py-2">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex justify-center sm:justify-end">
                  {table.getPageCount() > 1 ? (
                    <nav aria-label="Page navigation example">
                      <ul className="inline-flex -space-x-px text-sm">
                        <li>
                          <button
                            className="rounded-s-lg flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 disabled:text-opacity-50 "
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from(
                          { length: table.getPageCount() },
                          (_, index) => (
                            <li>
                              <button
                                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                onClick={() => {
                                  console.log(index, "index");
                                  table.setPageIndex(index);
                                }}
                              >
                                {index + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li>
                          <button
                            className=" rounded-e-lg flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300  disabled:text-opacity-50 "
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;

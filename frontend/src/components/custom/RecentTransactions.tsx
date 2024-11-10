import { GET_TRANSACTIONS } from "@/graphql/query/transaction.query";
import { columns } from "@/pages/TransactionsPage";
import { useQuery } from "@apollo/client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { table } from "console";
import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";

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
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-xl p-4 bg-[#1B1B1B]">
      <div className="flex justify-between">
        <p className="text-xl  font-bold">Recent 5 Transactions</p>
        <p className="underline">
          <Link to={"/transactions"}>view more</Link>
        </p>
      </div>
      <Separator className="mt-4 bg-zinc-600" />
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;

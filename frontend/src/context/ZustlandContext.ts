import { getDateRangeBasedOnFilter } from "@/lib/utils";
import { create } from "zustand";

type TValue = {
  transactionTypeFilter: string;
  dateRange: {
    startDate: null | number;
    endDate: null | number;
  };
  category: string;
  paymentType: string;
};

const transactionsStateStore = create<TValue>(() => ({
  transactionTypeFilter: "",
  dateRange: {
    ...getDateRangeBasedOnFilter("this-month"),
  },
  category: "",
  paymentType: "",
}));

export function useGetTransactionFilterState() {
  return transactionsStateStore((s) => s);
}

export function setTransactionType(type: TValue["transactionTypeFilter"]) {
  return transactionsStateStore.setState({ transactionTypeFilter: type });
}

export function setTransactionFilterDate(dateRange: TValue["dateRange"]) {
  return transactionsStateStore.setState({ dateRange });
}

export function setTransactionFilterField(
  name: "category" | "paymentType",
  value: TValue["category"] | TValue["paymentType"]
) {
  return transactionsStateStore.setState({ [name]: value });
}

export function resetTransactionFilter() {
  return transactionsStateStore.setState({
    transactionTypeFilter: "",
    dateRange: {
      ...getDateRangeBasedOnFilter("this-month"),
    },
    category: "",
    paymentType: "",
  });
}

import { getDateRangeBasedOnFilter } from "@/lib/utils";
import { create } from "zustand";

type TValue = {
  transactionTypeFilter: string;
  dateRange: {
    startDate: null | number;
    endDate: null | number;
  };
};

const editorStateStore = create<TValue>(() => ({
  transactionTypeFilter: "",
  dateRange: {
    ...getDateRangeBasedOnFilter("this-month"),
  },
}));

export function useGetTransactionFilterState() {
  return editorStateStore((s) => s);
}

export function setTransactionType(type: TValue["transactionTypeFilter"]) {
  return editorStateStore.setState({ transactionTypeFilter: type });
}

export function setTransactionFilterDate(dateRange: TValue["dateRange"]) {
  return editorStateStore.setState({ dateRange });
}

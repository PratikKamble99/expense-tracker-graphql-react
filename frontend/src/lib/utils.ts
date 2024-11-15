import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(timestamp: string) {
  const date = new Date(parseInt(timestamp)); // Parse the timestamp to ensure it's an integer representing milliseconds
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export function getDateRangeBasedOnFilter(filter: string | null) {
  switch (filter) {
    case "today":
      return {
        dateOptionValue: 1,
        startDate: DateTime.now().startOf("day").toMillis(),
        endDate: DateTime.now().endOf("day").toMillis(),
      };

    case "this-week":
      return {
        dateOptionValue: 2,
        startDate: DateTime.local().startOf("week").toMillis(),
        endDate: DateTime.local().endOf("week").toMillis(),
      };

    case "this-month":
      return {
        dateOptionValue: 3,
        startDate: DateTime.local().startOf("month").toMillis(),
        endDate: DateTime.local().endOf("month").toMillis(),
      };

    case "this-year":
      return {
        dateOptionValue: 4,
        startDate: DateTime.local().startOf("year").toMillis(),
        endDate: DateTime.local().endOf("year").toMillis(),
      };

    case "all-time":
      return {
        dateOptionValue: 0,
        startDate: null,
        endDate: null,
      };

    default:
      return null;
  }
}

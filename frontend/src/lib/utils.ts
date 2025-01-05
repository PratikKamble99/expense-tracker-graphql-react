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
        // dateOptionValue: 1,
        startDate: DateTime.now().startOf("day").toMillis(),
        endDate: DateTime.now().endOf("day").toMillis(),
      };

    case "this-week":
      return {
        // dateOptionValue: 2,
        startDate: DateTime.local().startOf("week").toMillis(),
        endDate: DateTime.local().endOf("week").toMillis(),
      };

    case "this-month":
      return {
        // dateOptionValue: 3,
        startDate: DateTime.local().startOf("month").toMillis(),
        endDate: DateTime.local().endOf("month").toMillis(),
      };

    case "this-year":
      return {
        // dateOptionValue: 4,
        startDate: DateTime.local().startOf("year").toMillis(),
        endDate: DateTime.local().endOf("year").toMillis(),
      };

    case "all-time":
      return {
        // dateOptionValue: 0,
        startDate: null,
        endDate: null,
      };

    default:
      return null;
  }
}

export function convertMiliSecIntoDate(millis: number) {
  return DateTime.fromMillis(millis).toISODate() || "";
}

export function getYearsFromBirth(birthYear: number) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = birthYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}

export function getWeekOptions() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get the first and last days of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Array to store the week options
  const weekOptions = [];

  // Generate week options
  const startOfWeek = new Date(firstDayOfMonth);
  let weekIndex = 1;

  while (startOfWeek <= lastDayOfMonth) {
    // Calculate end of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    // Ensure the week doesn't exceed the month
    const formattedStart = new Date(
      Math.max(startOfWeek, firstDayOfMonth)
    ).toLocaleDateString(undefined, { day: "2-digit", month: "short" });

    const formattedEnd = new Date(
      Math.min(endOfWeek, lastDayOfMonth)
    ).toLocaleDateString(undefined, { day: "2-digit", month: "short" });

    // Add the option
    weekOptions.push({
      label: `Week ${weekIndex} (${formattedStart} - ${formattedEnd})`,
      value: `week-${weekIndex}`,
    });

    // Move to the next week
    startOfWeek.setDate(startOfWeek.getDate() + 7);
    weekIndex++;
  }

  // Identify "This Week" and "Last Week"
  // const thisWeekIndex = Math.ceil(today.getDate() / 7);
  // const lastWeekIndex = thisWeekIndex > 1 ? thisWeekIndex - 1 : null;

  // const selectOptions = weekOptions.map((option, index) => {
  //   if (index + 1 === thisWeekIndex) {
  //     return { ...option, label: `This Week (${option.label})` };
  //   } else if (index + 1 === lastWeekIndex) {
  //     return { ...option, label: `Last Week (${option.label})` };
  //   }
  //   return option;
  // });

  return weekOptions;
}

export function getCurrentMonthDays() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  console.log(today, "today");

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  // Array to store options
  const selectOptions = [];

  // Today
  selectOptions.push({
    label: `Today (${today.toDateString()})`,
    value: "today",
  });

  // Yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (yesterday.getMonth() === currentMonth) {
    selectOptions.push({
      label: `Yesterday (${yesterday.toDateString()})`,
      value: "yesterday",
    });
  }

  // All days before yesterday
  if (yesterday > firstDayOfMonth) {
    const allDaysBeforeYesterday = [];
    const day = new Date(firstDayOfMonth);
    console.log(day, "day");
    while (day < yesterday) {
      allDaysBeforeYesterday.push(day.toDateString());
      day.setDate(day.getDate() + 1);
    }
    selectOptions.push({
      label: `All Days Before Yesterday (${allDaysBeforeYesterday.length} days)`,
      value: "before-yesterday",
      details: allDaysBeforeYesterday, // Optional, for debugging or display purposes
    });
  }

  return selectOptions;
}

import {
  GET_CATEGORY_STATISTICS,
  GET_TRANSACTIONS,
} from "@/graphql/query/transaction.query";
import { useQuery } from "@apollo/client";
import { DateTime } from "luxon";

import { Separator } from "../ui/separator";
import Chart from "react-apexcharts";
import { getYearsFromBirth } from "@/lib/utils";
import React from "react";

const ChartRepresentation = () => {
  const currentYear = DateTime.now().year;

  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const { data } = useQuery(GET_TRANSACTIONS, {
    variables: {
      input: {
        startDate: DateTime.local(selectedYear, 1, 1)
          .startOf("year")
          .toMillis(),
        endDate: DateTime.local(selectedYear, 12, 31).endOf("year").toMillis(),
      },
    },
  });

  const { data: statisticsData } = useQuery(GET_CATEGORY_STATISTICS);

  let obj = {};

  const totalIncome =
    statisticsData?.categoryStatistics.reduce((acc, curr) => {
      if (curr.category == "income") {
        acc += curr.totalAmount;
      }
      return acc;
    }, 0) || 0;

  data?.transactions.forEach((item) => {
    const month = DateTime.fromMillis(+item.date).toFormat("MMM");
    const amount = item.amount;

    if (obj[month]) {
      const expense = item["category"] == "expense" ? amount : 0;
      const saving =
        item["category"] == "saving" || item["category"] == "income"
          ? amount
          : 0;

      obj[month].expense += expense;
      obj[month].saving += saving;
    } else {
      const expense = item["category"] == "expense" ? amount : 0;
      const saving = item["category"] == "saving" ? amount : 0;
      obj[month] = { expense: expense, saving: saving };
    }
  });

  // do minus month saving and expense and set ot to month saving
  Object.keys(obj).forEach((month) => {
    obj[month]["Income"] = obj[month].saving;
    obj[month].saving -= obj[month].expense;
  });

  console.log(statisticsData)

  const backgroundColor = statisticsData?.categoryStatistics.map((state) => {
    if (state.category == "expense") return "#FF6B6B";
    if (state.category == "saving") return "#F5C543";
    if (state.category == "investment") return "#009B6B";
    if (state.category == "income") return "#0D3F32";
    return "#FF6B6B";
  });

  const dataKeys = Object.keys(obj);
  const bars = [ "Income", "expense", "saving",];

  const barChartDataConsumption = bars.map((type, index) => ({
    name: type,
    data: dataKeys.map((key) => {
      return obj[key][type];
    }),
  }));

  // const barChartDataConsumption = []

  const barChartOptionsConsumption = {
    chart: {
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: dataKeys,
      show: false,
      labels: {
        show: true,
        style: {
          colors: "#0D3F32",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      color: "white",
      labels: {
        show: true,
        formatter: (value) => {
          return value + " ₹";
        },
        style: {
          colors: "#0D3F32",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
      axisBorder: {
        show: false,
        color: "gray",
        offsetX: 0,
        offsetY: 0,
      },
    },

    grid: {
      borderColor: "rgba(163, 174, 208, 0.3)",
      show: true,
      yaxis: {
        lines: {
          show: true,
          opacity: 0.5,
        },
      },
      row: {
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      type: "solid",
      colors: [
        "#0D3F32",
        "#F5C543",
        "#009B6B",

      ],
    },
    legend: {
      show: true,
      labels: {
        colors: undefined,
        useSeriesColors: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "20px",
      },
    },
    noData: {
      text: "bvacsgvsgvshs",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
  };

  const noDataFound = barChartDataConsumption.every(
    (item) => item.data.length == 0
  );


  return (
    <div className="rounded-xl mt-0 lg:mt-6  flex flex-col lg:flex-row gap-2">
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <div className="flex justify-between pr-4">
            <p className="text-xl font-bold ">Monthly Report</p>
            <select
              className="bg-[#E6F1EC] text-[#0D3F32] rounded-lg px-2 ring-0 focus:ring-0 focus:ring-[#0D3F32] outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(+e.target.value)}
            >
              {[
                ...getYearsFromBirth(2000).map((year) => ({
                  label: year,
                  value: year,
                })),
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Separator className="mt-4 bg-[#009B6B]" />
        </div>
        <div className="flex-1 flex">
          <div
            className={`h-[360px] flex-1 self-center ${
              barChartDataConsumption.length <= 0
                ? "flex items-center justify-center"
                : ""
            }`}
          >
            {noDataFound ? (
              <div className="h-full flex justify-center items-center">
                <p className="text-gray-500">No Transactions found</p>
              </div>
            ) : (
              <Chart
                options={barChartOptionsConsumption}
                series={barChartDataConsumption}
                type="bar"
                width="100%"
                height="100%"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 pt-2 sm:pt-0">
        <div className="p-4">
          <p className="text-xl font-bold">
            Overall Report: {totalIncome} (Income)
          </p>
          <Separator className="mt-4 bg-[#009B6B]" />
        </div>
        <div
          className={`flex-1 items-center self-center ${
            statisticsData?.categoryStatistics.length ? "pt-6" : ""
          } min-h-[360px]`}
        >
          {statisticsData?.categoryStatistics.length > 0 ? (
            <div className="h-[360px]">
              <Chart
                options={{
                  labels:
                    statisticsData?.categoryStatistics.map(
                      (item) => item.category
                    ) || [],
                  colors: backgroundColor,
                  legend: {
                    show: true,
                    position: "top",
                    labels: {
                      colors: "white",
                      useSeriesColors: true,
                    },
                  },
                }}
                series={
                  statisticsData?.categoryStatistics.map(
                    (item) => item.totalAmount
                  ) || []
                }
                type="donut"
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div className="h-full flex justify-center items-center min-h-[360px]">
              <p className="text-gray-500">No Transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartRepresentation;

import {
  GET_CATEGORY_STATISTICS,
  GET_TRANSACTIONS,
} from "@/graphql/query/transaction.query";
import { useQuery } from "@apollo/client";
import { DateTime } from "luxon";

import { Separator } from "../ui/separator";
import Chart from "react-apexcharts";

const ChartRepresentation = () => {
  const { data, loading } = useQuery(GET_TRANSACTIONS, {
    variables: {
      input: {
        startDate: DateTime.local().startOf("year").toMillis(),
        endDate: DateTime.local().endOf("year").toMillis(),
      },
    },
  });

  const { data: statisticsData } = useQuery(GET_CATEGORY_STATISTICS);

  let obj = {};

  data?.transactions.forEach((item) => {
    const month = DateTime.fromMillis(+item.date).toFormat("MMMM");
    const amount = item.amount;

    if (obj[month]) {
      const expense = item["category"] == "expense" ? amount : 0;
      const saving = item["category"] == "saving" ? amount : 0;

      obj[month].expense += expense;
      obj[month].saving += saving;
    } else {
      const expense = item["category"] == "expense" ? amount : 0;
      const saving = item["category"] == "saving" ? amount : 0;
      obj[month] = { expense: expense, saving: saving };
    }
  });

  const backgroundColor = statisticsData?.categoryStatistics.map((state) => {
    if (state.category == "expense") return "rgba(255, 99, 132)";
    if (state.category == "saving") return "rgba(75, 192, 192)";
    if (state.category == "investment") return "rgba(54, 162, 235)";
  });

  const dataKeys = Object.keys(obj);
  const bars = ["saving", "expense"];

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
          colors: "#A3AED0",
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
          colors: "#ffffff",
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
      colors: ["rgba(75, 192, 192)", "rgba(255, 99, 132)"],
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
  };

  return (
    <div className="rounded-xl p-4 bg-[#1B1B1B] mt-6  flex flex-col lg:flex-row gap-2">
      <div className="flex-1 flex flex-col">
        <div>
          <p className="text-xl font-bold">Monthly Report</p>
          <Separator className="mt-4 bg-zinc-600" />
        </div>
        <div className="flex-1 flex">
          <div className={`h-[360px] flex-1 self-center ${barChartDataConsumption.length <= 0 ? 'flex items-center justify-center' :''}`}>
            {barChartDataConsumption.length <= 0 ? <p className="text-lg font-semibold">No Transactions found</p> :
            <Chart
              options={barChartOptionsConsumption}
              series={barChartDataConsumption}
              type="bar"
              width="100%"
              height="100%"
            />}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 pt-2 sm:pt-0">
        <div>
          <p className="text-xl font-bold">Overall Report</p>
          <Separator className="mt-4 bg-zinc-600" />
        </div>
        <div className="flex-1 items-center self-center pt-6">
          {statisticsData?.categoryStatistics.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartRepresentation;

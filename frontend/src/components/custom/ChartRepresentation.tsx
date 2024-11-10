import {
  GET_CATEGORY_STATISTICS,
  GET_TRANSACTIONS,
} from "@/graphql/query/transaction.query";
import { useQuery } from "@apollo/client";
import { DateTime } from "luxon";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis,
} from "victory";
import { Separator } from "../ui/separator";
import { Doughnut } from "react-chartjs-2";

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

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxHeight: 20,
          boxWidth: 20,
        },
      },
    },
  };

  const chartData = {
    labels:
      statisticsData?.categoryStatistics.map((item) => item.category) || [],
    datasets: [
      {
        label: "%",
        data:
          statisticsData?.categoryStatistics.map((item) => item.totalAmount) ||
          [],
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
        borderRadius: 30,
        spacing: 10,
        cutout: 130,
      },
    ],
  };

  const dataKeys = Object.keys(obj);
  const bars = ["saving", "expense"];
  const colors = ["rgba(75, 192, 192)", "rgba(255, 99, 132)"];

  return (
    <div className="rounded-xl p-4 bg-[#1B1B1B] mt-6  flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <p className="text-xl font-bold">Monthly Report</p>
        <Separator className="mt-4 bg-zinc-600" />
        <div>
          <VictoryChart
            padding={{ top: 20, bottom: 40, left: 60, right: 40 }}
            theme={VictoryTheme.clean}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => tick + " ₹"}
              style={{
                axis: {
                  stroke: "",
                },
                tickLabels: {
                  fill: "white", //CHANGE COLOR OF X-AXIS LABELS
                },
                grid: {
                  stroke: "gray", //CHANGE COLOR OF X-AXIS GRID LINES
                },
              }}
            />
            <VictoryAxis
              style={{
                axis: {
                  stroke: "gray",
                },
                tickLabels: {
                  fill: "white",
                },
              }}
            />
            <VictoryGroup offset={20} style={{ data: { width: 15 } }}>
              {/* 
              {Object.keys(obj).map((key, index) => {
              return (
                <VictoryBar
                  data={Object.keys(obj).map((item, i) => ({
                    x: item,
                    y: index == 0 ? obj[item].saving : obj[item].expense,
                  }))}
                  labelComponent={<VictoryTooltip />}
                  labels={({ datum }) => {
                    console.log(datum);
                    return datum.y;
                  }}
                  style={{
                    data: {
                      fill:
                        index == 0
                          ? "rgba(75, 192, 192)"
                          : "rgba(255, 99, 132)",
                      fillOpacity: 1,
                      // stroke: "#c43a31",
                      strokeWidth: 2,
                    },
                    labels: {
                      fontSize: 12,
                      fill: "#c43a31",
                    },
                  }}
                />
              );
            })}
            */}
              {/* OPTIMIZE VERSION OF ABOVE CODE */}
              {bars.map((type, index) => (
                <VictoryBar
                  key={type}
                  data={dataKeys.map((key) => ({
                    x: key,
                    y: obj[key][type],
                  }))}
                  labelComponent={<VictoryTooltip />}
                  labels={({ datum }) => {
                    console.log(datum);
                    return type + ": " + datum.y + " ₹";
                  }}
                  style={{
                    data: {
                      fill: colors[index],
                      fillOpacity: 1,
                      strokeWidth: 2,
                    },
                    labels: {
                      fontSize: 12,
                      fill: "black",
                    },
                  }}
                />
              ))}
            </VictoryGroup>
          </VictoryChart>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div>
          <p className="text-xl font-bold">Overall Report</p>
          <Separator className="mt-4 bg-zinc-600" />
        </div>
        <div className="flex-1 items-center self-center h-[360px] w-[330px] md:h-[360px] md:w-[360px] pt-6">
          {statisticsData?.categoryStatistics.length > 0 && (
            <Doughnut data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartRepresentation;

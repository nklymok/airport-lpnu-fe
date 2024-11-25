import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const PriceHistoryChart = ({
  priceHistory,
}: {
  priceHistory: {
    historyByClass: {
      [classType: string]: {
        price: number;
        timestamp: string;
      }[];
    };
  };
}) => {
  // Step 1: Collect all unique dates
  const allDatesSet = new Set<string>();

  Object.values(priceHistory.historyByClass).forEach((history) => {
    history.forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      allDatesSet.add(date);
    });
  });

  const allDates = Array.from(allDatesSet).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Step 2: Build chartData array
  const chartData = allDates.map((date) => {
    const dataPoint: { date: string; [key: string]: number | null | string } = {
      date,
    };
    Object.entries(priceHistory.historyByClass).forEach(
      ([classType, history]) => {
        const entry = history.find(
          (e) => new Date(e.timestamp).toLocaleDateString() === date
        );
        if (entry) {
          dataPoint[classType] = entry.price;
        } else {
          dataPoint[classType] = null; // No data for this date
        }
      }
    );
    return dataPoint;
  });

  // Define colors for different class types
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  // Step 3: Render the chart
  return (
    <div>
      <h2 className="text-xl font-semibold mt-4">Price History Per Class</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={0} interval={0} />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(priceHistory.historyByClass).map((classType, index) => (
            <Line
              key={classType}
              type="monotone"
              dataKey={classType}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

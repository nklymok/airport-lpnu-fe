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
  return (
    <div>
      <h2 className="text-xl font-semibold mt-4">Price History Per Class</h2>
      {Object.entries(priceHistory.historyByClass).map(
        ([classType, history]) => {
          // Transform the history data for the chart
          const chartData = history.map((entry) => ({
            date: new Date(entry.timestamp).toLocaleDateString(),
            price: entry.price,
          }));

          return (
            <div key={classType} className="mt-6">
              <h3 className="text-lg font-medium">{classType}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        }
      )}
    </div>
  );
};

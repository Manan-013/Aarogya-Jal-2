"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🔹 Mock alert trend data
const alertTrendData = [
  { date: "2025-09-01", alerts: 2 },
  { date: "2025-09-02", alerts: 4 },
  { date: "2025-09-03", alerts: 1 },
  { date: "2025-09-04", alerts: 3 },
  { date: "2025-09-05", alerts: 5 },
];

const AlertTrendsChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={alertTrendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="alerts" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AlertTrendsChart;

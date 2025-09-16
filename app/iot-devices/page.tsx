"use client";

import React, { useState } from "react";
import { Droplet, Thermometer, Waves, Activity, Gauge } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Device = {
  id: string;
  name: string;
  status: "active" | "inactive" | "maintenance";
  lastReading: string;
  metrics: {
    ph: number;
    tds: string;
    turbidity: string;
    temp: string;
    odour: string;
  };
  data: {
    time: string;
    ph: number;
    turbidity: number;
    temp: number;
  }[];
};

const devices: Device[] = [
  {
    id: "WQ-004",
    name: "Pasighat, Arunachal Pradesh",
    status: "active",
    lastReading: "15/01/2024, 16:02:00",
    metrics: {
      ph: 7.4,
      tds: "320 ppm",
      turbidity: "1.2 NTU",
      temp: "22.8°C",
      odour: "1/10",
    },
    data: [
      { time: "15:42", ph: 7.5, turbidity: 1.2, temp: 23 },
      { time: "15:43", ph: 7.8, turbidity: 2.0, temp: 24 },
      { time: "15:44", ph: 7.3, turbidity: 1.4, temp: 22.5 },
      { time: "15:45", ph: 8.0, turbidity: 2.5, temp: 25 },
      { time: "15:46", ph: 7.6, turbidity: 1.6, temp: 23.5 },
    ],
  },
  {
    id: "WQ-001",
    name: "Aizawl, Mizoram",
    status: "active",
    lastReading: "15/01/2024, 15:58:00",
    metrics: {
      ph: 7.2,
      tds: "280 ppm",
      turbidity: "1.5 NTU",
      temp: "21.5°C",
      odour: "2/10",
    },
    data: [
      { time: "15:42", ph: 6.9, turbidity: 1.1, temp: 20.5 },
      { time: "15:43", ph: 7.3, turbidity: 2.0, temp: 22 },
      { time: "15:44", ph: 7.1, turbidity: 1.5, temp: 21 },
      { time: "15:45", ph: 7.6, turbidity: 2.2, temp: 23 },
      { time: "15:46", ph: 7.0, turbidity: 1.4, temp: 21.5 },
    ],
  },
  {
    id: "WQ-002",
    name: "Majuli, Assam",
    status: "active",
    lastReading: "15/01/2024, 15:55:00",
    metrics: {
      ph: 7.6,
      tds: "300 ppm",
      turbidity: "1.0 NTU",
      temp: "23.5°C",
      odour: "0/10",
    },
    data: [
      { time: "15:42", ph: 7.0, turbidity: 0.8, temp: 22 },
      { time: "15:43", ph: 7.8, turbidity: 1.6, temp: 23.5 },
      { time: "15:44", ph: 7.5, turbidity: 1.2, temp: 22.8 },
      { time: "15:45", ph: 8.2, turbidity: 1.9, temp: 24 },
      { time: "15:46", ph: 7.3, turbidity: 1.0, temp: 23 },
    ],
  },
  {
    id: "WQ-003",
    name: "Churachandpur, Manipur",
    status: "inactive",
    lastReading: "15/01/2024, 15:50:00",
    metrics: {
      ph: 6.8,
      tds: "400 ppm",
      turbidity: "2.5 NTU",
      temp: "20.8°C",
      odour: "3/10",
    },
    data: [
      { time: "15:42", ph: 6.5, turbidity: 2.0, temp: 20 },
      { time: "15:43", ph: 6.9, turbidity: 2.6, temp: 21 },
      { time: "15:44", ph: 6.7, turbidity: 2.3, temp: 20.5 },
      { time: "15:45", ph: 7.1, turbidity: 2.8, temp: 21.2 },
      { time: "15:46", ph: 6.6, turbidity: 2.4, temp: 20.6 },
    ],
  },
  {
    id: "WQ-005",
    name: "Tura, Meghalaya →",
    status: "maintenance",
    lastReading: "15/01/2024, 15:45:00",
    metrics: {
      ph: 7.0,
      tds: "350 ppm",
      turbidity: "1.8 NTU",
      temp: "22.0°C",
      odour: "1/10",
    },
    data: [
      { time: "15:42", ph: 6.8, turbidity: 1.2, temp: 21 },
      { time: "15:43", ph: 7.4, turbidity: 2.1, temp: 22.2 },
      { time: "15:44", ph: 7.1, turbidity: 1.7, temp: 22.5 },
      { time: "15:45", ph: 7.7, turbidity: 2.3, temp: 23 },
      { time: "15:46", ph: 7.0, turbidity: 1.5, temp: 22 },
    ],
  },
];

export default function IoTDevicesPage() {
  const [selected, setSelected] = useState<Device>(devices[0]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          IoT Device Management
        </h1>
        <p className="text-gray-600">
          Monitor health and real-time data from water quality sensors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Device List</h2>
          <input
            placeholder="Search by ID or location..."
            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg text-sm placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"

          />

      <div className="space-y-2">
  {devices.map((d) => (
    <div
      key={d.id}
      onClick={() => setSelected(d)}
      className={`p-3 rounded-lg cursor-pointer border flex justify-between items-center transition ${
        selected.id === d.id
          ? "bg-blue-50 border-blue-200"
          : "hover:bg-black-100"
      }`}
    >
      <div>
        {/* Device Name */}
        <div className="font-semibold text-gray-900">{d.name}</div>
        {/* Device ID */}
        <div className="text-sm text-gray-700">{d.id}</div>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${
          d.status === "active"
            ? "bg-green-100 text-green-700"
            : d.status === "inactive"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {d.status}
      </span>
    </div>
  ))}
</div>

        </div>

        {/* Device Details + Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Info */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selected.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Last reading: {selected.lastReading}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  selected.status === "active"
                    ? "bg-green-100 text-green-700"
                    : selected.status === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selected.status}
              </span>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Droplet className="w-5 h-5 text-blue-500 bg-blue-100 p-1 rounded-full" />
                {selected.metrics.ph} pH
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Activity className="w-5 h-5 text-purple-500 bg-purple-100 p-1 rounded-full" />
                {selected.metrics.tds} TDS
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Waves className="w-5 h-5 text-cyan-500 bg-cyan-100 p-1 rounded-full" />
                {selected.metrics.turbidity} Turbidity
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Thermometer className="w-5 h-5 text-orange-500 bg-orange-100 p-1 rounded-full" />
                {selected.metrics.temp}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Gauge className="w-5 h-5 text-pink-500 bg-pink-100 p-1 rounded-full" />
                {selected.metrics.odour} Odour
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white rounded-xl shadow p-4 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Real-time Sensor Data
            </h2>

            {/* pH & Turbidity */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="ph"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="turbidity"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#f59e0b" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

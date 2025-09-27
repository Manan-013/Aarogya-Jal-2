"use client";

import React, { useState, useMemo } from "react";
import { Droplet, Thermometer, Waves, Activity, Gauge, HardDrive } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// -------- TYPES --------
type DeviceMetrics = {
  ph: number;
  tds: string;
  turbidity: string;
  temp: string;
  odour: string;
};

type DeviceDataPoint = {
  time: string;
  ph: number;
  turbidity: number;
  temp: number;
};

type Device = {
  id: string; // e.g., "Majuli-1"
  status: "active" | "inactive" | "maintenance";
  lastReading: string;
  metrics: DeviceMetrics;
  data: DeviceDataPoint[];
};

type Location = {
  id: string; // e.g., "majuli-assam"
  name: string; // e.g., "Majuli, Assam"
  devices: Device[];
};

// -------- DATA GENERATION HELPERS --------
/** Generates slightly randomized metrics for a device */
const generateMetrics = (base: { ph: number; tds: number; turbidity: number; temp: number; odour: number }): DeviceMetrics => ({
  ph: parseFloat((base.ph + (Math.random() - 0.5) * 0.4).toFixed(1)),
  tds: `${Math.round(base.tds + (Math.random() - 0.5) * 50)} ppm`,
  turbidity: `${(base.turbidity + (Math.random() - 0.5) * 0.5).toFixed(1)} NTU`,
  temp: `${(base.temp + (Math.random() - 0.5) * 1.5).toFixed(1)}°C`,
  odour: `${Math.min(10, Math.max(0, Math.round(base.odour + (Math.random() - 0.5) * 2)))}/10`,
});

/** Generates slightly randomized time-series data for charts */
const generateChartData = (base: { ph: number; turbidity: number; temp: number }): DeviceDataPoint[] => {
  return Array.from({ length: 7 }, (_, i) => ({
    time: `16:0${i}`,
    ph: parseFloat((base.ph + (Math.random() - 0.5) * 1.2).toFixed(1)),
    turbidity: parseFloat(Math.max(0.5, base.turbidity + (Math.random() - 0.5) * 1.5).toFixed(1)),
    temp: parseFloat((base.temp + (Math.random() - 0.5) * 2).toFixed(1)),
  }));
};

// -------- MOCK DATA --------
const locations: Location[] = [
  {
    id: "pasighat-arunachal",
    name: "Pasighat, Arunachal Pradesh",
    devices: [
      { id: "Pasighat-1", status: "active", lastReading: "19/09/2025, 16:08:00", metrics: generateMetrics({ ph: 7.4, tds: 320, turbidity: 1.2, temp: 22.8, odour: 1 }), data: generateChartData({ ph: 7.4, turbidity: 1.2, temp: 22.8 }) },
      { id: "Pasighat-2", status: "active", lastReading: "19/09/2025, 16:09:00", metrics: generateMetrics({ ph: 7.5, tds: 335, turbidity: 1.0, temp: 23.1, odour: 1 }), data: generateChartData({ ph: 7.5, turbidity: 1.0, temp: 23.1 }) },
    ],
  },
  {
    id: "aizawl-mizoram",
    name: "Aizawl, Mizoram",
    devices: [
      { id: "Aizawl-1", status: "active", lastReading: "19/09/2025, 16:10:00", metrics: generateMetrics({ ph: 7.2, tds: 280, turbidity: 1.5, temp: 21.5, odour: 2 }), data: generateChartData({ ph: 7.2, turbidity: 1.5, temp: 21.5 }) },
      { id: "Aizawl-2", status: "inactive", lastReading: "18/09/2025, 11:30:00", metrics: generateMetrics({ ph: 6.9, tds: 295, turbidity: 1.8, temp: 21.0, odour: 2 }), data: generateChartData({ ph: 6.9, turbidity: 1.8, temp: 21.0 }) },
      { id: "Aizawl-3", status: "active", lastReading: "19/09/2025, 16:05:00", metrics: generateMetrics({ ph: 7.3, tds: 270, turbidity: 1.4, temp: 21.8, odour: 1 }), data: generateChartData({ ph: 7.3, turbidity: 1.4, temp: 21.8 }) },
    ],
  },
  {
    id: "majuli-assam",
    name: "Majuli, Assam",
    devices: [
      { id: "Majuli-1", status: "active", lastReading: "19/09/2025, 16:11:00", metrics: generateMetrics({ ph: 7.6, tds: 300, turbidity: 1.0, temp: 23.5, odour: 0 }), data: generateChartData({ ph: 7.6, turbidity: 1.0, temp: 23.5 }) },
      { id: "Majuli-2", status: "maintenance", lastReading: "15/09/2025, 09:00:00", metrics: generateMetrics({ ph: 7.8, tds: 310, turbidity: 1.1, temp: 23.0, odour: 0 }), data: generateChartData({ ph: 7.8, turbidity: 1.1, temp: 23.0 }) },
    ],
  },
  {
    id: "churachandpur-manipur",
    name: "Churachandpur, Manipur",
    devices: [
      { id: "Churachandpur-1", status: "inactive", lastReading: "17/09/2025, 18:20:00", metrics: generateMetrics({ ph: 6.8, tds: 400, turbidity: 2.5, temp: 20.8, odour: 3 }), data: generateChartData({ ph: 6.8, turbidity: 2.5, temp: 20.8 }) },
      { id: "Churachandpur-2", status: "active", lastReading: "19/09/2025, 16:02:00", metrics: generateMetrics({ ph: 7.0, tds: 380, turbidity: 2.2, temp: 21.2, odour: 2 }), data: generateChartData({ ph: 7.0, turbidity: 2.2, temp: 21.2 }) },
    ],
  },
  {
    id: "tura-meghalaya",
    name: "Tura, Meghalaya",
    devices: [
      { id: "Tura-1", status: "active", lastReading: "19/09/2025, 16:12:00", metrics: generateMetrics({ ph: 7.0, tds: 350, turbidity: 1.8, temp: 22.0, odour: 1 }), data: generateChartData({ ph: 7.0, turbidity: 1.8, temp: 22.0 }) },
    ],
  },
];


export default function IoTDevicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [selectedDevice, setSelectedDevice] = useState<Device>(locations[0].devices[0]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // When a new location is selected, default to its first device
    setSelectedDevice(location.devices[0]);
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return locations;
    return locations.filter(loc =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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
        {/* Location & Device List */}
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Locations</h2>
          <input
            placeholder="Search by location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg text-sm placeholder-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
          />

          <div className="space-y-3">
            {filteredLocations.map((loc) => (
              <div key={loc.id}>
                {/* Location Item */}
                <div
                  onClick={() => handleLocationSelect(loc)}
                  className={`p-3 rounded-lg cursor-pointer border flex justify-between items-center transition ${
                    selectedLocation.id === loc.id
                      ? "bg-blue-100 border-blue-300"
                      : "hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <span className="font-semibold text-gray-900">{loc.name}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    {loc.devices.length}
                  </span>
                </div>

                {/* Devices list for the selected location */}
                {selectedLocation.id === loc.id && (
                  <div className="pl-4 pt-2 space-y-2 border-l-2 border-blue-200 ml-4">
                    {loc.devices.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDevice(d)}
                        className={`p-2 rounded-md cursor-pointer border flex justify-between items-center transition ${
                          selectedDevice.id === d.id
                            ? "bg-blue-50 border-blue-200 shadow-sm"
                            : "hover:bg-gray-50 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-800">{d.id}</span>
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
                )}
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
                  {selectedLocation.name} - Sensor <span className="text-blue-600">{selectedDevice.id}</span>
                </h2>
                <p className="text-sm text-gray-500">
                  Last reading: {selectedDevice.lastReading}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  selectedDevice.status === "active"
                    ? "bg-green-100 text-green-700"
                    : selectedDevice.status === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {selectedDevice.status}
              </span>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Droplet className="w-5 h-5 text-blue-500 bg-blue-100 p-1 rounded-full" />
                pH: {selectedDevice.metrics.ph}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Activity className="w-5 h-5 text-purple-500 bg-purple-100 p-1 rounded-full" />
                TDS: {selectedDevice.metrics.tds}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Waves className="w-5 h-5 text-cyan-500 bg-cyan-100 p-1 rounded-full" />
                Turbidity: {selectedDevice.metrics.turbidity}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Thermometer className="w-5 h-5 text-orange-500 bg-orange-100 p-1 rounded-full" />
                Temp: {selectedDevice.metrics.temp}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2 text-gray-800 font-medium">
                <Gauge className="w-5 h-5 text-pink-500 bg-pink-100 p-1 rounded-full" />
                Odour: {selectedDevice.metrics.odour}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white rounded-xl shadow p-4 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Real-time Sensor Data
            </h2>

            {/* Combined Chart with Legend */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="h-80 cursor-pointer">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedDevice.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'pH', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Turbidity (NTU)', angle: -90, position: 'insideRight', fill: '#10b981' }} />
                      <YAxis yAxisId="temp" orientation="right" stroke="#f59e0b" hide={true} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="pH Level" />
                      <Line yAxisId="right" type="monotone" dataKey="turbidity" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Turbidity" />
                      <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Temperature (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-white">
                <DialogHeader>
                  <DialogTitle>Real-time Sensor Data for {selectedDevice.id}</DialogTitle>
                </DialogHeader>
                <div className="h-[600px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedDevice.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" />
                      <YAxis yAxisId="left" stroke="#3b82f6" label={{ value: 'pH', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Turbidity (NTU)', angle: -90, position: 'insideRight', fill: '#10b981' }} />
                       <YAxis yAxisId="temp" orientation="right" stroke="#f59e0b" hide={true} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="pH Level" />
                      <Line yAxisId="right" type="monotone" dataKey="turbidity" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Turbidity" />
                       <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Temperature (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
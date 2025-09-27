// @/pages/DashboardPage.tsx or @/app/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
interface AlertData {
  id: string;
  title: string;
  location: any;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

interface DeviceStatusData {
  id: string;
  device_id: string;
  name: string;
  location: any;
  status: 'online' | 'offline' | 'maintenance';
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  AlertTriangle,
  Wifi,
  WifiOff,
  Wrench,
  Droplet,
  Search,
  FileText,
  Activity,
  MapPin,
  Clock,
} from "lucide-react";

/* ----------------- helpers ----------------- */
function percentForGauge(label: string, value: number) {
  if (!Number.isFinite(value)) return 0;
  switch (label.toLowerCase()) {
    case "ph":
      return (value / 14) * 100;
    case "tds":
      return (value / 1000) * 100;
    case "turbidity":
      return (value / 100) * 100;
    case "temperature":
      return (value / 50) * 100;
    case "carbon %":
      return value;
    case "water level":
      return value;
    default:
      return (value / 100) * 100;
  }
}

function formatValue(val: number | undefined, decimals = 2) {
  return Number.isFinite(val as number) ? Number(val).toFixed(decimals) : "-";
}

/* ----------------- small components ----------------- */
function StatusCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string;
}) {
  return (
    <Card className="p-5 rounded-2xl custom-soft-shadow bg-white flex flex-col gap-3 group animate-scale-on-hover">
      <div className="flex items-center gap-3">
        <div
          className={`h-12 w-12 flex items-center justify-center rounded-full ${color} text-white animate-blink-on-hover`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && <p className="text-xs text-gray-500">{trend}</p>}
    </Card>
  );
}

function GaugeCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit?: string;
  color: string;
}) {
  const pct = percentForGauge(label, value);
  const displayValue = formatValue(value);

  return (
    <Card className="flex flex-col items-center justify-center p-4 custom-soft-shadow rounded-2xl bg-white h-full">
      <div className="w-full h-auto aspect-square mb-2">
        <CircularProgressbar
          value={pct}
          text={displayValue}
          styles={buildStyles({
            pathColor: color,
            textColor: "#111827",
            trailColor: "#f3f4f6",
            textSize: "12px",
            pathTransitionDuration: 1.5,
          })}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {unit && <span className="text-xs text-gray-500">{unit}</span>}
    </Card>
  );
}

/* ----------------- main dashboard ----------------- */
export default function DashboardPage() {

  const [waterData, setWaterData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [sensors, setSensors] = useState<DeviceStatusData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedDevice, setSelectedDevice] = useState("All Devices");
  const [deviceOptions, setDeviceOptions] = useState<string[]>(["All Devices"]);

  useEffect(() => {
    const mockAlerts: AlertData[] = [
      {
        id: "1",
        title: "High Turbidity Detected",
        location: "Majuli, Assam",
        timestamp: new Date().toISOString(),
        severity: "high",
      },
      {
        id: "2",
        title: "Low pH Level",
        location: "Churachandpur, Manipur",
        timestamp: new Date().toISOString(),
        severity: "medium",
      },
      {
        id: "3",
        title: "Sensor Offline",
        location: "Tura, Meghalaya",
        timestamp: new Date().toISOString(),
        severity: "low",
      },
      {
        id: "4",
        title: "Unusual Temperature Fluctuation",
        location: "Aizawl, Mizoram",
        timestamp: new Date().toISOString(),
        severity: "medium",
      },
      {
        id: "5",
        title: "High TDS Detected",
        location: "Majuli, Assam",
        timestamp: new Date().toISOString(),
        severity: "high",
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    const mockSensors: DeviceStatusData[] = [
      {
        id: "1",
        device_id: "D-MAJULI-1",
        name: "Majuli Sensor 1",
        location: "Majuli, Assam",
        status: "online",
      },
      {
        id: "2",
        device_id: "D-CHURACHANDPUR-1",
        name: "Churachandpur Sensor 1",
        location: "Churachandpur, Manipur",
        status: "offline",
      },
      {
        id: "3",
        device_id: "D-TURA-1",
        name: "Tura Sensor 1",
        location: "Tura, Meghalaya",
        status: "online",
      },
      {
        id: "4",
        device_id: "D-AIZAWL-1",
        name: "Aizawl Sensor 1",
        location: "Aizawl, Mizoram",
        status: "maintenance",
      },
      {
        id: "5",
        device_id: "D-MAJULI-2",
        name: "Majuli Sensor 2",
        location: "Majuli, Assam",
        status: "online",
      },
    ];
    setSensors(mockSensors);
  }, []);

  // Define your project areas and their base values
  const areaOptions = useMemo(() => [
    { key: "majuli", label: "Majuli, Assam" },
    { key: "churachandpur", label: "Churachandpur, Manipur" },
    { key: "tura", label: "Tura, Meghalaya" },
    { key: "aizawl", label: "Aizawl, Mizoram" },
  ], []);

  const areaDataBases = useMemo(() => ({
    "majuli": {
      pH: 7.2,
      tds: 400,
      turbidity: 2,
      temperature: 25,
      carbon_pct: 30,
      water_level: 60,
    },
    "churachandpur": {
      pH: 6.8,
      tds: 350,
      turbidity: 3,
      temperature: 22,
      carbon_pct: 40,
      water_level: 55,
    },
    "tura": {
      pH: 7.0,
      tds: 420,
      turbidity: 2.5,
      temperature: 24,
      carbon_pct: 35,
      water_level: 65,
    },
    "aizawl": {
      pH: 7.1,
      tds: 390,
      turbidity: 2.2,
      temperature: 23,
      carbon_pct: 38,
      water_level: 62,
    },
  }), []);

  const defaultDataBase = useMemo(() => ({
    pH: 7.0,
    tds: 400,
    turbidity: 2.5,
    temperature: 24,
    carbon_pct: 35,
    water_level: 60,
  }), []);

  useEffect(() => {
    const mockWaterData = areaOptions.flatMap(area => {
      const base = areaDataBases[area.key] || defaultDataBase;
      const deviceCount = Math.floor(Math.random() * 4) + 2;
      const data = [];
      for (let i = 0; i < deviceCount; i++) {
        const deviceId = `D-${area.key.toUpperCase()}-${i + 1}`;
        data.push({
          id: `${area.key}-${i}`,
          device_id: deviceId,
          sensor_name: `Device ${i + 1}`,
          location: area.label,
          ...base,
          pH: base.pH + (Math.random() - 0.5) * 1,
          tds: base.tds + (Math.random() - 0.5) * 100,
          turbidity: base.turbidity + (Math.random() - 0.5) * 2,
          temperature: base.temperature + (Math.random() - 0.5) * 5,
          carbon_pct: base.carbon_pct + (Math.random() - 0.5) * 4,
          water_level: base.water_level + (Math.random() - 0.5) * 20,
          timestamp: new Date().toISOString(),
        });
      }
      return data;
    });
    setWaterData(mockWaterData);
  }, [areaOptions, areaDataBases, defaultDataBase]);



  // Update device options based on selected area
  useEffect(() => {
    if (selectedArea === "All Areas") {
      setDeviceOptions(["All Devices"]);
      // The old line that caused the reset is removed here.
      // setSelectedDevice("All Devices");
    } else {
      const areaLower = areaOptions.find(a => a.key === selectedArea)?.label.toLowerCase();
      const devicesInArea = Array.from(new Set(
        waterData
          .filter(d => (d.location || "").toLowerCase().includes(areaLower || ""))
          .map(d => d.device_id)
      ));
      setDeviceOptions(["All Devices", ...devicesInArea]);
      // The old line that caused the reset is removed here.
      // setSelectedDevice("All Devices");
    }
  }, [selectedArea, waterData, areaOptions]);

  // Handlers for dropdowns
  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newArea = event.target.value;
    setSelectedArea(newArea);
    setSearchQuery(""); // Clear search when area changes
  };

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDevice = event.target.value;
    setSelectedDevice(newDevice);
    setSearchQuery(""); // Clear search when device changes
  };

  const activeSensors = sensors.filter((s) => s.status === "online").length;
  const pendingAlerts = alerts.length;
  const riskLevel = pendingAlerts > 2 ? "High" : "Low";

  // Chart Data (areas used for area dropdown)
  const diseaseRiskData = useMemo(() => {
    // Generate risk data based on waterData
    return areaOptions.map(area => {
      const areaData = waterData.filter(d => (d.location || "").toLowerCase().includes(area.key));
      const avgTDS = areaData.reduce((sum, d) => sum + (d.tds || 0), 0) / areaData.length;
      const avgTurbidity = areaData.reduce((sum, d) => sum + (d.turbidity || 0), 0) / areaData.length;

      // Simple heuristic for risk calculation
      return {
        name: area.label,
        Cholera: Math.round(avgTDS / 20),
        Typhoid: Math.round(avgTurbidity * 3),
        Diarrhea: Math.round((avgTDS / 50) + (avgTurbidity * 1.5)),
      };
    });
  }, [waterData, areaOptions]);

  const trendData = [
    { day: "Mon", risk: 2 },
    { day: "Tue", risk: 3 },
    { day: "Wed", risk: 2 },
    { day: "Thu", risk: 4 },
    { day: "Fri", risk: 3 },
    { day: "Sat", risk: 2 },
    { day: "Sun", risk: 5 },
  ];

  // sensors to show in the Sensor Status list, filtered by selectedArea and searchQuery
  const displayedSensors = useMemo(() => {
    let list = Array.isArray(sensors) ? sensors.slice() : [];

    // filter by selected area (partial, case-insensitive)
    if (selectedArea && selectedArea !== "All Areas") {
      const areaLower = areaOptions.find(a => a.key === selectedArea)?.label.toLowerCase() || selectedArea.toLowerCase();
      list = list.filter((s: any) => {
        const loc =
          (s.location?.name ||
            s.location?.village ||
            s.area ||
            // some sensor objects might store location as a string
            (typeof s.location === "string" ? s.location : "") ||
            "")
            .toString()
            .toLowerCase();
        return loc.includes(areaLower);
      });
    }

    // filter by search query (matches name, device id, or location fields)
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s: any) => {
        const name = (s.name || s.device_name || "").toString().toLowerCase();
        const id = (s.device_id || s.id || "").toString().toLowerCase();
        const loc =
          (s.location?.name ||
            s.location?.village ||
            s.area ||
            (typeof s.location === "string" ? s.location : "") ||
            "")
            .toString()
            .toLowerCase();
        return name.includes(q) || id.includes(q) || loc.includes(q);
      });
    }

    return list;
  }, [sensors, selectedArea, searchQuery, areaOptions]);


  const filteredAlerts = useMemo(() => {
    let filtered = alerts;

    if (searchQuery) {
      filtered = filtered.filter(
        (a: any) =>
          a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (typeof a.location === "string"
            ? a.location.toLowerCase().includes(searchQuery.toLowerCase())
            : (a.location?.name || a.location?.village || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [alerts, searchQuery]);

  const filteredWaterData = useMemo(() => {
    let data = waterData;

    // Filter by area
    if (selectedArea !== "All Areas") {
      const areaLower = areaOptions.find(a => a.key === selectedArea)?.label.toLowerCase() || selectedArea.toLowerCase();
      data = data.filter((d: any) =>
        (d.location || "").toLowerCase().includes(areaLower)
      );
    }

    // Filter by device if one is selected
    if (selectedDevice !== "All Devices") {
      data = data.filter((d) => d.device_id === selectedDevice);
    }

    // Filter by search query (device name, sensor name, OR location/area)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((d: any) =>
        (d.sensor_name || d.device_name || "").toLowerCase().includes(q) ||
        (d.location || d.area || "").toLowerCase().includes(q)
      );
    }

    return data;
  }, [waterData, selectedArea, selectedDevice, searchQuery, areaOptions]);

  const firstWater = filteredWaterData[0];

  return (
    <div className="bg-gradient-flow min-h-screen">
      <div className="px-4 lg:px-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Health & Water Surveillance Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time monitoring of waterborne disease risks across communities
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard
            title="Risk Level"
            value={riskLevel}
            icon={AlertTriangle}
            color="bg-red-500"
            trend="↓ 15% from last week"
          />
          <StatusCard
            title="Active IoT Sensors"
            value={`${activeSensors}/${sensors.length}`}
            icon={Wifi}
            color="bg-blue-500"
            trend="2 sensors offline"
          />
          <StatusCard
            title="Reports Today"
            value={5}
            icon={FileText}
            color="bg-green-500"
            trend="↑ 12% increase"
          />
          <StatusCard
            title="Pending Alerts"
            value={pendingAlerts}
            icon={Activity}
            color="bg-purple-500"
            trend="3 high priority"
          />
        </div>

        {/* Live Water Quality */}
        <Card className="rounded-2xl custom-soft-shadow">
          <CardHeader className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Droplet className="text-blue-500 h-5 w-5" />
              <CardTitle className="text-lg font-semibold">
                Live Water Quality Monitoring
              </CardTitle>
            </div>

            {/* Search + filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by area or device..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400"
                >
                  <option value="All Areas">All Areas</option>
                  {areaOptions.map((a) => (
                    <option key={a.key} value={a.key}>
                      {a.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDevice}
                  onChange={handleDeviceChange}
                  className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400"
                >
                  {deviceOptions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                {
                  label: "pH",
                  value: firstWater?.pH ?? 7.2,
                  unit: "",
                  color: "#22c55e",
                },
                {
                  label: "TDS",
                  value: firstWater?.tds ?? 450,
                  unit: "mg/L",
                  color: "#3b82f6",
                },
                {
                  label: "Turbidity",
                  value: firstWater?.turbidity ?? 2.3,
                  unit: "NTU",
                  color: "#f59e0b",
                },
                {
                  label: "Temperature",
                  value: firstWater?.temperature ?? 24.5,
                  unit: "°C",
                  color: "#10b981",
                },
                {
                  label: "Carbon %",
                  value: firstWater?.carbon_pct ?? 2,
                  unit: "%",
                  color: "#8b5cf6",
                },
                {
                  label: "Water Level",
                  value: firstWater?.water_level ?? 50,
                  unit: "%",
                  color: "#06b6d4",
                },
              ].map((g) => (
                <div
                  key={g.label}
                  className="transition-transform transform rounded-2xl"
                >
                  <GaugeCard
                    label={g.label}
                    value={g.value}
                    unit={g.unit}
                    color={g.color}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="lg:col-span-2 rounded-2xl custom-soft-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Disease Risk Analysis
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Predicted outbreak probabilities by location
                  </p>
                </CardHeader>
                <CardContent className="space-y-10">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={diseaseRiskData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Cholera" fill="#ef4444" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Typhoid" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      <Bar
                        dataKey="Diarrhea"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer">
                        <h3 className="text-md font-semibold mb-3">7-Day Risk Trend</h3>
                        <ResponsiveContainer width="100%" height={260}>
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="risk"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-white animate-pop-in">
                      <DialogHeader>
                        <DialogTitle>7-Day Risk Trend</DialogTitle>
                      </DialogHeader>
                      <div className="h-[600px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="risk"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              dot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-white animate-pop-in">
              <DialogHeader>
                <DialogTitle>Disease Risk Analysis</DialogTitle>
              </DialogHeader>
              <div className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseRiskData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Cholera" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Typhoid" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar
                      dataKey="Diarrhea"
                      fill="#10b981"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>

          {/* Alerts List */}
          <Card className="rounded-2xl custom-soft-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(filteredAlerts.slice(0, 5) as (AlertData & { severity?: string })[]).map(
                  (alert, idx) => (
                    <li
                      key={idx}
                      className="p-4 border rounded-xl bg-white custom-soft-shadow space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {alert.title || ""}
                          </p>
                        </div>
                        <Badge
                          className={`px-3 py-1 text-xs rounded-full ${
                            (alert.severity ?? "low") === "high"
                              ? "bg-red-100 text-red-600"
                              : (alert.severity ?? "low") === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {alert.severity ?? "low"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp
                            ? new Date(String(alert.timestamp)).toLocaleString()
                            : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {typeof alert.location === "string"
                            ? alert.location
                            : alert.location?.village ||
                              alert.location?.name ||
                              "Unknown"}
                        </span>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sensor + Water Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-2xl custom-soft-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sensor Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {displayedSensors.map((s, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-xl bg-white custom-soft-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {s.status === "online" ? (
                        <Wifi className="text-green-500 h-5 w-5" />
                      ) : s.status === "offline" ? (
                        <WifiOff className="text-red-500 h-5 w-5" />
                      ) : (
                        <Wrench className="text-yellow-500 h-5 w-5" />
                      )}
                      <span className="font-medium text-sm text-gray-800">
                        {(s as any).name || (s as any).device_id || "Unnamed Sensor"}
                      </span>
                    </div>
                    <Badge
                      className={`${
                        s.status === "online"
                          ? "bg-green-100 text-green-700"
                          : s.status === "offline"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl custom-soft-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Water Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {filteredWaterData.slice(0, 6).map((w, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-xl bg-white custom-soft-shadow"
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {w.sensor_name ||
                        w.device_name ||
                        w.location ||
                        w.area ||
                        `Sensor ${w.device_id || idx + 1}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      pH: {formatValue(w.pH)} | Turbidity:{" "}
                      {formatValue(w.turbidity)} NTU | Temp:{" "}
                      {formatValue(w.temperature)} °C | Water Level:{" "}
                      {formatValue(w.water_level)} % | Carbon %:{" "}
                      {formatValue(w.carbon_pct)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

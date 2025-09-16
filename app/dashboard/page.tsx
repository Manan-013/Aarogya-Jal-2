"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertAPI,
  AlertData,
  HealthReportAPI,
  HealthReportData,
  DeviceStatusAPI,
  DeviceStatusData,
  WaterQualityAPI,
  WaterQualityData,
} from "@/entities/all";

// Ensure WaterQualityData has 'temperature' property
// If not, extend the type here:
type WaterQualityDataWithTemperature = WaterQualityData & {
  temperature?: number;
  water_level?: number;
  sensor_name?: string;
  device_name?: string;
  location?: string;
  area?: string;
  device_id?: string | number;
  id?: string | number;
  carbon_pct?: number;
  pH?: number;
  tds?: number;
  turbidity?: number;
  o2_gas?: number;
  timestamp?: string;
};

type AlertDataWithSeverity = AlertData & { severity?: string; title?: string };

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
  return Number.isFinite(val) ? Number(val).toFixed(decimals) : "-";
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
    <Card className="p-5 rounded-2xl shadow-sm border bg-white flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`h-12 w-12 flex items-center justify-center rounded-full ${color} text-white`}
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
    <Card className="flex flex-col items-center justify-center p-4 shadow-sm border rounded-2xl bg-white">
      <div className="w-24 h-24 mb-2">
        <CircularProgressbar
          value={pct}
          text={displayValue}
          styles={buildStyles({
            pathColor: color,
            textColor: "#111827",
            trailColor: "#f3f4f6",
            textSize: "12px",
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
  const [waterData, setWaterData] = useState<WaterQualityDataWithTemperature[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [healthReports, setHealthReports] = useState<HealthReportData[]>([]);
  const [sensors, setSensors] = useState<DeviceStatusData[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedSensor, setSelectedSensor] = useState("All Sensors");

  const fetchData = useCallback(async () => {
    try {
      const [a, h, d, w] = await Promise.all([
        AlertAPI.list("desc"),
        HealthReportAPI.list("desc"),
        DeviceStatusAPI.list(),
        WaterQualityAPI.list(),
      ]);
      setAlerts(a || []);
      setHealthReports(h || []);
      setSensors(d || []);
      setWaterData(
        (w || []).map((reading: any, idx: number) => ({
          id: reading.id ?? idx,
          device_id: reading.device_id ?? "",
          pH: reading.pH,
          tds: reading.tds,
          turbidity: reading.turbidity,
          carbon_pct: reading.carbon_pct,
          temperature: reading.temperature,
          water_level: reading.water_level,
          o2_gas: reading.o2_gas,
          location: reading.location || reading.area,
          sensor_name: reading.sensor_name || reading.device_name,
          timestamp: reading.timestamp ?? "",
        }))
      );
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeSensors = sensors.filter((s) => s.status === "online").length;
  const pendingAlerts = alerts.length;
  const recentReports = healthReports.length;
  const riskLevel = pendingAlerts > 2 ? "High" : "Low";

  const areaOptions = useMemo(
    () => ["All Areas", ...new Set(waterData.map((w: any) => w.location || ""))],
    [waterData]
  );
  const sensorOptions = useMemo(
    () => ["All Sensors", ...new Set(sensors.map((s: any) => s.name || s.id || ""))],
    [sensors]
  );

  const firstWater = waterData[0];

  const diseaseRiskData = [
    { name: "Majuli, Assam", Cholera: 30, Typhoid: 20, Diarrhea: 15 },
    { name: "Churachandpur, Manipur", Cholera: 20, Typhoid: 25, Diarrhea: 10 },
    { name: "Tura, Meghalaya", Cholera: 15, Typhoid: 10, Diarrhea: 5 },
    { name: "Aizawl, Mizoram", Cholera: 25, Typhoid: 30, Diarrhea: 20 },
  ];

  const trendData = [
    { day: "Mon", risk: 2 },
    { day: "Tue", risk: 3 },
    { day: "Wed", risk: 2 },
    { day: "Thu", risk: 4 },
    { day: "Fri", risk: 3 },
    { day: "Sat", risk: 2 },
    { day: "Sun", risk: 5 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 lg:px-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Health Surveillance Dashboard
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
            value={recentReports}
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
        <Card className="rounded-2xl shadow-md">
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
                  placeholder="Search by area or sensor ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400"
                >
                  {areaOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={selectedSensor}
                  onChange={(e) => setSelectedSensor(e.target.value)}
                  className="px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-400"
                >
                  {sensorOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <GaugeCard
                label="pH"
                value={firstWater?.pH ?? 7.2}
                unit=""
                color="#22c55e"
              />
              <GaugeCard
                label="TDS"
                value={firstWater?.tds ?? 450}
                unit="mg/L"
                color="#3b82f6"
              />
              <GaugeCard
                label="Turbidity"
                value={firstWater?.turbidity ?? 2.3}
                unit="NTU"
                color="#f59e0b"
              />
              <GaugeCard
                label="Temperature"
                value={firstWater?.temperature ?? 24.5}
                unit="°C"
                color="#10b981"
              />
              <GaugeCard
                label="Carbon %"
                value={firstWater?.carbon_pct ?? 2}
                unit="%"
                color="#8b5cf6"
              />
              <GaugeCard
                label="Water Level"
                value={firstWater?.water_level ?? 50}
                unit="%"
                color="#06b6d4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Charts + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-2xl shadow-md">
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

              <div>
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
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(alerts.slice(0, 5) as AlertDataWithSeverity[]).map(
                  (alert, idx) => (
                    <li
                      key={idx}
                      className="p-4 border rounded-xl bg-white shadow-sm space-y-2"
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
                          {alert.location?.village || "Unknown"}
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
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sensor Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {sensors.map((s, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm"
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

          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Water Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {waterData.slice(0, 6).map((w, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm"
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
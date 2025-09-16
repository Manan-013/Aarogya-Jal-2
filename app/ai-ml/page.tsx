// app/ai-ml/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { Brain, AlertTriangle, Target, TrendingUp } from "lucide-react";

/* ---------------- Sample Data ---------------- */
const topStats = {
  avgConfidence: "78%",
  highRiskAreas: 3,
  predictions: 24,
  accuracy: "94.2%",
};

const diseasePredictions = [
  { disease: "Cholera", risk: "High", confidence: 82, area: "Majuli, Assam" },
  { disease: "Diarrhea", risk: "Medium", confidence: 74, area: "Churachandpur, Manipur" },
  { disease: "Typhoid", risk: "Low", confidence: 65, area: "Aizawl, Mizoram" },
];

const diseaseChartData = [
  { name: "Diarrhea", value: 45 },
  { name: "Cholera", value: 25 },
  { name: "Typhoid", value: 18 },
  { name: "Hepatitis A", value: 12 },
  { name: "Dysentery", value: 8 },
];

const confidenceDistributionData = [
  { name: "High Confidence", value: 65 },
  { name: "Medium Confidence", value: 25 },
  { name: "Low Confidence", value: 10 },
];

const predictionConfidenceByDisease = [
  { disease: "Diarrhea", confidence: 87 },
  { disease: "Cholera", confidence: 76 },
  { disease: "Typhoid", confidence: 82 },
  { disease: "Hepatitis A", confidence: 71 },
  { disease: "Dysentery", confidence: 68 },
];

const weeklyTrendsData = [
  { day: "Mon", risk1: 32, risk2: 28, risk3: 15 },
  { day: "Tue", risk1: 34, risk2: 30, risk3: 15 },
  { day: "Wed", risk1: 33, risk2: 32, risk3: 16 },
  { day: "Thu", risk1: 35, risk2: 36, risk3: 18 },
  { day: "Fri", risk1: 36, risk2: 40, risk3: 19 },
  { day: "Sat", risk1: 34, risk2: 39, risk3: 20 },
  { day: "Sun", risk1: 37, risk2: 44, risk3: 22 },
];

const dataCorrelationData = [
  { x: 10, y: 20 },
  { x: 20, y: 30 },
  { x: 30, y: 25 },
  { x: 40, y: 45 },
  { x: 50, y: 35 },
];
/* ------------------------------------------------------------------------------ */

export default function AIMLInsightsPage() {
  // controls for the search/filter UI
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All Areas");
  const [device, setDevice] = useState("All Devices");
  const [activeTab, setActiveTab] = useState<
    "predictions" | "confidence" | "trends" | "correlation"
  >("predictions");

  // simple list of areas/devices (mock)
  const areas = ["All Areas", "Area A", "Area B", "Area C"];
  const devices = ["All Devices", "WQ-001", "WQ-002", "WQ-003"];

  // filtered predictions table (by query/area/device)
  const filteredPredictions = useMemo(() => {
    return diseasePredictions.filter((d) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        d.disease.toLowerCase().includes(q) ||
        d.area?.toLowerCase().includes(q);
      const matchesArea = area === "All Areas" || d.area === area;
      // device filtering not used in mock but kept for UI parity
      const matchesDevice = device === "All Devices" || device === "";
      return matchesQuery && matchesArea && matchesDevice;
    });
  }, [query, area, device]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900">AI/ML Insights</h1>
        <p className="text-gray-600 mt-1">
          Advanced disease outbreak predictions and analysis
        </p>

        {/* Search & filters under the headline */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by disease, area, or device..."
              aria-label="Search predictions"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="areaSelect" className="sr-only">
              Area
            </label>
            <select
              id="areaSelect"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="deviceSelect" className="sr-only">
              Device
            </label>
            <select
              id="deviceSelect"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {devices.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Avg Confidence</p>
              <div className="mt-2 text-2xl font-bold text-blue-600">
                {topStats.avgConfidence}
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">High Risk Areas</p>
              <div className="mt-2 text-2xl font-bold text-red-600">
                {topStats.highRiskAreas}
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Predictions</p>
              <div className="mt-2 text-2xl font-bold text-green-600">
                {topStats.predictions}
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Accuracy</p>
              <div className="mt-2 text-2xl font-bold text-purple-600">
                {topStats.accuracy}
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + Charts */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue={activeTab}>
          <TabsList>
            <TabsTrigger value="predictions">Disease Predictions</TabsTrigger>
            <TabsTrigger value="confidence">Model Confidence</TabsTrigger>
            <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
            <TabsTrigger value="correlation">Data Correlation</TabsTrigger>
          </TabsList>

          {/* Disease Predictions */}
          <TabsContent value="predictions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Disease Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left">Disease</th>
                        <th className="p-3 text-left">Risk Level</th>
                        <th className="p-3 text-left">Confidence</th>
                        <th className="p-3 text-left">Area</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPredictions.map((d, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-3 font-medium">{d.disease}</td>
                          <td
                            className={`p-3 font-semibold ${
                              d.risk === "High"
                                ? "text-red-600"
                                : d.risk === "Medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {d.risk}
                          </td>
                          <td className="p-3">{d.confidence}%</td>
                          <td className="p-3 text-gray-600">{d.area}</td>
                        </tr>
                      ))}
                      {filteredPredictions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-gray-500">
                            No predictions match your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disease Outbreak Probabilities</CardTitle>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diseaseChartData}>
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Model Confidence */}
          <TabsContent value="confidence">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Model Confidence Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={confidenceDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        <Cell fill="#10b981" /> {/* green */}
                        <Cell fill="#f59e0b" /> {/* orange */}
                        <Cell fill="#ef4444" /> {/* red */}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Progress Bars */}
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Confidence by Disease</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {predictionConfidenceByDisease.map((d) => (
                    <div key={d.disease}>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span>{d.disease}</span>
                        <span>{d.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${d.confidence}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weekly Trends */}
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Prediction Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="risk1" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="risk2" stroke="#ef4444" />
                    <Line type="monotone" dataKey="risk3" stroke="#22c55e" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Correlation */}
{/* Data Correlation → Replaced with Final Combined Prediction */}
<TabsContent value="correlation">
  <Card>
    <CardHeader>
      <CardTitle>Final Combined Prediction</CardTitle>
      <p className="text-sm text-gray-500">
        Weighted analysis combining AI/ML, IoT sensor data, and field reports
      </p>
    </CardHeader>

    <CardContent>
      {/* Current Risk Assessment Section */}
      <div className="bg-blue-50 p-6 rounded-xl mb-6">
        {/* Heading with Risk Label + Percentage */}
        <h3 className="text-xl font-bold text-center text-blue-900 mb-4">
          Current Risk Assessment
        </h3>
        <div className="flex justify-center items-center mb-6">
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">
            MEDIUM RISK
          </span>
          <span className="text-3xl font-extrabold text-blue-700">68%</span>
        </div>

        {/* Cards Row */}
        <div className="flex justify-center items-stretch gap-6">
          {/* AI/ML Model */}
          <div className="bg-white shadow-md rounded-lg p-4 flex-1 text-center">
            <p className="text-gray-500 font-medium">AI/ML Model</p>
            <p className="text-2xl font-bold text-blue-600">72%</p>
            <p className="text-xs text-gray-500">Weight: 40%</p>
          </div>

          {/* IoT Sensors */}
          <div className="bg-white shadow-md rounded-lg p-4 flex-1 text-center">
            <p className="text-gray-500 font-medium">IoT Sensors</p>
            <p className="text-2xl font-bold text-green-600">61%</p>
            <p className="text-xs text-gray-500">Weight: 35%</p>
          </div>

          {/* Field Reports */}
          <div className="bg-white shadow-md rounded-lg p-4 flex-1 text-center">
            <p className="text-gray-500 font-medium">Field Reports</p>
            <p className="text-2xl font-bold text-orange-600">75%</p>
            <p className="text-xs text-gray-500">Weight: 25%</p>
          </div>
        </div>
      </div>

      {/* Risk & Protective Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-bold text-red-600 mb-2">Risk Factors</h4>
          <ul className="list-disc list-inside text-red-700 space-y-1 text-sm">
            <li>High turbidity levels in Area C</li>
            <li>Increased diarrhea cases reported</li>
            <li>Temperature above normal range</li>
          </ul>
        </div>

        {/* Protective Factors */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-bold text-green-600 mb-2">Protective Factors</h4>
          <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
            <li>pH levels within safe range</li>
            <li>Recent water treatment conducted</li>
            <li>No cholera cases in past 7 days</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

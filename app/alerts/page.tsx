"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockAlerts = [
  {
    id: 1,
    alert: "High Turbidity Detected in Churachandpur, Manipur",
    location: "Churachandpur, Manipur",
    severity: "high",
    type: "Water Quality",
    status: "Under Process",
    created: "Sep 14, 2025 09:04",
  },
  {
    id: 2,
    alert: "Cholera Cases Reported",
    location: "Aizawl, Mizoram",
    severity: "critical",
    type: "Disease Outbreak",
    status: "Under Process",
    created: "Sep 14, 2025 09:04",
  },
  {
    id: 3,
    alert: "Device Offline - WQ-003",
    location: "Majuli, Assam",
    severity: "medium",
    type: "Device Malfunction",
    status: "Pending",
    created: "Sep 14, 2025 09:04",
  },
  {
    id: 4,
    alert: "Typhoid Outbreak Prediction",
    location: "Tura, Meghalaya",
    severity: "high",
    type: "Prediction",
    status: "Pending",
    created: "Sep 14, 2025 09:04",
  },
  {
    id: 5,
    alert: "Water pH Anomaly",
    location: "Churachandpur, Manipur",
    severity: "medium",
    type: "Water Quality",
    status: "Resolved",
    created: "Sep 14, 2025 09:04",
  },
];

// Severity badge
const getSeverityBadge = (sev: string) => {
  switch (sev) {
    case "critical":
      return "bg-red-100 text-red-600";
    case "high":
      return "bg-orange-100 text-orange-600";
    case "medium":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
          <Clock className="w-3 h-3" /> {status}
        </span>
      );
    case "Under Process":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs">
          <Clock className="w-3 h-3" /> {status}
        </span>
      );
    case "Resolved":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs">
          <CheckCircle2 className="w-3 h-3" /> {status}
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
          {status}
        </span>
      );
  }
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState("All");

  // Update alert status
  const updateStatus = (id: number, newStatus: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const filteredAlerts =
    filter === "All" ? alerts : alerts.filter((a) => a.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Actions</h1>
        <p className="text-gray-600">
          Manage and respond to system-generated alerts
        </p>

        {/* Tabs */}
        <div className="flex space-x-3 mt-6 mb-4">
          {["All", "Pending", "Under Process", "Resolved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                filter === tab
                  ? "bg-white border-gray-300 text-gray-900 shadow-sm"
                  : "text-gray-600 border border-transparent hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th className="px-6 py-3">Alert</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {a.alert}
                    <div className="text-xs text-gray-500">{a.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(
                        a.severity
                      )}`}
                    >
                      <AlertTriangle className="w-3 h-3" /> {a.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{a.type}</td>
                  <td className="px-6 py-4">{getStatusBadge(a.status)}</td>
                  <td className="px-6 py-4 text-gray-600">{a.created}</td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => updateStatus(a.id, "Under Process")}>
                          Mark as Under Process
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(a.id, "Resolved")}>
                          Mark as Resolved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(a.id, "Fake Report")}>
                          Mark as Fake Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Report = {
  reporter: string;
  role: string;
  location: string;
  disease: string;
  cases: number;
  severity: "low" | "medium" | "high" | "critical";
  date: string;
};

const reports: Report[] = [
  {
    reporter: "Dr. Priya Sharma",
    role: "Doctor",
    location: "Aizawl, Mizoram",
    disease: "Diarrhea",
    cases: 12,
    severity: "medium",
    date: "Jan 14, 2024",
  },
  {
    reporter: "ASHA Worker Ravi Kumar",
    role: "Asha",
    location: "Majuli, Assam",
    disease: "Typhoid",
    cases: 3,
    severity: "high",
    date: "Jan 13, 2024",
  },
  {
    reporter: "Dr. Anjali Gupta",
    role: "Doctor",
    location: "Churachandpur, Manipur",
    disease: "Cholera",
    cases: 2,
    severity: "critical",
    date: "Jan 12, 2024",
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredReports = reports.filter(
    (r) =>
      r.reporter.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.disease.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">ASHA & Doctor Reports</h1>
          <p className="text-gray-500">
            Review and manage health incident reports from ASHA volunteers and field teams
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg shadow hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" /> Add Manual Report
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search by reporter, location, or disease..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg outline-none text-sm bg-white text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="px-6 py-3">Reporter</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Disease</th>
              <th className="px-6 py-3">Cases</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Report Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((r, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{r.reporter}</div>
                  <div className="text-xs text-gray-500">{r.role}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{r.location}</td>
                <td className="px-6 py-4 text-gray-700">{r.disease}</td>
                <td className="px-6 py-4 text-gray-700">{r.cases}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={`capitalize px-2 py-1 text-xs rounded-md font-medium ${
                      r.severity === "critical"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : r.severity === "high"
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : r.severity === "medium"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    {r.severity}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Manual Report</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reporter Name
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                  placeholder="Enter reporter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disease
                </label>
                <select className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                  <option value="">Select disease</option>
                  <option value="Diarrhea">Diarrhea</option>
                  <option value="Typhoid">Typhoid</option>
                  <option value="Cholera">Cholera</option>
                  <option value="Hepatitis A">Hepatitis A</option>
                  <option value="Dysentery">Dysentery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Case Count
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                  placeholder="Enter number of cases"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Severity
                </label>
                <select className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                  <option value="">Select severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
              >
                Save Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

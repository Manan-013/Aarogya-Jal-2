"use client";

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

type Report = {
  id: string;
  reporter: {
    name: string;
    role: string;
  };
  location: string;
  disease: string;
  cases: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  reportDate: string; // Add reportDate to the Report type
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({
    location: "",
    disease: "",
    cases: 0,
    severity: "LOW",
    reportDate: new Date().toISOString().split('T')[0], // Initialize with today's date
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token]);

  

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("API Response for reports:", res);
      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Failed to fetch reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("You must be logged in to add a report.");
      return;
    }

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newReport,
          cases: Number(newReport.cases),
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add report");
      }
      setShowModal(false);
      fetchReports();
      setNewReport({
        location: "",
        disease: "",
        cases: 0,
        severity: "LOW",
        reportDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Failed to add report:", error);
      setError(`Failed to add report: ${error.message}`);
    }
  };

  const filteredReports = reports.slice(0, -6).filter(
    (r) =>
      (r.reporter?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
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
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">Loading reports...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-red-500">{error}</td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{r.reporter?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{r.reporter?.role || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{r.location}</td>
                  <td className="px-6 py-4 text-gray-700">{r.disease}</td>
                  <td className="px-6 py-4 text-gray-700">{r.cases}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={`capitalize px-2 py-1 text-xs rounded-md font-medium ${
                        r.severity === "CRITICAL"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : r.severity === "HIGH"
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : r.severity === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {r.severity.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(r.reportDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={newReport.location}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disease
                </label>
                <select
                  name="disease"
                  value={newReport.disease}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                >
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
                  name="cases"
                  value={newReport.cases}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                  placeholder="Enter number of cases"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Severity
                </label>
                <select
                  name="severity"
                  value={newReport.severity}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report Date
                </label>
                <input
                  type="date"
                  name="reportDate"
                  value={newReport.reportDate}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
                />
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

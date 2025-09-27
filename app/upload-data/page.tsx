"use client";
import React, { useState } from "react";
import { Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

export default function UploadData() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStatus(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (!file) {
      setStatus({ type: 'error', message: "Please select a CSV file first." });
      return;
    }
    setLoading(true);
    setStatus(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          // Basic validation of parsed data
          if (!results.data.length || !results.meta.fields.includes('disease')) {
            setStatus({ type: 'error', message: 'Invalid CSV format or empty file.' });
            setLoading(false);
            return;
          }

          const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
               // Assuming you have a way to get the token
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(results.data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload reports.');
          }

          const responseData = await response.json();
          setStatus({ type: 'success', message: `${responseData.count || results.data.length} reports uploaded successfully!` });
        } catch (error: any) {
          setStatus({ type: 'error', message: error.message || "An unknown error occurred." });
        } finally {
          setLoading(false);
        }
      },
      error: (error: any) => {
        setStatus({ type: 'error', message: error.message });
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Upload Data</h1>
        <p className="text-gray-500">
          Import ASHA & Doctor reports from a CSV file
        </p>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-16 text-center cursor-pointer hover:border-blue-400 transition"
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label
              htmlFor="fileUpload"
              className="flex flex-col items-center gap-2 text-gray-500"
            >
              <Upload className="h-10 w-10 text-gray-400" />
              {file ? (
                <span className="text-blue-600 font-medium">{file.name}</span>
              ) : (
                <>
                  <span className="font-medium text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop <br />
                  <span className="text-sm text-gray-400">
                    CSV format only
                  </span>
                </>
              )}
            </label>
          </div>

          {status && (
            <div className={`mt-4 text-center p-2 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle className="inline-block mr-2" /> : <AlertTriangle className="inline-block mr-2" />}
              {status.message}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="px-6 py-2"
            >
              {loading ? 'Uploading...' : 'Upload and Process File'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

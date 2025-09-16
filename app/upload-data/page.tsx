"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadData() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }
    alert(`Processing file: ${file.name}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Upload Data</h1>
        <p className="text-gray-500">
          Import ASHA & Doctor reports from a CSV file
        </p>
      </div>

      {/* Card Section */}
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

          {/* Button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleUpload}
              disabled={!file}
              className="px-6 py-2"
            >
              Upload and Process File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

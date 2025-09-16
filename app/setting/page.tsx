"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Profile updated!\nName: ${name}\nEmail: ${email}`);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password changed!\nCurrent: ${currentPassword}\nNew: ${newPassword}`);
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your profile and application preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mt-1 p-2 border rounded-lg text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg text-sm bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

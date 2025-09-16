"use client";

import { useState } from "react";
import { BellDot } from "lucide-react";

export default function PushNotificationPage() {
  const [disease, setDisease] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const [useAI, setUseAI] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalMessage = message;

    if (useAI) {
      finalMessage = `AI-generated alert: Stay cautious about ${disease} in ${area}!`;
      setMessage(finalMessage);
    }

    alert(`✅ Notification set for ${disease} in ${area}.
Message: ${finalMessage}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
        <BellDot className="text-blue-500" /> Push Notifications
      </h1>
      <p className="mt-2 text-gray-600">
        Configure your push notification preferences.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Disease Selection */}
        <div>
          <label className="block font-medium text-gray-800">
            Select Disease
          </label>
          <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            required
          >
            <option value="">-- Choose a disease --</option>
            <option value="Dengue">Dengue</option>
            <option value="Malaria">Malaria</option>
            <option value="COVID-19">COVID-19</option>
            <option value="Cholera">Cholera</option>
            <option value="Custom">Other (Custom)</option>
          </select>
        </div>

        {/* Area Selection */}
        <div>
          <label className="block font-medium text-gray-700">Select Area</label>
          <select
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          >
            <option value="">-- Choose an area --</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Chennai">Chennai</option>
            <option value="Other">Other (Custom)</option>
          </select>
        </div>

        {/* Manual or AI Option */}
        <div>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            Generate message with AI
          </label>
        </div>

        {/* Message Box */}
        <div>
          <label className="block font-medium text-gray-700">
            Notification Message
          </label>
          <textarea
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              useAI
                ? "AI will generate the message automatically..."
                : "Type your custom message here..."
            }
            disabled={useAI}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Notification
        </button>
      </form>
    </div>
  );
}

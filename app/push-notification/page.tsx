"use client";

import { useState } from "react";
import { BellDot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const diseaseMessages = {
  Dengue: [
    "Dengue alert! Mosquito breeding is on the rise. Take precautions.",
    "Warning: High incidence of Dengue reported in your area. Protect yourself from mosquito bites.",
    "Stay safe from Dengue. Remove stagnant water and use mosquito repellents.",
  ],
  Malaria: [
    "Malaria warning! Use mosquito nets and repellents to stay safe.",
    "Increased Malaria cases reported. Be aware of symptoms like fever and chills.",
    "Protect your family from Malaria. Ensure your surroundings are clean.",
  ],
  "COVID-19": [
    "COVID-19 update: Cases are rising. Wear masks and maintain social distancing.",
    "Stay vigilant against COVID-19. Get vaccinated and follow safety guidelines.",
    "Protect yourself and others from COVID-19. Practice good hygiene.",
  ],
  Cholera: [
    "Cholera outbreak warning! Drink boiled or purified water only.",
    "High risk of Cholera in your area. Ensure food and water are safe for consumption.",
    "Stay safe from Cholera. Wash your hands frequently and eat properly cooked food.",
  ],
  Custom: ["Custom message for other diseases."],
};

const generateAIMessage = (disease: string, area: string) => {
  const messages = diseaseMessages[disease as keyof typeof diseaseMessages] || diseaseMessages.Custom;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  return `[AI] ${randomMessage} Area: ${area}.`;
};

export default function PushNotificationPage() {
  const [disease, setDisease] = useState("");
  const [area, setArea] = useState("");
  const [message, setMessage] = useState("");
  const [useAI, setUseAI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalMessage = message;

    if (useAI) {
      finalMessage = generateAIMessage(disease, area);
      setMessage(finalMessage);
    }

    try {
      // Mock submission
      console.log("Mock creating alert with data:", {
        title: `Push Notification: ${disease} in ${area}`,
        location: area,
        severity: "MEDIUM",
        type: "DISEASE_OUTBREAK",
        disease,
        area,
      });

      alert(`✅ (Mock) Notification set for ${disease} in ${area}.\nMessage: ${finalMessage}`);
    } catch (error) {
      alert(`Failed to create alert: ${error.message}`);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen text-gray-900">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellDot className="text-blue-500" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="disease">Select Disease</Label>
                <Select onValueChange={setDisease} value={disease}>
                  <SelectTrigger id="disease">
                    <SelectValue placeholder="-- Choose a disease --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dengue">Dengue</SelectItem>
                    <SelectItem value="Malaria">Malaria</SelectItem>
                    <SelectItem value="COVID-19">COVID-19</SelectItem>
                    <SelectItem value="Cholera">Cholera</SelectItem>
                    <SelectItem value="Custom">Other (Custom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="area">Select Area</Label>
                <Select onValueChange={setArea} value={area}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="-- Choose an area --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Other">Other (Custom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="use-ai" checked={useAI} onCheckedChange={() => setUseAI(!useAI)} />
              <Label htmlFor="use-ai" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Generate message with AI
              </Label>
            </div>

            <div>
              <Label htmlFor="message">Notification Message</Label>
              <textarea
                id="message"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={useAI ? "AI will generate the message automatically..." : "Type your custom message here..."}
                disabled={useAI}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Notification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

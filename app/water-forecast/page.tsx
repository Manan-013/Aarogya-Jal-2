"use client";

import { useState, useEffect } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Waves,
  Thermometer,
  Cloudy,
  BatteryCharging,
  Gauge,
  Droplet,
  Sun,
  Moon,
  Wind,
  Cloud,
  ArrowUp,
  ArrowDown,
  WindIcon,
  XIcon,
  Bell,
  User,
} from "lucide-react";

// --- Helper function to generate dynamic forecast data for the next 14 days ---
const generateForecastData = () => {
  const data = {
    pH: [],
    Turbidity: [],
    Temperature: [],
    TDS: [],
    "Water Level": [],
    "Dissolved Oxygen": [],
  };

  const baseValues = {
    pH: 7.2,
    Turbidity: 1.5,
    Temperature: 22,
    TDS: 300,
    "Water Level": 95,
    "Dissolved Oxygen": 8.5,
  };

  const trends = ["Stable", "Improving", "Declining"];
  const icons = {
    pH: "💧",
    Turbidity: "🌫️",
    Temperature: "🌡️",
    TDS: "🧂",
    "Water Level": "🌊",
    "Dissolved Oxygen": "💨",
  };

  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i);
    const day = format(date, "EEE");

    const newPh = parseFloat((baseValues.pH + (Math.random() - 0.5) * 0.5).toFixed(1));
    data.pH.push({
      day,
      date: format(date, "yyyy-MM-dd"),
      value: newPh,
      trend: trends[Math.floor(Math.random() * trends.length)],
      icon: icons.pH,
      high: parseFloat((newPh + 0.2).toFixed(1)),
      low: parseFloat((newPh - 0.1).toFixed(1)),
    });

    const newTurbidity = parseFloat((baseValues.Turbidity + (Math.random() - 0.5) * 0.4).toFixed(1));
    data.Turbidity.push({
      day,
      date: format(date, "yyyy-MM-dd"),
      value: newTurbidity,
      trend: trends[Math.floor(Math.random() * trends.length)],
      icon: icons.Turbidity,
      high: parseFloat((newTurbidity + 0.1).toFixed(1)),
      low: parseFloat((newTurbidity - 0.1).toFixed(1)),
    });
    
    const newTemp = Math.round(baseValues.Temperature + (Math.random() - 0.5) * 4);
    data.Temperature.push({
        day,
        date: format(date, "yyyy-MM-dd"),
        value: newTemp,
        trend: trends[Math.floor(Math.random() * trends.length)],
        icon: icons.Temperature,
        high: newTemp + 1,
        low: newTemp - 1,
    });

    const newTDS = Math.round(baseValues.TDS + (Math.random() - 0.5) * 40);
    data.TDS.push({
        day,
        date: format(date, "yyyy-MM-dd"),
        value: newTDS,
        trend: trends[Math.floor(Math.random() * trends.length)],
        icon: icons.TDS,
        high: newTDS + 10,
        low: newTDS - 10,
    });

    const newWaterLevel = Math.round(baseValues["Water Level"] + (Math.random() - 0.5) * 4);
    data["Water Level"].push({
        day,
        date: format(date, "yyyy-MM-dd"),
        value: newWaterLevel,
        trend: trends[Math.floor(Math.random() * trends.length)],
        icon: icons["Water Level"],
        high: newWaterLevel + 1,
        low: newWaterLevel - 1,
    });

    const newDO = parseFloat((baseValues["Dissolved Oxygen"] + (Math.random() - 0.5) * 0.5).toFixed(1));
    data["Dissolved Oxygen"].push({
        day,
        date: format(date, "yyyy-MM-dd"),
        value: newDO,
        trend: trends[Math.floor(Math.random() * trends.length)],
        icon: icons["Dissolved Oxygen"],
        high: parseFloat((newDO + 0.1).toFixed(1)),
        low: parseFloat((newDO - 0.1).toFixed(1)),
    });
  }
  return data;
};

const mockForecastData = generateForecastData();

const mockSensorData = {
  batteryLevel: 85,
  humidity: 78,
  pressure: 1012,
  pressureTrend: "Rising",
  solarPanelStatus: "Active",
};

// --- Helper for AQI-like Water Quality Index ---
const getWaterQualityIndex = (pH, turbidity, dissolvedOxygen, tds) => {
  const pH_score = pH >= 6.5 && pH <= 8.5 ? 25 : 0;
  const turbidity_score = turbidity <= 5 ? 25 : 0;
  const do_score = dissolvedOxygen >= 5 ? 25 : 0;
  const tds_score = tds <= 500 ? 25 : 0;

  const totalScore = pH_score + turbidity_score + do_score + tds_score;
  if (totalScore >= 75) return "Good";
  if (totalScore >= 50) return "Moderate";
  if (totalScore >= 25) return "Poor";
  return "Very Poor";
};

// --- New Modal Component for Detailed View ---
const Modal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="relative w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <XIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </Button>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">
            Details for {data.day}, {format(parseISO(data.date), "MMM d")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{data.icon}</span>
              <div className="flex-1">
                <p className="text-xl font-bold">
                  pH: {data.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Trend: {data.trend}
                </p>
              </div>
            </div>
            {Object.keys(mockForecastData).filter(key => key !== 'pH').map(key => {
                const paramData = mockForecastData[key].find(item => isSameDay(parseISO(item.date), parseISO(data.date)));
                if (!paramData) return null;
                return (
                    <div key={key} className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            {key === 'Temperature' && <Thermometer className="h-5 w-5 text-red-500" />}
                            {key === 'Turbidity' && <Cloudy className="h-5 w-5 text-gray-500" />}
                            {key === 'TDS' && <Waves className="h-5 w-5 text-blue-500" />}
                            {key === 'Dissolved Oxygen' && <Droplet className="h-5 w-5 text-cyan-500" />}
                            {key === 'Water Level' && <Waves className="h-5 w-5 text-blue-500" />}
                            <p className="text-sm">{key}:</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">{paramData.value} {key === 'Temperature' ? '°C' : key === 'TDS' ? 'ppm' : key === 'Water Level' ? 'm' : ''}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{paramData.trend}</p>
                        </div>
                    </div>
                );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ForecastItem {
  day: string;
  date: string;
  value: number;
  trend: string;
  icon: string;
  high: number;
  low: number;
}

interface DailyForecast {
  pH?: ForecastItem;
  Turbidity?: ForecastItem;
  Temperature?: ForecastItem;
  TDS?: ForecastItem;
  "Water Level"?: ForecastItem;
  "Dissolved Oxygen"?: ForecastItem;
}

// --- Corrected Main Component ---
const WaterQualityForecastPage = () => {
  const today = new Date();
  const regions = ["Udaipur", "Jaipur", "Jodhpur", "Mumbai", "Delhi"];
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchDateInput, setSearchDateInput] = useState(format(today, "yyyy-MM-dd"));
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [currentDayForecast, setCurrentDayForecast] = useState<DailyForecast>({});
  const [sevenDayForecast, setSevenDayForecast] = useState<{ [key: string]: ForecastItem[] }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ForecastItem | null>(null);

  useEffect(() => {
    // Find the index of the selected date in our data
    const startIndex = mockForecastData.pH.findIndex(item => 
        isSameDay(parseISO(item.date), selectedDate)
    );

    // If the date is not found, default to the first available day
    const effectiveStartIndex = startIndex === -1 ? 0 : startIndex;

    // Set the forecast for the selected day
    const dailyData = {};
    Object.entries(mockForecastData).forEach(([key, values]) => {
      dailyData[key] = values[effectiveStartIndex];
    });
    setCurrentDayForecast(dailyData);

    // Set the 7-day forecast starting from the selected day
    const newSevenDayForecast = {};
    Object.keys(mockForecastData).forEach(key => {
      // Slice the next 7 days from the data
      newSevenDayForecast[key] = mockForecastData[key].slice(effectiveStartIndex, effectiveStartIndex + 7);
    });
    setSevenDayForecast(newSevenDayForecast);

    // Update the date input field
    setSearchDateInput(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate, selectedRegion]); 

  const handleSearch = () => {
    try {
      const parsedDate = parseISO(searchDateInput);
      if (isNaN(parsedDate.getTime())) {
        alert("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }
      setSelectedDate(parsedDate);
      console.log(`Searching for data in ${selectedRegion} on ${searchDateInput}`);
    } catch (error) {
      alert("Invalid date format. Please use YYYY-MM-DD.");
    }
  };

  const handleDayClick = (dayData) => {
    setModalData(dayData);
    setIsModalOpen(true);
  };

  const currentDayData = {
    temperature: currentDayForecast?.Temperature?.value ?? "N/A",
    pH: currentDayForecast?.pH?.value ?? "N/A",
    turbidity: currentDayForecast?.Turbidity?.value ?? "N/A",
    dissolvedOxygen: currentDayForecast?.["Dissolved Oxygen"]?.value ?? "N/A",
    tds: currentDayForecast?.TDS?.value ?? "N/A",
  };

  const waterQualityIndex = getWaterQualityIndex(
    currentDayData.pH,
    currentDayData.turbidity,
    currentDayData.dissolvedOxygen,
    currentDayData.tds
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      {/* Top Search Bar and Icons */}
      <header className="sticky top-0 z-10 w-full bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 w-full max-w-xl">
          <Input
            type="date"
            className="w-full max-w-xs p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            value={searchDateInput}
            onChange={(e) => setSearchDateInput(e.target.value)}
          />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full max-w-xs p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <Button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Search
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-4 md:p-8 space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
        {/* Main Content Area */}
        <div className="lg:flex-1 space-y-6">
          {/* Main Forecast Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 text-blue-900 dark:text-blue-50 rounded-2xl shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">
                Water Quality in {selectedRegion}, {format(selectedDate, "EEE, MMM d")}
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-blue-700 dark:text-blue-200">
                <span>Updated over an hour ago</span>
                <span className="flex items-center space-x-1">
                  <span>°C</span>
                  <span className="text-gray-400">|</span>
                  <span>°F</span>
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-6xl">{currentDayForecast?.pH?.icon || "💧"}</span>
                  <div>
                    <p className="text-5xl font-bold">
                      {currentDayForecast?.pH?.value ?? "N/A"}
                      <span className="text-2xl ml-2">pH</span>
                    </p>
                    <p className="text-xl mt-1">
                      {currentDayForecast?.pH?.trend ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-sm">High: {currentDayForecast?.Temperature?.high ?? "--"}°C</p>
                  <p className="text-sm">Low: {currentDayForecast?.Temperature?.low ?? "--"}°C</p>
                </div>
              </div>

              {/* 7-Day Forecast Strip (Horizontal Scroll) */}
              <div className="mt-8 overflow-x-auto">
                <div className="flex space-x-4 pb-2">
                  {sevenDayForecast.pH?.map((dayForecast, index) => {
                    const date = addDays(selectedDate, index);
                    return (
                      <div
                        key={index}
                        onClick={() => handleDayClick(dayForecast)}
                        className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] cursor-pointer transition-colors duration-200 ${
                          isSameDay(date, selectedDate)
                            ? "bg-blue-300 dark:bg-blue-700 shadow-md"
                            : "hover:bg-blue-150 dark:hover:bg-blue-750"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {format(date, "EEE")}
                        </span>
                        <span className="text-lg my-1">{dayForecast.icon}</span>
                        <span className="text-sm">
                          {dayForecast.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Parameter Cards */}
          <h3 className="text-2xl font-bold tracking-tight mt-8">Detailed Water Parameters</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(sevenDayForecast).map(([key, data]) => (
              <Card
                key={key}
                className="shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{key}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <XAxis dataKey="day" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:w-80 space-y-6">
          <Card className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-md font-semibold mb-2">Water Quality Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Gauge className="h-10 w-10 mx-auto text-blue-500" />
                <p className="text-3xl font-bold mt-2">
                  {waterQualityIndex}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  (0-100: Good, Moderate, Poor, Very Poor)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-md font-semibold mb-2">Sensor & Device Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Battery Level</span>
                <span className="font-bold">{mockSensorData.batteryLevel}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Humidity</span>
                <span className="font-bold">{mockSensorData.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pressure</span>
                <span className="font-bold">{mockSensorData.pressure} hPa</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pressure Trend</span>
                <span className="font-bold">{mockSensorData.pressureTrend}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Solar Panel</span>
                <span className="font-bold">{mockSensorData.solarPanelStatus}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer-like section for additional info/links */}
      <footer className="mt-8 p-4 bg-white dark:bg-gray-800 shadow-sm text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="hover:underline">Current water conditions</a>
          <a href="#" className="hover:underline">How to read a water forecast?</a>
          <a href="#" className="hover:underline">What affects water accuracy predictions?</a>
        </div>
      </footer>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={modalData} />
    </div>
  );
};

export default WaterQualityForecastPage;
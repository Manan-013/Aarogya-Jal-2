import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind + conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🔹 Device status color
export function getStatusColor(status: string): string {
  switch (status) {
    case "online":
      return "bg-green-100 text-green-700";
    case "offline":
      return "bg-gray-100 text-gray-700";
    case "error":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

// 🔹 Battery level color
export function getBatteryColor(level: number): string {
  if (level >= 80) return "text-green-500";
  if (level >= 50) return "text-yellow-500";
  if (level >= 20) return "text-orange-500";
  return "text-red-500";
}

// 🔹 Network strength color
export function getNetworkColor(strength: number): string {
  if (strength >= 80) return "text-green-500";
  if (strength >= 50) return "text-yellow-500";
  if (strength >= 20) return "text-orange-500";
  return "text-red-500";
}

// 🔹 Time since last seen
export function getTimeSinceLastSeen(lastSeen: string): string {
  const lastSeenDate = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export function Progress({ value, className, ...props }: ProgressProps) {
  let color = "bg-green-500";
  let label = "Excellent";

  if (value < 40) {
    color = "bg-red-500";
    label = "Critical";
  } else if (value < 70) {
    color = "bg-yellow-500";
    label = "Low";
  } else if (value < 90) {
    color = "bg-green-400";
    label = "Good";
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-in-out", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-600">
        <span>{value}%</span>
        <span className={color.replace("bg-", "text-")}>{label}</span>
      </div>
    </div>
  );
}

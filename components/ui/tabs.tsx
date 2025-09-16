"use client";
import * as React from "react";

export function Tabs({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  // Pass state + setter down to children
  return (
    <div className="w-full">
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsList({
  children,
  activeTab,
  setActiveTab,
}: {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}) {
  return (
    <div className="mb-3 flex gap-2 border-b">
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

export function TabsTrigger({
  children,
  value,
  activeTab,
  setActiveTab,
}: {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
  setActiveTab?: (val: string) => void;
}) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab && setActiveTab(value)}
      className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  value,
  activeTab,
}: {
  children: React.ReactNode;
  value: string;
  activeTab?: string;
}) {
  if (activeTab !== value) return null;
  return <div className="p-4">{children}</div>;
}

// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout"; // custom layout moved here

export const metadata: Metadata = {
  title: "AAROGYA JAL",
  description: "Health Surveillance System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

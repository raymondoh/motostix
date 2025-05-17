// src/app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

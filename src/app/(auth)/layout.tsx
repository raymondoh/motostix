"use client";

import type React from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </ThemeProvider>
  );
}

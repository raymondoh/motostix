"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UniversalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "dashboard" | "auth";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function UniversalButton({
  children,
  onClick,
  type = "button",
  variant = "auth",
  size = "md",
  disabled = false,
  loading = false,
  className
}: UniversalButtonProps) {
  const buttonClasses = cn(
    variant === "dashboard" ? "h-14 text-md font-bold tracking-wide uppercase" : "h-10 font-medium",
    size === "sm" && "h-8 px-3 text-sm",
    size === "lg" && (variant === "dashboard" ? "h-16 px-8" : "h-12 px-6"),
    className
  );

  return (
    <Button type={type} onClick={onClick} disabled={disabled || loading} className={buttonClasses}>
      {loading ? "Loading..." : children}
    </Button>
  );
}

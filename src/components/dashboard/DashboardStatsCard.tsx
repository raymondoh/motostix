import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ArrowDown, ArrowUp } from "lucide-react";

const trendVariants = cva("flex items-center text-xs font-medium", {
  variants: {
    trend: {
      up: "text-green-600",
      down: "text-red-600",
      neutral: "text-muted-foreground"
    }
  },
  defaultVariants: {
    trend: "neutral"
  }
});

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  className?: string;
  valueClassName?: string;
  isLoading?: boolean;
}

export function DashboardStatsCard({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
  isLoading = false
}: DashboardStatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-6",
        isLoading && "animate-pulse",
        className
      )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      <p className={cn("text-3xl font-bold mt-2", valueClassName)}>
        {isLoading ? <span className="bg-muted rounded h-9 w-24 block"></span> : value}
      </p>

      {trend && !isLoading && (
        <div className={cn(trendVariants({ trend: trend.direction }), "mt-2")}>
          {trend.direction === "up" && <ArrowUp className="h-3 w-3 mr-1" />}
          {trend.direction === "down" && <ArrowDown className="h-3 w-3 mr-1" />}
          <span>{trend.value}%</span>
          {trend.label && <span className="ml-1 text-muted-foreground">{trend.label}</span>}
        </div>
      )}
    </div>
  );
}

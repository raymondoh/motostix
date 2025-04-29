import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function getCurrencyCode(country: string): string {
  switch (country) {
    case "GB":
      return "GBP";
    case "CA":
      return "CAD";
    default:
      return "USD";
  }
}

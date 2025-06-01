import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Formats a number into a localized currency string based on country.
 */
export function formatPriceWithCode(amount: number, country: string = "GB") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: getCurrencyCode(country)
  }).format(amount); // divide if using cents
}

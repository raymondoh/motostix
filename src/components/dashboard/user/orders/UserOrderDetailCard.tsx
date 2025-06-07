"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";
// 1. Import the new 'formatPrice' function
import { formatPrice } from "@/lib/utils";
import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";
import type { Order } from "@/types/order";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UserOrderDetailCardProps {
  order: Order;
}

export function UserOrderDetailCard({ order }: UserOrderDetailCardProps) {
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const subtotal = order.amount;
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
  const total = subtotal + tax + shipping;

  const shouldShowDownload = ["processing", "shipped", "delivered"].includes(order.status);

  // Dynamic import for PDF generation - only loads when needed
  const handleDownloadReceipt = async () => {
    setIsGeneratingPdf(true);
    try {
      const { generateReceiptPdf } = await import("@/utils/generateReceiptPdf");
      await generateReceiptPdf(order);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Date:</span>
          <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Order ID:</span>
          <span>{order.id}</span>
        </div>

        {/* 2. Update all instances of the price formatting function */}
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Subtotal:</span>
          <span>{formatPrice(subtotal, "gbp")}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Tax:</span>
          <span>{formatPrice(tax, "gbp")}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Shipping:</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping, "gbp")}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-base">
          <span>Total Paid:</span>
          <span>{formatPrice(total, "gbp")}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Status:</span>
          <span className="capitalize">{order.status}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Items Ordered</h3>
        <ul className="list-disc ml-5 space-y-1 text-muted-foreground text-sm">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.quantity} × {item.name} @ {formatPrice(item.price, "gbp")}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <div className="space-y-0.5 text-muted-foreground text-sm">
          {/* Add the customer's name for clarity */}
          <p className="font-medium text-foreground">{order.customerName}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      <div className="flex justify-between pt-6 gap-4">
        <Button variant="outline" onClick={() => router.push("/user/orders")}>
          Back to Orders
        </Button>
        {shouldShowDownload && (
          <Button onClick={handleDownloadReceipt} disabled={isGeneratingPdf}>
            {isGeneratingPdf ? "Generating..." : "Download Receipt"}
          </Button>
        )}
      </div>
    </div>
  );
}

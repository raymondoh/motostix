//src/components/dashboard/user/orders/UserOrdersCard.tsx
"use client";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { formatPriceWithCode } from "@/lib/utils";
import type { Order } from "@/types/order";
import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";

interface UserOrderCardProps {
  order: Order;
}

export function UserOrderCard({ order }: UserOrderCardProps) {
  const tax = order.amount * TAX_RATE;
  const shipping = order.amount > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
  const total = order.amount + tax + shipping;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Total Paid:</span>
          <span>{formatPriceWithCode(total, "GB")}</span>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Items</h3>
          <ul className="list-disc ml-4 mt-1 space-y-1 text-muted-foreground text-sm">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.quantity} × {item.name} @ {formatPriceWithCode(item.price, "GB")}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs capitalize">
          {order.status}
        </Badge>

        <Link href={`/user/orders/${order.id}`}>
          <span className="text-sm font-medium text-primary hover:underline">View Details</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

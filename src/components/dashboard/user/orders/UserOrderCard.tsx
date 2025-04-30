"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { formatPriceWithCode } from "@/lib/utils";
import type { Order } from "@/types/order";

interface UserOrderCardProps {
  order: Order;
}

export function UserOrderCard({ order }: UserOrderCardProps) {
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
          <span>{formatPriceWithCode(order.amount, "GB")}</span>
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

      <CardFooter className="flex justify-end">
        <Badge variant="outline" className="text-xs capitalize">
          {order.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}

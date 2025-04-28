"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/utils/date";
import type { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";

interface UserOrderCardProps {
  order: Order;
}

export function UserOrderCard({ order }: UserOrderCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-base">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Items:</span>
          <span>{order.items.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Total:</span>
          <span>{formatCurrency(order.amount / 100)}</span>
        </div>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="flex justify-end">
        <Badge variant="outline" className="text-xs">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </CardFooter>
    </Card>
  );
}

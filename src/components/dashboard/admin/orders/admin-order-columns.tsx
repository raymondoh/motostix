// src/components/dashboard/admin/orders/admin-orders-columns.tsx

"use client";

import { formatDate } from "@/utils/date";
import { formatPriceWithCode } from "@/lib/utils";
import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";

import type { Order } from "@/types/order";
import type { ColumnDef } from "@tanstack/react-table";
import { updateOrderStatusAction } from "@/actions/orders/update-order-status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function getAdminOrderColumns(): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <div className="text-xs font-mono truncate max-w-[120px]">{row.original.id}</div>
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => <div>{formatDate(row.original.createdAt)}</div>
    },
    {
      accessorKey: "customerEmail",
      header: "Customer Email",
      cell: ({ row }) => <div className="truncate max-w-[180px]">{row.original.customerEmail}</div>
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const rawAmount = row.original?.amount;
        const amount = typeof rawAmount === "number" ? rawAmount : 0;

        const tax = parseFloat((amount * TAX_RATE).toFixed(2));
        const shipping = amount > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
        const total = amount + tax + shipping;

        return <span>{formatPriceWithCode(total, "GB")}</span>;
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Select
            defaultValue={order.status}
            onValueChange={async newStatus => {
              try {
                await updateOrderStatusAction(order.id, newStatus);
                toast.success("Status updated");
              } catch (error) {
                toast.error("Failed to update status");
                console.error("Update error:", error);
              }
            }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        );
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex justify-end">
            <Link href={`/admin/orders/${order.id}`} aria-label="View order details">
              <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition" />
            </Link>
          </div>
        );
      }
    }
  ];
}

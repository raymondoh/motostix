"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/types/order";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

// ===============================
// 🛒 Admin Orders Table Columns
// ===============================

export function getAdminOrderColumns(): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        const order = row.original;
        return <div className="truncate font-medium">{order.id.slice(0, 8).toUpperCase()}</div>;
      }
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="text-muted-foreground text-sm">{order.createdAt ? formatDate(order.createdAt) : "-"}</div>
        );
      }
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const order = row.original;
        return <div className="font-medium">{formatCurrency(order.amount)}</div>;
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Badge variant="outline" className="capitalize text-xs">
            {order.status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "customerEmail",
      header: "Customer Email",
      cell: ({ row }) => {
        const order = row.original;
        return <div className="text-sm truncate">{order.customerEmail}</div>;
      }
    },
    {
      id: "actions",
      header: "View",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Button variant="ghost" size="icon" asChild className="hover:text-primary" aria-label="View order">
            <Link href={`/dashboard/admin/orders/${order.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        );
      }
    }
  ];
}

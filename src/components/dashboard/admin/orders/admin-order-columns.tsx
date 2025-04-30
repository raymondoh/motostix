// "use client";

// import type { ColumnDef } from "@tanstack/react-table";
// import type { Order } from "@/types/order";
// import { formatCurrency } from "@/lib/utils";
// import { formatDate } from "@/utils/date";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Eye } from "lucide-react";
// import Link from "next/link";
// import { formatPriceWithCode } from "@/lib/utils";

// // ===============================
// // 🛒 Admin Orders Table Columns
// // ===============================

// export function getAdminOrderColumns(): ColumnDef<Order>[] {
//   return [
//     {
//       accessorKey: "id",
//       header: "Order ID",
//       cell: ({ row }) => {
//         const order = row.original;
//         return <div className="truncate font-medium">{order.id.slice(0, 8).toUpperCase()}</div>;
//       }
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Date",
//       cell: ({ row }) => {
//         const order = row.original;
//         return (
//           <div className="text-muted-foreground text-sm">{order.createdAt ? formatDate(order.createdAt) : "-"}</div>
//         );
//       }
//     },
//     // {
//     //   accessorKey: "amount",
//     //   header: "Amount",
//     //   cell: ({ row }) => {
//     //     const order = row.original;
//     //     return <div className="font-medium">{formatCurrency(order.amount)}</div>;
//     //   }
//     // },
//     {
//       accessorKey: "amount",
//       header: "Amount",
//       cell: ({ row }) => {
//         const order = row.original;
//         return <div className="font-medium">{formatPriceWithCode(order.amount, "GB")}</div>;
//       }
//     },

//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const order = row.original;
//         return (
//           <Badge variant="outline" className="capitalize text-xs">
//             {order.status}
//           </Badge>
//         );
//       }
//     },
//     {
//       accessorKey: "customerEmail",
//       header: "Customer Email",
//       cell: ({ row }) => {
//         const order = row.original;
//         return <div className="text-sm truncate">{order.customerEmail}</div>;
//       }
//     },
//     {
//       id: "actions",
//       header: "View",
//       cell: ({ row }) => {
//         const order = row.original;
//         return (
//           <Button variant="ghost" size="icon" asChild className="hover:text-primary" aria-label="View order">
//             <Link href={`/admin/orders/${order.id}`}>
//               <Eye className="h-4 w-4" />
//             </Link>
//           </Button>
//         );
//       }
//     }
//   ];
// }
// src/components/dashboard/admin/orders/admin-orders-columns.tsx

"use client";

import { formatDate } from "@/utils/date";
import { formatPriceWithCode } from "@/lib/utils";
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
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => <div className="font-medium">{formatPriceWithCode(row.original.amount / 100, "GB")}</div>
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

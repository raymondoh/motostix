"use client";

import { useState, useTransition } from "react";
import { OrdersDataTable } from "./OrdersDataTable";
import { getAdminOrderColumns } from "./admin-order-columns";
import { fetchAllOrdersClient } from "@/actions/client/fetch-all-orders-client";
import type { Order } from "@/types/order";

interface AdminOrdersClientProps {
  orders: Order[];
}

export function AdminOrdersClient({ orders }: AdminOrdersClientProps) {
  const [data, setData] = useState<Order[]>(orders);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    startTransition(async () => {
      try {
        const refreshedOrders = await fetchAllOrdersClient();
        setData(refreshedOrders);
      } catch (error) {
        console.error("Error refreshing orders:", error);
      }
    });
  };

  return (
    <OrdersDataTable data={data} columns={getAdminOrderColumns()} onRefresh={handleRefresh} isRefreshing={isPending} />
  );
}

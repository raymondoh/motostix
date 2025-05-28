// "use client";

// import {
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type ColumnDef,
//   type SortingState
// } from "@tanstack/react-table";
// import { useState } from "react";
// import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import type { Order } from "@/types/order";

// interface OrdersDataTableProps {
//   data: Order[];
//   columns: ColumnDef<Order>[];
//   onRefresh: () => void;
//   isRefreshing: boolean;
// }

// export function OrdersDataTable({ data, columns, onRefresh, isRefreshing }: OrdersDataTableProps) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [pageSize, setPageSize] = useState(10);

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       globalFilter
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     globalFilterFn: "includesString",
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel()
//   });

//   return (
//     <div className="space-y-4">
//       {/* Search and Refresh */}
//       <div className="flex items-center justify-between">
//         <div className="relative w-full max-w-xs">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search orders..."
//             value={globalFilter}
//             onChange={e => setGlobalFilter(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Button onClick={onRefresh} variant="outline" disabled={isRefreshing}>
//           <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//           <span className="sr-only">Refresh</span>
//         </Button>
//       </div>

//       {/* Table */}
//       <div className="rounded-md border overflow-x-auto">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map(headerGroup => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map(row => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map(cell => (
//                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
//                   No orders found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-end space-x-2">
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}>
//           <ChevronLeft className="h-4 w-4" />
//         </Button>
//         <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }
// src/components/dashboard/admin/orders/OrdersDataTable.tsx
"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState
} from "@tanstack/react-table";

import { DataTable } from "@/components/shared/pagination/DataTable"; // Path to your shared DataTable
import { TableToolbar } from "@/components/shared/pagination/TableToolbar"; // Path to your shared TableToolbar
import type { Order } from "@/types/order";

interface OrdersDataTableProps {
  data: Order[];
  columns: ColumnDef<Order>[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function OrdersDataTable({
  data,
  columns,
  onRefresh,
  isRefreshing // Pass this to the toolbar if you want to disable refresh while pending
}: OrdersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // No row selection for orders table in this example, can be added if needed
  // const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10 // Default page size, can be a prop if you want it configurable per table
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      // rowSelection, // Uncomment if using row selection
      pagination
    },
    // enableRowSelection: true, // Uncomment if using row selection
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection, // Uncomment if using row selection
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString", // Make sure this is appropriate for your search needs
    getRowId: (row: Order) => row.id // Assuming Order type has an 'id' field
  });

  return (
    <div className="space-y-4">
      <TableToolbar
        table={table}
        // For orders, you might search by ID, email, or customer name.
        // If you want a single global search, don't set searchKey.
        // If you want to target a specific column for the primary search input:
        // searchKey="customerEmail"
        searchPlaceholder="Search orders..." // General placeholder
        onRefresh={onRefresh}
        // No onAdd or addButtonText for orders table
        showColumnToggle={true} // Or false if you don't need it for orders
        // You can pass the isRefreshing prop to the toolbar if it supports it
        // to disable the refresh button, or handle it here.
        // For now, the Button in TableToolbar doesn't have an explicit isRefreshing prop,
        // but the onRefresh function can handle its own state if needed or be disabled via its parent.
      />

      <DataTable
        table={table}
        columns={columns}
        // pageSizeOptions can be customized here if needed for orders,
        // otherwise defaults from DataTable.tsx will be used.
      />
    </div>
  );
}

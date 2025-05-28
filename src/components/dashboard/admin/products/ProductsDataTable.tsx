// "use client";

// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type ColumnDef,
//   type SortingState
// } from "@tanstack/react-table";
// import { useState } from "react";
// import { RefreshCw, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ProductDialog } from "./ProductDialog";
// import type { Product } from "@/types/product";
// import type { Category } from "@/types/category";

// interface ProductsDataTableProps {
//   data: Product[];
//   columns: ColumnDef<Product>[];
//   onRefresh: () => void;
//   categories: Category[];
//   featuredCategories: Category[];
// }
// export function ProductsDataTable({ data, columns, onRefresh }: ProductsDataTableProps) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [page, setPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [isAddProductOpen, setIsAddProductOpen] = useState(false);

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       sorting,
//       globalFilter,
//       pagination: {
//         pageIndex: page,
//         pageSize
//       }
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     globalFilterFn: "includesString"
//   });

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const handlePageSizeChange = (newPageSize: string) => {
//     setPageSize(Number.parseInt(newPageSize, 10));
//     setPage(0);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex w-full items-center gap-2 sm:w-auto">
//           <div className="relative w-full sm:w-[300px]">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search products..."
//               value={globalFilter}
//               onChange={e => setGlobalFilter(e.target.value)}
//               className="w-full pl-8"
//             />
//           </div>
//           {onRefresh && (
//             <Button variant="outline" size="icon" onClick={onRefresh}>
//               <RefreshCw className="h-4 w-4" />
//               <span className="sr-only">Refresh</span>
//             </Button>
//           )}
//         </div>

//         <Button onClick={() => setIsAddProductOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Product
//         </Button>
//       </div>

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
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map(row => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                   {row.getVisibleCells().map(cell => (
//                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No products found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length > 0 && (
//             <span>{table.getFilteredSelectedRowModel().rows.length} row(s) selected</span>
//           )}
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <div className="flex items-center gap-2">
//             <p className="text-sm font-medium">Rows per page</p>
//             <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
//               <SelectTrigger className="h-8 w-[70px]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent side="top">
//                 {[10, 20, 30, 40, 50].map(size => (
//                   <SelectItem key={size} value={`${size}`}>
//                     {size}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="text-sm font-medium">
//             Page {page + 1} of {Math.max(1, Math.ceil(table.getFilteredRowModel().rows.length / pageSize))}
//           </div>

//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="h-8 w-8 p-0"
//               onClick={() => handlePageChange(Math.max(0, page - 1))}
//               disabled={page === 0}>
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               className="h-8 w-8 p-0"
//               onClick={() =>
//                 handlePageChange(Math.min(Math.ceil(table.getFilteredRowModel().rows.length / pageSize) - 1, page + 1))
//               }
//               disabled={page >= Math.ceil(table.getFilteredRowModel().rows.length / pageSize) - 1}>
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       <ProductDialog
//         open={isAddProductOpen}
//         onOpenChange={setIsAddProductOpen}
//         onSuccess={() => {
//           setIsAddProductOpen(false);
//           onRefresh?.(); // ✅ Refetch products after adding
//         }}
//       />
//     </div>
//   );
// }
// src/components/dashboard/admin/products/ProductsDataTable.tsx
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
  type RowSelectionState,
  type PaginationState // Import PaginationState
} from "@tanstack/react-table";

import { DataTable } from "@/components/shared/pagination/DataTable"; // Adjusted path
import { TableToolbar } from "@/components/shared/pagination/TableToolbar"; // Adjusted path
import { ProductDialog } from "./ProductDialog";
import type { Product } from "@/types/product";
// import type { Category } from "@/types/category"; // If needed for toolbar filters, etc.

interface ProductsDataTableProps {
  data: Product[];
  columns: ColumnDef<Product>[];
  onRefresh: () => void;
  // categories: Category[]; // Pass if toolbar needs them for custom filters
  // featuredCategories: Category[];
}

export function ProductsDataTable({ data, columns, onRefresh }: ProductsDataTableProps) {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // State for TanStack Table moved here
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    // Explicit pagination state
    pageIndex: 0,
    pageSize: 10 // Default page size
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination // Use the state here
    },
    enableRowSelection: false, // Example: disabled for products table
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination, // Manage pagination state
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    getRowId: (row: Product) => row.id // Assuming Product has an 'id'
  });

  return (
    <div className="space-y-4">
      <TableToolbar
        table={table} // Pass the table instance
        searchKey="name" // Or whichever key you want for primary search
        searchPlaceholder="Search products by name..."
        onRefresh={onRefresh}
        onAdd={() => setIsAddProductOpen(true)}
        addButtonText="Add Product"
        showColumnToggle={true}
      />

      <DataTable
        table={table} // Pass the table instance
        columns={columns} // Still pass columns for header/cell rendering flexibility
        // Data is now managed by the table instance itself
      />

      <ProductDialog
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        onSuccess={() => {
          setIsAddProductOpen(false);
          onRefresh?.();
        }}
      />
    </div>
  );
}

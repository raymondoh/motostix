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
// import { UserDialog } from "./UserDialog";
// import type { SerializedUser } from "@/types/user/common";
// import { getUserRowClass } from "./users-columns";

// interface UsersDataTableProps {
//   data: SerializedUser[];
//   columns: ColumnDef<SerializedUser>[];
//   onRefresh?: () => void;
// }

// export function UsersDataTable({ data, columns, onRefresh }: UsersDataTableProps) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [page, setPage] = useState(0);
//   const [pageSize, setPageSize] = useState(10);
//   const [isAddUserOpen, setIsAddUserOpen] = useState(false);

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
//               placeholder="Search users..."
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

//         <Button onClick={() => setIsAddUserOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add User
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
//           {/* <TableBody>
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
//                   No users found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody> */}
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map(row => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   className={getUserRowClass(row.original)} // ✨ Add this!
//                 >
//                   {row.getVisibleCells().map(cell => (
//                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No users found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex flex-wrap items-center gap-4 justify-between">
//         <div className="flex items-center gap-2">
//           <p className="text-sm font-medium">Rows per page</p>
//           <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
//             <SelectTrigger className="h-8 w-[70px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent side="top">
//               {[10, 20, 30, 40, 50].map(size => (
//                 <SelectItem key={size} value={size.toString()}>
//                   {size}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="text-sm font-medium">
//           Page {page + 1} of {Math.max(1, Math.ceil(table.getFilteredRowModel().rows.length / pageSize))}
//         </div>

//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0"
//             onClick={() => handlePageChange(Math.max(0, page - 1))}
//             disabled={page === 0}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             className="h-8 w-8 p-0"
//             onClick={() =>
//               handlePageChange(Math.min(Math.ceil(table.getFilteredRowModel().rows.length / pageSize) - 1, page + 1))
//             }
//             disabled={page >= Math.ceil(table.getFilteredRowModel().rows.length / pageSize) - 1}>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <UserDialog
//         open={isAddUserOpen}
//         onOpenChange={setIsAddUserOpen}
//         onSuccess={() => {
//           setIsAddUserOpen(false);
//           onRefresh?.();
//         }}
//       />
//     </div>
//   );
// }
// src/components/dashboard/admin/users/UsersDataTable.tsx
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
  type PaginationState,
  type Row // Added Row type for getRowClass
} from "@tanstack/react-table";

import { DataTable } from "@/components/shared/pagination/DataTable"; // Path to your shared DataTable
import { TableToolbar } from "@/components/shared/pagination/TableToolbar"; // Path to your shared TableToolbar
import { UserDialog } from "./UserDialog"; // For adding a new user
import type { SerializedUser } from "@/types/user/common";
import { getUserRowClass } from "./users-columns"; // Import for row styling

interface UsersDataTableProps {
  data: SerializedUser[];
  columns: ColumnDef<SerializedUser>[];
  onRefresh?: () => void; // For the global refresh button in the toolbar
  // isLoading?: boolean; // If you want to pass loading state to the toolbar
}

// Suggestion: Modify your shared DataTable.tsx to accept getRowClass prop
// interface DataTableProps<TData, TValue> {
//   // ... other props
//   getRowClass?: (row: Row<TData>) => string;
// }
// And in DataTable.tsx, in the TableBody map:
// <TableRow
//   key={row.id}
//   data-state={enableSelection && row.getIsSelected() ? "selected" : undefined}
//   className={getRowClass ? getRowClass(row) : undefined} // Apply the class here
// >

export function UsersDataTable({ data, columns, onRefresh }: UsersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    getRowId: (row: SerializedUser) => row.id
  });

  const handleAddUserSuccess = () => {
    setIsAddUserOpen(false);
    onRefresh?.(); // Refresh data after adding a user
  };

  return (
    <div className="space-y-4">
      <TableToolbar
        table={table}
        searchPlaceholder="Search users (name, email)..."
        onRefresh={onRefresh}
        onAdd={() => setIsAddUserOpen(true)} // Trigger for Add User dialog
        addButtonText="Add User"
        showColumnToggle={true}
      />

      <DataTable
        table={table}
        columns={columns}
        // To implement getUserRowClass, you would modify DataTable.tsx as commented above
        // and then pass it here:
        // getRowClass={(row) => getUserRowClass(row.original as SerializedUser)}
      />

      <UserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} onSuccess={handleAddUserSuccess} />
    </div>
  );
}

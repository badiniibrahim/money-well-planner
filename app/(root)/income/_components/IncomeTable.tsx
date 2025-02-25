"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Budget } from "@prisma/client";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { DataTableColumnHeader } from "@/components/shared/dataTable/ColumnHeader";
import { deleteIncome } from "../_actions/actions";
import DialogAction from "@/components/shared/DialogAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Wallet2 } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  budgets: Budget[];
  currency: string;
};

export function IncomeTable({ budgets = [], currency }: Props) {
  const deleteMutation = useDeleteMutation(
    "income",
    deleteIncome,
    "getAllIncome"
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const formatter = useMemo(
    () => GetFormatterForCurrency(currency),
    [currency]
  );

  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="text-slate-200 font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Wallet2 className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-200 font-medium">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          className="text-slate-200 font-semibold"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt).toLocaleDateString(
          "default",
          {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );
        return <div className="text-slate-300 font-medium">{date}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Amount"
          className="text-slate-200 font-semibold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-emerald-400 font-semibold">
          {formatter.format(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DialogAction
            entityName={row.original.name}
            entityId={row.original.id}
            entityType="income"
            deleteMutation={deleteMutation}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: budgets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet2 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Income Sources</h2>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search income sources..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 bg-slate-800/50 text-slate-200 border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-800/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-slate-700/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="p-4 text-slate-200 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-slate-700/50">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-slate-400"
                  >
                    No income sources found. Start by adding your first income!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-200">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-slate-200">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-200">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-emerald-400 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-slate-200 border-slate-700 hover:bg-slate-800 hover:text-emerald-400 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

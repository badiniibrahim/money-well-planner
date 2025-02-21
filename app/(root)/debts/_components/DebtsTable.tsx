"use client";

import DialogAction from "@/components/shared/DialogAction";
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

import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { useMemo, useState } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Debts } from "@prisma/client";
import { deleteDebts } from "../_actions/actions";
import { DataTableColumnHeader } from "@/components/shared/dataTable/ColumnHeader";

type Props = {
  debts: Debts[];
  currency: string;
};

export function DebtsTable({ debts = [], currency }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(currency);
  }, [currency]);

  const deleteMutation = useDeleteMutation("debts", deleteDebts, "getAllDebts");

  const columns: ColumnDef<Debts>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Name"
          className="text-white font-bold"
        />
      ),
      cell: ({ row }) => (
        <div className="text-white font-bold">{row.original.name}</div>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Date",
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
        return <div className="text-white font-bold">{date}</div>;
      },
    },
    {
      accessorKey: "budgetAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => (
        <p className="text-white font-bold">
          {formatter.format(row.original.budgetAmount)}
        </p>
      ),
    },

    {
      accessorKey: "remainsToBePaid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Remains ToBe Paid" />
      ),
      cell: ({ row }) => (
        <p className="text-white font-bold">
          {formatter.format(row.original.remainsToBePaid)}
        </p>
      ),
    },

    {
      accessorKey: "Actions",
      cell: ({ row }) => (
        <DialogAction
          entityName={row.original.name}
          entityId={row.original.id}
          entityType="debts"
          deleteMutation={deleteMutation}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: debts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg text-white font-bold">Debts</h1>
      </div>
      <div className="overflow-hidden rounded-lg  shadow-lg">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-white font-bold">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="p-4 text-white font-bold"
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
                  className="hover:bg-primary/90 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-4 text-white font-bold"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-gray-500 p-4"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

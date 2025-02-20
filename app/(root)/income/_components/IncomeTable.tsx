"use client";

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
} from "@tanstack/react-table";
import { Budget } from "@prisma/client";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { useMemo, useState } from "react";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { DataTableColumnHeader } from "@/components/shared/dataTable/ColumnHeader";
import { deleteIncome } from "../_actions/actions";
import DialogAction from "@/components/shared/DialogAction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(currency);
  }, [currency]);

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
        <div className="text-slate-200 font-medium">{row.original.name}</div>
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
        return <div className="text-slate-300">{date}</div>;
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
        <p className="text-emerald-400 font-medium">
          {formatter.format(row.original.amount)}
        </p>
      ),
    },
    {
      accessorKey: "Actions",
      cell: ({ row }) => (
        <DialogAction
          entityName={row.original.name}
          entityId={row.original.id}
          entityType="income"
          deleteMutation={deleteMutation}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: budgets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="w-full bg-slate-900 text-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Income</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
            <TableBody className="bg-slate-900">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-800 transition-all"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 text-slate-200">
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
                    className="text-center text-slate-400 p-4"
                  >
                    No results found. Start by adding income!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

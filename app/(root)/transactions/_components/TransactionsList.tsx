"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTransaction } from "../_actions/actions";
import { cn } from "@/lib/utils";
import {
  Receipt,
  MoreHorizontal,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftRight,
  Calendar,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface Category {
  id: number;
  name: string;
  type: string;
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string | null;
  date: Date;
  categoryId: number | null;
  category: Category | null;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
}

interface Props {
  transactions: Transaction[];
  categories: Category[];
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllTransactions"] });
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return ArrowUpCircle;
      case "expense":
        return ArrowDownCircle;
      case "transfer":
        return ArrowLeftRight;
      default:
        return Receipt;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-emerald-400 bg-emerald-400/10";
      case "expense":
        return "text-rose-400 bg-rose-400/10";
      case "transfer":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };

  const Icon = getTransactionIcon(transaction.type);
  const colorClass = getTransactionColor(transaction.type);

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden",
          "bg-gradient-to-b from-slate-900/50 via-slate-900/50 to-slate-800/50",
          "border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/10" />
        <div className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg p-2.5 transition-transform group-hover:scale-110",
                  colorClass
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {transaction.amount.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h3>
                  <span
                    className={cn(
                      "text-xs font-medium px-2.5 py-0.5 rounded-full",
                      colorClass
                    )}
                  >
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </span>
                </div>
                {transaction.description && (
                  <p className="text-sm text-slate-400 mt-1">
                    {transaction.description}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-slate-300">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-rose-400 focus:text-rose-400 focus:bg-slate-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Transaction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </span>
            </div>
            {transaction.category && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">
                  {transaction.category.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Transaction
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(transaction.id);
                setShowDeleteDialog(false);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function TransactionsList({ transactions, categories }: Props) {
  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a, b) => {
      // Trier par date (plus récent en premier)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [transactions]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedTransactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}

export default TransactionsList;

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCategory } from "../_actions/actions";
import { cn } from "@/lib/utils";
import {
  FolderTree,
  MoreHorizontal,
  Trash2,
  Wallet,
  Receipt,
  PiggyBank,
  TrendingUp,
  CreditCard,
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

interface Budget {
  id: number;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  date: Date;
  amount: number;
  categoryId: number | null;
}

interface Expense {
  id: number;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  budgetAmount: number;
  categoryId: number | null;
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string | null;
  date: Date;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
}

interface Category {
  id: number;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  budgets: Budget[];
  expenses: Expense[];
  transactions: Transaction[];
}

interface CategoryCardProps {
  category: Category;
}

interface CategoriesListProps {
  categories: Category[];
}

function CategoryCard({ category }: CategoryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "income":
        return Wallet;
      case "expense":
        return Receipt;
      case "savings":
        return PiggyBank;
      case "investment":
        return TrendingUp;
      case "debt":
        return CreditCard;
      default:
        return FolderTree;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-emerald-400 bg-emerald-400/10";
      case "expense":
        return "text-rose-400 bg-rose-400/10";
      case "savings":
        return "text-blue-400 bg-blue-400/10";
      case "investment":
        return "text-amber-400 bg-amber-400/10";
      case "debt":
        return "text-purple-400 bg-purple-400/10";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };

  const Icon = getCategoryIcon(category.type);
  const colorClass = getCategoryColor(category.type);
  const totalItems =
    category.budgets.length +
    category.expenses.length +
    category.transactions.length;

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
          <div className="flex items-center justify-between mb-4">
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
                <h3 className="text-lg font-bold text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-400 capitalize">
                  {category.type}
                </p>
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
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
            {category.color && (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this category? This action cannot
              be undone and will affect all associated items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate(category.id);
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

function CategoriesList({ categories }: CategoriesListProps) {
  const sortedCategories = React.useMemo(() => {
    return [...categories].sort((a, b) => {
      // Trier par type
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      // Puis par nom
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sortedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default CategoriesList;

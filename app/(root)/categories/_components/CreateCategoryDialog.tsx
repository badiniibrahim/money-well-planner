"use client";

import React, { ReactNode, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, FolderTree, PlusCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  CategorySchema,
  CategoryType,
} from "@/src/entities/models/categories/categories";
import { createCategory } from "../_actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  trigger: ReactNode;
}

function CreateCategoryDialog({ trigger }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CategoryType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      type: "expense",
      icon: "",
      color: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully", { id: "create-category" });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
    onError: () => {
      toast.error("Failed to create category", { id: "create-category" });
    },
  });

  const onSubmit = useCallback(
    (values: CategoryType) => {
      toast.loading("Creating category...", { id: "create-category" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 text-white">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            onClick={() => setDialogOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-purple-400">
            <FolderTree className="h-6 w-6" />
            New Category
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Create a new category to organize your financial activities.
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-slate-800/50 border-slate-700/50 mt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Category Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Groceries, Utilities, Salary"
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Category Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="income" className="text-slate-200">
                          Income
                        </SelectItem>
                        <SelectItem value="expense" className="text-slate-200">
                          Expense
                        </SelectItem>
                        <SelectItem value="savings" className="text-slate-200">
                          Savings
                        </SelectItem>
                        <SelectItem
                          value="investment"
                          className="text-slate-200"
                        >
                          Investment
                        </SelectItem>
                        <SelectItem value="debt" className="text-slate-200">
                          Debt
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Color (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        className="h-10 px-2 bg-slate-700/50 border-slate-600 text-white focus:border-purple-500 focus:ring-purple-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {!isPending ? (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    Create Category
                  </>
                ) : (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCategoryDialog;

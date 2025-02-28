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
import {
  Loader2,
  Receipt,
  PlusCircle,
  X,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { createTransaction } from "../_actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  TransactionSchema,
  TransactionType,
} from "@/src/entities/models/transaction/transaction";

interface Category {
  id: number;
  name: string;
  type: string;
}

interface Props {
  trigger: ReactNode;
  categories: Category[];
}

function CreateTransactionDialog({ trigger, categories }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<TransactionType>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      amount: 0,
      type: "expense",
      description: "",
      date: new Date(),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully", {
        id: "create-transaction",
      });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllTransactions"] });
    },
    onError: () => {
      toast.error("Failed to create transaction", { id: "create-transaction" });
    },
  });

  const onSubmit = useCallback(
    (values: TransactionType) => {
      toast.loading("Creating transaction...", { id: "create-transaction" });
      mutate(values);
    },
    [mutate]
  );

  const filteredCategories = form.watch("type")
    ? categories.filter((cat) => cat.type === form.watch("type"))
    : categories;

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
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-emerald-400">
            <Receipt className="h-6 w-6" />
            New Transaction
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Record a new financial transaction.
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Transaction Type
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-emerald-500">
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
                        <SelectItem value="transfer" className="text-slate-200">
                          Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Input
                          type="date"
                          {...field}
                          value={format(field.value, "yyyy-MM-dd")}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                          className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-emerald-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {filteredCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="text-slate-200"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add some details about the transaction..."
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {!isPending ? (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    Create Transaction
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

export default CreateTransactionDialog;

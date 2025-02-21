"use client";

import React, { ReactNode, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Calendar as CalendarIcon, Loader2, DollarSign } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  ExpensesSchema,
  ExpensesType,
} from "@/src/entities/models/charges/expense";

import { createCharge } from "../../charges/_actions/actions";

type ExpenseType = "fixed" | "variable";

interface Props {
  trigger: ReactNode;
  type: ExpenseType;
}

function CreateExpensesDialog({ trigger, type }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ExpensesType>({
    resolver: zodResolver(ExpensesSchema),
    defaultValues: {
      name: "",
      type,
      budgetAmount: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ExpensesType) => createCharge({ ...values, type }),
    onSuccess: () => {
      toast.success(`${type} Expense created`, {
        id: "create-expense",
      });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllCharge"] });
    },
    onError: () => {
      toast.error(`Failed to create ${type} Expense`, {
        id: "create-expense",
      });
    },
  });

  const onSubmit = useCallback(
    (values: ExpensesType) => {
      toast.loading(`Creating ${type} expense...`, {
        id: "create-expense",
      });
      mutate(values);
    },
    [mutate, type]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            New {type} expense
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter expense name"
                      {...field}
                      className="bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {type === "fixed" && (
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Due date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full bg-slate-800 border-slate-700 text-white",
                              !field.value && "text-slate-400"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="bg-slate-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              {!isPending && "Create Expense"}
              {isPending && <Loader2 className="animate-spin mr-2" />}
              {isPending && "Creating..."}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateExpensesDialog;

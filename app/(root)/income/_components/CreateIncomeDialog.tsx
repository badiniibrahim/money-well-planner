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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, PlusCircle, X, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  IncomeSchema,
  IncomeSchemaType,
} from "@/src/entities/models/income/income";
import { createIncome } from "../_actions/actions";

interface Props {
  trigger: ReactNode;
}

function CreateIncomeDialog({ trigger }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<IncomeSchemaType>({
    resolver: zodResolver(IncomeSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      toast.success("Income created", { id: "create-income" });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllIncome"] });
    },
    onError: () => {
      toast.error("Failed to create income", { id: "create-income" });
    },
  });

  const onSubmit = useCallback(
    (values: IncomeSchemaType) => {
      toast.loading("Creating income...", { id: "create-income" });
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
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-emerald-400">
            <Wallet className="h-6 w-6" />
            Add New Income
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Enter the details of your new income source below.
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
                      Income Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Salary, Freelance"
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </FormControl>
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
                          className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
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
                    Add Income
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

export default CreateIncomeDialog;

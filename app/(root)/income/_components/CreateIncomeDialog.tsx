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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, PlusCircle } from "lucide-react";
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
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Add New Income
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-slate-800/50 p-5 border-slate-700/50 backdrop-blur-xl mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      Income Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Salary, Freelance"
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
                    <FormLabel className="text-sm font-medium text-slate-300">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                disabled={isPending}
              >
                {!isPending && (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Income
                  </>
                )}
                {isPending && <Loader2 className="animate-spin mr-2" />}
                {isPending && "Processing..."}
              </Button>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default CreateIncomeDialog;

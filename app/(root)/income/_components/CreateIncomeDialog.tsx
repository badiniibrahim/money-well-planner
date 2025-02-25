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
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white transition-all duration-300 ease-in-out">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Add New Income
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the details of your new income source below.
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-gray-700 border-gray-600 mt-6">
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
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Income Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Salary, Freelance"
                        {...field}
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        aria-label="Income name"
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
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <DollarSign className="absolute left-3 text-gray-400" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 pl-10"
                          aria-label="Income amount"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
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

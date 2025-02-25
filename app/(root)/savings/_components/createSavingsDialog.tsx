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
  PiggyBank,
  Briefcase,
  PlusCircle,
  X,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  SavingsSchema,
  SavingsType,
} from "@/src/entities/models/savings/savings";
import { createSavings } from "../_actions/actions";

type ExpenseType = "saving" | "invest";

interface Props {
  trigger: ReactNode;
  type: ExpenseType;
}

function CreateSavingsDialog({ trigger, type }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<SavingsType>({
    resolver: zodResolver(SavingsSchema),
    defaultValues: {
      name: "",
      budgetAmount: 0,
      type: "saving",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SavingsType) => createSavings({ ...values, type }),
    onSuccess: () => {
      toast.success(
        `${type === "saving" ? "Savings" : "Investment"} created successfully`,
        {
          id: "create-savings",
        }
      );
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllSavings"] });
    },
    onError: () => {
      toast.error(
        `Failed to create ${type === "saving" ? "savings" : "investment"}`,
        {
          id: "create-savings",
        }
      );
    },
  });

  const onSubmit = useCallback(
    (values: SavingsType) => {
      toast.loading(
        `Creating ${type === "saving" ? "savings" : "investment"}...`,
        {
          id: "create-savings",
        }
      );
      mutate(values);
    },
    [mutate, type]
  );

  const getThemeColor = () => (type === "saving" ? "blue" : "amber");
  const getIcon = () => (type === "saving" ? PiggyBank : Briefcase);
  const Icon = getIcon();

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
          <DialogTitle
            className={`text-2xl font-bold flex items-center gap-2 text-${getThemeColor()}-400`}
          >
            <Icon className="h-6 w-6" />
            {type === "saving" ? "New Savings Goal" : "New Investment"}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {type === "saving"
              ? "Set a new savings goal to secure your financial future."
              : "Create a new investment to grow your wealth over time."}
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
                      {type === "saving"
                        ? "Savings Goal Name"
                        : "Investment Name"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          type === "saving"
                            ? "e.g. Emergency Fund, House Down Payment"
                            : "e.g. Stock Portfolio, Real Estate"
                        }
                        {...field}
                        className={`bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-${getThemeColor()}-500 focus:ring-${getThemeColor()}-500`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Target Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-${getThemeColor()}-500 focus:ring-${getThemeColor()}-500`}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={`w-full bg-${getThemeColor()}-600 hover:bg-${getThemeColor()}-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                disabled={isPending}
              >
                {!isPending ? (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    {type === "saving"
                      ? "Create Savings Goal"
                      : "Create Investment"}
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

export default CreateSavingsDialog;

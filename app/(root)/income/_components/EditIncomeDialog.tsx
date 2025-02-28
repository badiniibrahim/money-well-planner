"use client";

import React, { ReactNode, useState, useCallback, useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  DollarSign,
  Save,
  X,
  Wallet,
  CalendarIcon,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  IncomeSchema,
  IncomeSchemaType,
} from "@/src/entities/models/income/income";
import { getIncomeById, updateIncome } from "../_actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Budget } from "@prisma/client";

interface Props {
  trigger: ReactNode;
  incomeId: number;
  categories?: { id: number; name: string }[];
}

const INCOME_CATEGORIES = [
  { id: 1, name: "Salary" },
  { id: 2, name: "Freelance" },
  { id: 3, name: "Investments" },
  { id: 4, name: "Rental" },
  { id: 5, name: "Business" },
  { id: 6, name: "Gifts" },
  { id: 7, name: "Other" },
];

function EditIncomeDialog({
  trigger,
  incomeId,
  categories = INCOME_CATEGORIES,
}: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<IncomeSchemaType>({
    resolver: zodResolver(IncomeSchema),
    defaultValues: {
      name: "",
      amount: 0,
      date: new Date(),
      type: "budget",
      categoryId: undefined,
    },
  });

  const fetchIncomeData = async () => {
    try {
      setIsLoading(true);
      const income = await getIncomeById(incomeId);
      if (income) {
        form.reset({
          name: income.name,
          amount: income.amount,
          date: new Date(income.date),
          type: income.type,
          categoryId: income.categoryId || undefined,
        });
      }
    } catch (error) {
      toast.error("Failed to load income data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchIncomeData();
    }
  }, [isDialogOpen, incomeId]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: IncomeSchemaType) => updateIncome(incomeId, values),
    onSuccess: () => {
      toast.success("Income updated", { id: "update-income" });
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllIncome"] });
    },
    onError: () => {
      toast.error("Failed to update income", { id: "update-income" });
    },
  });

  const onSubmit = useCallback(
    (values: IncomeSchemaType) => {
      toast.loading("Updating income...", { id: "update-income" });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild onClick={() => setDialogOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 text-white">
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
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-blue-400">
            <Wallet className="h-6 w-6" />
            Edit Income
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Update the details of your income source.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : (
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
                            className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
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
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-slate-200">
                        Date Received
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50",
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
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500">
                            <SelectValue placeholder="Select a category">
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-slate-400" />
                                <span>
                                  {field.value
                                    ? categories.find(
                                        (cat) => cat.id === field.value
                                      )?.name || "Select a category"
                                    : "Select a category"}
                                </span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                              className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-slate-400 text-xs">
                        Categorizing your income helps with better financial
                        analysis
                      </FormDescription>
                      <FormMessage className="text-red-400 text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isPending}
                >
                  {!isPending ? (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditIncomeDialog;

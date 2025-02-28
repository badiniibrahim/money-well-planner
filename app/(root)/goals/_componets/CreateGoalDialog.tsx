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
  Target,
  PlusCircle,
  X,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { GoalSchema, GoalType } from "@/src/entities/models/goals/goals";
import { createGoal } from "../_actions/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  trigger: ReactNode;
}

function CreateGoalDialog({ trigger }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<GoalType>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      description: "",
      priority: "medium",
      targetDate: new Date(),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      toast.success("Financial goal created successfully", {
        id: "create-goal",
      });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllGoals"] });
    },
    onError: () => {
      toast.error("Failed to create financial goal", { id: "create-goal" });
    },
  });

  const onSubmit = useCallback(
    (values: GoalType) => {
      toast.loading("Creating financial goal...", { id: "create-goal" });
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
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-blue-400">
            <Target className="h-6 w-6" />
            New Financial Goal
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Set a new financial goal and track your progress towards achieving
            it.
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
                      Goal Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Emergency Fund, House Down Payment"
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
                name="targetAmount"
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
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
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Target Date
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-200">
                      Priority
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:ring-blue-500">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="low" className="text-slate-200">
                          Low
                        </SelectItem>
                        <SelectItem value="medium" className="text-slate-200">
                          Medium
                        </SelectItem>
                        <SelectItem value="high" className="text-slate-200">
                          High
                        </SelectItem>
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
                        placeholder="Add some details about your goal..."
                        {...field}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                      />
                    </FormControl>
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
                    <PlusCircle className="h-5 w-5" />
                    Create Goal
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

export default CreateGoalDialog;

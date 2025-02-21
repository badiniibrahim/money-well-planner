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
import { Loader2 } from "lucide-react";
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
      toast.success(`${type}  created`, {
        id: "create-savings",
      });
      form.reset();
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllSavings"] });
    },
    onError: () => {
      toast.error(`Failed to create ${type}`, {
        id: "create-savings",
      });
    },
  });

  const onSubmit = useCallback(
    (values: SavingsType) => {
      toast.loading(`Creating ${type} ...`, {
        id: "create-savings",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span className="text-primary">{`${" "}${type} `}</span>
          </DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Create"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSavingsDialog;

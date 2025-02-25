"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/shared/SkeletonWrapper";
import { toast } from "sonner";
import { Loader2, DollarSign, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CurrencyComboBox() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null);

  // Fetch user settings
  const userSettings = useQuery({
    queryKey: ["userSettings"],
    queryFn: () =>
      fetch("/api/user-settings", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    staleTime: 300000, // Cache data for 5 minutes
  });

  useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  // Mutation to update currency
  const mutation = useMutation({
    mutationFn: async (currency: string) => {
      const res = await fetch("/api/user-settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      if (!res.ok) throw new Error("Failed to update currency");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Currency updated successfully", {
        id: "update-currency",
      });
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: () => {
      toast.error("Failed to update currency", { id: "update-currency" });
    },
  });

  const handleSelectionOption = useCallback(
    (value: Currency | null) => {
      if (!value) {
        toast.error("Please select a currency");
        return;
      }
      toast.loading("Updating currency...", { id: "update-currency" });
      mutation.mutate(value.value);
    },
    [mutation]
  );

  // Memoized currency options
  const currencyOptions = useMemo(() => Currencies, []);

  const ComboBox = () => (
    <SkeletonWrapper isLoading={userSettings.isLoading}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select currency"
            className={cn(
              "w-full justify-between bg-slate-800/50 border-slate-700/50 text-slate-200",
              "hover:bg-slate-700/50 hover:border-slate-600/50",
              "focus:ring-offset-slate-900 focus:ring-slate-700"
            )}
            disabled={mutation.isPending}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              {selectedOption ? (
                <>
                  <span className="font-medium">{selectedOption.label}</span>
                  <span className="text-slate-400">
                    ({selectedOption.value})
                  </span>
                </>
              ) : (
                <span className="text-slate-400">Select currency</span>
              )}
            </div>
            {mutation.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin text-slate-400" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] p-0 bg-slate-800 border-slate-700/50 shadow-lg"
          align="start"
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search currencies..."
              className="border-none bg-slate-800 text-slate-200 placeholder:text-slate-400"
            />
            <CommandList className="max-h-[300px] overflow-auto">
              <CommandEmpty className="py-6 text-center text-sm text-slate-400">
                No currency found.
              </CommandEmpty>
              <CommandGroup>
                {currencyOptions.map((currency) => (
                  <CommandItem
                    key={currency.value}
                    value={currency.value}
                    onSelect={() => {
                      handleSelectionOption(currency);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between px-4 py-2 cursor-pointer text-slate-200 hover:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.label}</span>
                      <span className="text-slate-400">({currency.value})</span>
                    </div>
                    {selectedOption?.value === currency.value && (
                      <Check className="h-4 w-4 text-emerald-400" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </SkeletonWrapper>
  );

  if (isDesktop) {
    return <ComboBox />;
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between bg-slate-800/50 border-slate-700/50 text-slate-200",
              "hover:bg-slate-700/50 hover:border-slate-600/50",
              "focus:ring-offset-slate-900 focus:ring-slate-700"
            )}
            disabled={mutation.isPending}
            aria-label="Select currency"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              {selectedOption ? (
                <>
                  <span className="font-medium">{selectedOption.label}</span>
                  <span className="text-slate-400">
                    ({selectedOption.value})
                  </span>
                </>
              ) : (
                <span className="text-slate-400">Select currency</span>
              )}
            </div>
            {mutation.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin text-slate-400" />
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-slate-900 border-t border-slate-700/50">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Select Currency
            </h2>
            <Command className="bg-transparent">
              <CommandInput
                placeholder="Search currencies..."
                className="border-slate-700/50 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 mb-2"
              />
              <CommandList className="max-h-[300px] overflow-auto">
                <CommandEmpty className="py-6 text-center text-sm text-slate-400">
                  No currency found.
                </CommandEmpty>
                <CommandGroup>
                  {currencyOptions.map((currency) => (
                    <CommandItem
                      key={currency.value}
                      value={currency.value}
                      onSelect={() => {
                        handleSelectionOption(currency);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer text-slate-200 hover:bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.label}</span>
                        <span className="text-slate-400">
                          ({currency.value})
                        </span>
                      </div>
                      {selectedOption?.value === currency.value && (
                        <Check className="h-4 w-4 text-emerald-400" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}
